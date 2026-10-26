"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Home,
  Lightbulb,
  Loader2,
  MessageCircle,
  RefreshCw,
  Search,
  Sparkles,
  BookOpen,
  Star,
  XCircle,
} from "lucide-react";
import clsx from "clsx";
import SiteHeader from "@/components/SiteHeader";
import { ContentBlock } from "@/components/ContentBlock";
import { FIELD_LABELS, type PublicQuestion } from "@/lib/shared";

interface KpInfo {
  id: string;
  kpTitle: string;
  topicNumber: number;
  topicTitle: string;
}

interface MasteryState {
  status: string;
  streak: number;
}

interface CheckResult {
  correct: boolean;
  level: number;
  text: string;
  attemptsUsed: number;
  canNext: boolean;
  mastery: MasteryState;
  mastered: boolean;
  masteredNow: boolean;
  nextKp: { id: string; title: string } | null;
}

export default function PracticeClient({
  kp,
  initialQuestion,
  initialMeta,
  initialMastery,
  nextKp,
  studentName,
}: {
  kp: KpInfo;
  initialQuestion: PublicQuestion;
  initialMeta: { index: number; total: number };
  initialMastery: MasteryState;
  nextKp: { id: string; title: string } | null;
  studentName: string;
}) {
  const [question, setQuestion] = useState<PublicQuestion>(initialQuestion);
  const [meta, setMeta] = useState(initialMeta);
  const [mastery, setMastery] = useState<MasteryState>(initialMastery);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [netError, setNetError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const startRef = useRef(Date.now());

  const mastered = mastery.status === "mastered";

  const ready =
    question.type === "multiple_choice"
      ? selected !== null
      : (question.fields ?? []).every((f) => (answers[f] ?? "").trim() !== "");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!ready || submitting || result) return;
    setSubmitting(true);
    setNetError(null);
    const timeSpentSeconds = Math.round((Date.now() - startRef.current) / 1000);
    const payload =
      question.type === "multiple_choice"
        ? { answer: selected ?? "" }
        : answers;
    try {
      const res = await fetch("/api/practice/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kpId: kp.id,
          questionId: question.id,
          answer: payload,
          timeSpentSeconds,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNetError(data.error ?? "Terjadi kesalahan. Coba lagi ya.");
        return;
      }
      const r = data as CheckResult;
      setResult(r);
      if (!r.correct) setAttemptsUsed(r.attemptsUsed);
      setMastery(r.mastery);
      startRef.current = Date.now();
    } catch {
      setNetError("Koneksi bermasalah. Coba lagi ya.");
    } finally {
      setSubmitting(false);
    }
  }

  function retry() {
    setResult(null);
    setNetError(null);
    startRef.current = Date.now();
  }

  async function nextQuestion() {
    setLoadingNext(true);
    setNetError(null);
    try {
      const res = await fetch(
        `/api/practice/question?kpId=${encodeURIComponent(kp.id)}`
      );
      const data = await res.json();
      if (res.ok) {
        setQuestion(data.question as PublicQuestion);
        setMeta({ index: data.questionIndex, total: data.totalQuestions });
        setMastery(data.mastery);
        setAnswers({});
        setSelected(null);
        setAttemptsUsed(0);
        setResult(null);
        startRef.current = Date.now();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setNetError(data.error ?? "Gagal memuat soal berikutnya.");
      }
    } catch {
      setNetError("Koneksi bermasalah. Coba lagi ya.");
    } finally {
      setLoadingNext(false);
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader name={studentName} context={`${kp.id} · ${kp.kpTitle}`} />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-6 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/learn/${kp.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Materi
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-2">
            Soal {meta.index + 1}/{meta.total}
          </span>
        </div>

        {/* Status strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="card-lift mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl border border-ink/10 bg-white px-5 py-3.5"
        >
          <div className="flex items-center gap-2.5">
            <span className="rounded-lg bg-brand-800 px-2.5 py-1 text-xs font-bold tracking-widest text-brand-50">
              {kp.id}
            </span>
            <span className="text-sm font-semibold text-ink">{kp.kpTitle}</span>
          </div>
          <StreakPips streak={mastery.streak} mastered={mastered} />
        </motion.div>

        {mastered && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-brand-600/30 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            KP ini sudah kamu kuasai — ini mode latihan ulang.
          </motion.p>
        )}

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.section
            key={question.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="card-lift mt-5 overflow-hidden rounded-3xl border border-ink/10 bg-white"
          >
            <header className="flex items-center justify-between border-b border-ink/8 bg-paper-2/70 px-5 py-3.5 sm:px-6">
              <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-ink">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-gold-500 text-white">
                  <Star className="h-3.5 w-3.5" />
                </span>
                Soal
              </span>
              <span className="flex items-center gap-0.5" title="Tingkat kesulitan">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={clsx(
                      "h-3.5 w-3.5",
                      s <= question.difficulty
                        ? "fill-gold-500 text-gold-500"
                        : "text-ink/20"
                    )}
                  />
                ))}
              </span>
            </header>

            <form onSubmit={submit} className="px-5 py-6 sm:px-7">
              <ContentBlock text={question.prompt} />

              {question.type === "multiple_choice" && question.choices ? (
                <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {question.choices.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      disabled={!!result}
                      onClick={() => setSelected(c.key)}
                      className={clsx(
                        "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition",
                        selected === c.key
                          ? "border-brand-600 bg-brand-50 text-brand-900 shadow-sm"
                          : "border-ink/12 bg-white text-ink hover:border-brand-600/40 hover:bg-brand-50/40",
                        !!result && "cursor-default opacity-90"
                      )}
                    >
                      <span
                        className={clsx(
                          "grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-[10px] font-bold uppercase",
                          selected === c.key
                            ? "border-brand-600 bg-brand-700 text-brand-50"
                            : "border-ink/20 text-ink-2"
                        )}
                      >
                        {c.key}
                      </span>
                      <span>{c.text}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-5">
                  {(question.fields ?? []).map((f) => (
                    <label key={f} className="flex items-center gap-2.5">
                      <span className="font-display text-xl font-semibold italic text-ink">
                        {FIELD_LABELS[f] ?? f} =
                      </span>
                      <input
                        type="text"
                        inputMode="text"
                        disabled={!!result}
                        value={answers[f] ?? ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [f]: e.target.value }))
                        }
                        placeholder="?"
                        className={clsx(
                          "underline-input py-1 text-center font-mono text-lg font-bold text-brand-900",
                          f === "answer" ? "w-52 sm:w-64" : "w-20"
                        )}
                      />
                    </label>
                  ))}
                </div>
              )}

              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-ink/15 pt-5">
                <AttemptDots used={attemptsUsed} />
                <button
                  type="submit"
                  disabled={!ready || submitting || !!result}
                  className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold tracking-wide text-brand-50 shadow-md transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      CEK JAWABAN
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.section>
        </AnimatePresence>

        {netError && (
          <p className="mt-4 rounded-lg border border-clay-500/30 bg-clay-100 px-3.5 py-2.5 text-sm font-medium text-clay-700">
            {netError}
          </p>
        )}

        {/* Feedback */}
        <AnimatePresence mode="wait">
          {result ? (
            result.masteredNow ? (
              <MasteredPanel key="mastered" result={result} kpId={kp.id} fallbackNext={nextKp} onPracticeAgain={nextQuestion} loading={loadingNext} />
            ) : (
              <FeedbackPanel
                key={`fb-${question.id}-${result.level}-${result.correct}`}
                result={result}
                onRetry={retry}
                onNext={nextQuestion}
                loading={loadingNext}
              />
            )
          ) : (
            <motion.section
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-dashed border-ink/15 px-5 py-5 text-sm font-medium text-ink-2/80"
            >
              <MessageCircle className="h-5 w-5 shrink-0" />
              Umpan balik akan muncul di sini setelah kamu menjawab. Jangan
              takut salah — setiap kesalahan dibalas petunjuk yang makin detail.
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ---------------------------------- Pieces ---------------------------------- */

function StreakPips({ streak, mastered }: { streak: number; mastered: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-2">
        Benar berturut
      </span>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={clsx(
              "h-3.5 w-3.5 rounded-full transition-colors",
              mastered || i < streak
                ? "bg-gold-500 shadow-[0_0_0_3px] shadow-gold-500/20"
                : "border-2 border-ink/20 bg-white"
            )}
          />
        ))}
      </div>
      <span className="text-xs font-bold text-gold-700">
        {mastered ? "Dikuasai!" : `${streak}/3`}
      </span>
    </div>
  );
}

function AttemptDots({ used }: { used: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-2">
        Percobaan
      </span>
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={clsx(
              "h-3 w-3 rounded-full transition-colors",
              i < used
                ? "bg-clay-500"
                : "border-2 border-ink/25 bg-white"
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-ink-2">maks 3</span>
    </div>
  );
}

function FeedbackPanel({
  result,
  onRetry,
  onNext,
  loading,
}: {
  result: CheckResult;
  onRetry: () => void;
  onNext: () => void;
  loading: boolean;
}) {
  const correct = result.correct;
  const tone = correct
    ? {
        wrap: "border-brand-600/30 bg-brand-50",
        badge: "bg-brand-600 text-brand-50",
        title: "TEPAT!",
        icon: BadgeCheck,
        titleCls: "text-brand-800",
      }
    : result.level === 1
      ? {
          wrap: "border-amber-500/30 bg-amber-50",
          badge: "bg-amber-500 text-white",
          title: `Belum tepat. Percobaan ${result.level}/3`,
          icon: Lightbulb,
          titleCls: "text-amber-800",
        }
      : result.level === 2
        ? {
            wrap: "border-orange-500/30 bg-orange-50",
            badge: "bg-orange-500 text-white",
            title: `Masih belum tepat. Percobaan ${result.level}/3`,
            icon: Search,
            titleCls: "text-orange-800",
          }
        : {
            wrap: "border-clay-500/30 bg-clay-100/60",
            badge: "bg-clay-500 text-white",
            title: `Percobaan ${result.level}/3 — mari selesaikan bersama`,
            icon: BookOpen,
            titleCls: "text-clay-700",
          };

  const Icon = tone.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={clsx("card-lift mt-6 overflow-hidden rounded-3xl border", tone.wrap)}
    >
      <header className="flex items-center justify-between gap-3 border-b border-ink/8 px-5 py-3.5 sm:px-6">
        <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-ink">
          <span
            className={clsx(
              "grid h-7 w-7 place-items-center rounded-lg",
              tone.badge
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
          Umpan Balik
        </span>
        {correct ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-bold text-brand-700">
            <BadgeCheck className="h-3.5 w-3.5" /> Benar
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-bold text-clay-700">
            <XCircle className="h-3.5 w-3.5" /> Salah
          </span>
        )}
      </header>

      <div className="px-5 py-5 sm:px-6">
        <h3 className={clsx("font-display text-xl font-bold", tone.titleCls)}>
          {tone.title}
        </h3>
        <ContentBlock text={result.text} className="mt-3" />

        <div className="mt-5 flex flex-wrap gap-2.5">
          {correct ? (
            <button
              onClick={onNext}
              disabled={loading}
              className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold tracking-wide text-brand-50 shadow-md transition hover:bg-brand-800 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  SOAL BERIKUTNYA
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          ) : result.canNext ? (
            <button
              onClick={onNext}
              disabled={loading}
              className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-bold tracking-wide text-paper shadow-md transition hover:bg-black disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  LANJUT KE SOAL BERIKUTNYA
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onRetry}
              className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:bg-amber-600"
            >
              <RefreshCw className="h-4 w-4" />
              COBA LAGI
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function MasteredPanel({
  result,
  kpId,
  fallbackNext,
  onPracticeAgain,
  loading,
}: {
  result: CheckResult;
  kpId: string;
  fallbackNext: { id: string; title: string } | null;
  onPracticeAgain: () => void;
  loading: boolean;
}) {
  const next = result.nextKp ?? fallbackNext;
  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="card-lift mt-6 overflow-hidden rounded-3xl border border-gold-500/40 bg-gradient-to-br from-gold-100 via-white to-brand-50"
    >
      <div className="px-5 py-6 sm:px-7 sm:py-7">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-500 text-white shadow-md">
            <Sparkles className="h-6 w-6" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700">
              3 Benar Berturut-turut!
            </p>
            <h3 className="font-display text-2xl font-bold text-ink">
              {kpId} Dikuasai
            </h3>
          </div>
        </div>
        <ContentBlock text={result.text} className="mt-4" />
        <p className="mt-3 text-sm font-medium text-ink-2">
          {next
            ? `Knowledge Point berikutnya terbuka: ${next.id} · ${next.title}.`
            : "Kamu sudah menamatkan seluruh materi persamaan kuadrat. Luar biasa!"}
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {next && (
            <Link
              href={`/learn/${next.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold tracking-wide text-brand-50 shadow-md transition hover:bg-brand-800"
            >
              LANJUT KE {next.id}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-ink/15 bg-white px-5 py-3 text-sm font-bold tracking-wide text-ink transition hover:border-brand-600/50 hover:bg-brand-50"
          >
            <Home className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>
          <button
            onClick={onPracticeAgain}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-ink-2 transition hover:text-brand-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Latihan lagi
              </>
            )}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
