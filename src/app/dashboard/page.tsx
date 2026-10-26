import { redirect } from "next/navigation";
import Link from "next/link";
import { asc, eq, sql } from "drizzle-orm";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Flame,
  Lock,
  LockOpen,
  Target,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";
import { db } from "@/db";
import {
  attemptLogs,
  knowledgePoints,
  studentMastery,
  type KnowledgePoint,
  type MasteryStatus,
  type StudentMastery,
} from "@/db/schema";
import { getSession } from "@/lib/session";
import { ensureMasteryRows, isKpUnlocked } from "@/lib/learning";
import SiteHeader from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

interface KpView {
  kp: KnowledgePoint;
  mastery: StudentMastery | undefined;
  unlocked: boolean;
}

function kpChip(status: MasteryStatus, unlocked: boolean) {
  if (!unlocked)
    return {
      label: "Terkunci",
      cls: "border-ink/15 bg-white/50 text-ink-2/70",
      icon: Lock,
    };
  switch (status) {
    case "mastered":
      return {
        label: "Dikuasai",
        cls: "border-brand-600/30 bg-brand-50 text-brand-700",
        icon: CheckCircle2,
      };
    case "almost":
      return {
        label: "Hampir!",
        cls: "border-gold-500/40 bg-gold-100 text-gold-700",
        icon: Flame,
      };
    case "learning":
      return {
        label: "Belajar",
        cls: "border-amber-500/40 bg-amber-50 text-amber-700",
        icon: BookOpen,
      };
    default:
      return {
        label: "Siap Dimulai",
        cls: "border-ink/15 bg-white text-ink-2",
        icon: LockOpen,
      };
  }
}

function StatusDot({ status, unlocked }: { status: MasteryStatus; unlocked: boolean }) {
  if (!unlocked)
    return <span className="h-3.5 w-3.5 rounded-full border-2 border-ink/20 bg-paper-2" />;
  if (status === "mastered")
    return <span className="h-3.5 w-3.5 rounded-full bg-brand-600 shadow-[0_0_0_3px] shadow-brand-600/20" />;
  if (status === "almost")
    return <span className="h-3.5 w-3.5 rounded-full bg-gold-500 shadow-[0_0_0_3px] shadow-gold-500/20" />;
  if (status === "learning")
    return <span className="h-3.5 w-3.5 rounded-full border-[3px] border-amber-400 bg-amber-100" />;
  return <span className="h-3.5 w-3.5 rounded-full border-2 border-ink/30 bg-white" />;
}

function formatMinutes(total: number) {
  if (total >= 60) {
    const h = Math.floor(total / 60);
    const m = total % 60;
    return m > 0 ? `${h} jam ${m} mnt` : `${h} jam`;
  }
  return `${total} menit`;
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/");
  if (session.role === "guru") redirect("/guru");

  await ensureMasteryRows(session.id);

  const kps = await db
    .select()
    .from(knowledgePoints)
    .orderBy(asc(knowledgePoints.orderNum));
  const mastery = await db
    .select()
    .from(studentMastery)
    .where(eq(studentMastery.studentId, session.id));
  const masteryByKp = new Map(mastery.map((m) => [m.kpId, m]));

  const unlocked = (kp: KnowledgePoint) => isKpUnlocked(kp, masteryByKp);

  const totalAttempts = mastery.reduce((s, m) => s + m.totalAttempts, 0);
  const totalCorrect = mastery.reduce((s, m) => s + m.totalCorrect, 0);
  const accuracy = totalAttempts
    ? Math.round((totalCorrect / totalAttempts) * 100)
    : 0;
  const masteredCount = mastery.filter((m) => m.status === "mastered").length;
  const progressPct = Math.round((masteredCount / kps.length) * 100);

  const [timeRow] = await db
    .select({
      seconds: sql<number>`coalesce(sum(${attemptLogs.timeSpentSeconds}), 0)::int`,
    })
    .from(attemptLogs)
    .where(eq(attemptLogs.studentId, session.id));
  const minutes = Math.round((timeRow?.seconds ?? 0) / 60);

  const nextKp = kps.find(
    (k) => unlocked(k) && masteryByKp.get(k.id)?.status !== "mastered"
  );

  const topicNumbers = [...new Set(kps.map((k) => k.topicNumber))];
  const topics = topicNumbers.map((num) => {
    const list: KpView[] = kps
      .filter((k) => k.topicNumber === num)
      .map((kp) => ({ kp, mastery: masteryByKp.get(kp.id), unlocked: unlocked(kp) }));
    const allMastered = list.every((l) => l.mastery?.status === "mastered");
    const anyUnlocked = list.some((l) => l.unlocked);
    return {
      num,
      title: list[0]?.kp.topicTitle ?? "",
      list,
      allMastered,
      anyUnlocked,
    };
  });

  const firstName = session.name.split(" ")[0];

  return (
    <div className="min-h-screen">
      <SiteHeader name={firstName} context="Dasbor Belajar" />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        {/* Progress hero */}
        <Reveal>
          <section className="card-lift relative overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 p-6 text-brand-50 sm:p-8">
            <div className="texture-chalk pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-100/90">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Progres Belajarmu
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                    {masteredCount === 0
                      ? `Ayo mulai, ${firstName}!`
                      : masteredCount === kps.length
                        ? "Semua materi dikuasai!"
                        : `Kamu hebat, ${firstName}!`}
                  </h1>
                  <p className="mt-1.5 text-sm text-brand-100/90">
                    {masteredCount} dari {kps.length} Knowledge Point sudah kamu
                    kuasai.
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-display text-5xl font-bold leading-none text-gold-300">
                    {progressPct}%
                  </span>
                </div>
              </div>
              <div className="mt-5 h-3.5 overflow-hidden rounded-full bg-brand-900/50 ring-1 ring-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 transition-[width] duration-700"
                  style={{ width: `${Math.max(progressPct, 2)}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-brand-100/80">
                <span>Topik 1 · Konsep</span>
                <span>Topik 2 · Koefisien</span>
                <span>Topik 3 · Faktorisasi</span>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Topics */}
        <div className="mt-8 space-y-6">
          {topics.map((topic, ti) => (
            <Reveal key={topic.num} delay={0.08 + ti * 0.06}>
              <section
                className={clsx(
                  "card-lift overflow-hidden rounded-3xl border bg-white",
                  topic.allMastered
                    ? "border-brand-600/25"
                    : topic.anyUnlocked
                      ? "border-ink/10"
                      : "border-ink/10 opacity-90"
                )}
              >
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/8 bg-paper-2/60 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={clsx(
                        "grid h-10 w-10 place-items-center rounded-2xl font-display text-lg font-bold",
                        topic.allMastered
                          ? "bg-brand-600 text-brand-50"
                          : topic.anyUnlocked
                            ? "bg-brand-800 text-brand-50"
                            : "bg-ink/10 text-ink-2"
                      )}
                    >
                      {topic.num}
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-2">
                        Topik {topic.num}
                      </p>
                      <h2 className="font-display text-lg font-semibold leading-tight text-ink">
                        {topic.title}
                      </h2>
                    </div>
                  </div>
                  {topic.allMastered ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-600/30 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> SELESAI
                    </span>
                  ) : !topic.anyUnlocked ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-2">
                      <Lock className="h-3.5 w-3.5" /> Selesaikan Topik{" "}
                      {topic.num - 1} terlebih dahulu
                    </span>
                  ) : null}
                </header>

                {topic.anyUnlocked ? (
                  <div className="divide-y divide-ink/6">
                    {topic.list.map(({ kp, mastery, unlocked: u }) => {
                      const chip = kpChip(mastery?.status ?? "untouched", u);
                      const ChipIcon = chip.icon;
                      const isNext = nextKp?.id === kp.id;
                      const row = (
                        <div
                          className={clsx(
                            "flex items-center gap-3.5 px-5 py-3.5 sm:px-6",
                            u && "transition hover:bg-brand-50/50",
                            isNext && "bg-brand-50/40"
                          )}
                        >
                          <StatusDot
                            status={mastery?.status ?? "untouched"}
                            unlocked={u}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-ink">
                              {kp.id}{" "}
                              <span className="font-medium text-ink-2">
                                · {kp.kpTitle}
                              </span>
                            </p>
                          </div>
                          {mastery && mastery.status !== "mastered" && mastery.correctStreak > 0 && (
                            <span className="hidden text-xs font-semibold text-gold-700 sm:block">
                              {mastery.correctStreak}/3 berturut
                            </span>
                          )}
                          <span
                            className={clsx(
                              "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold",
                              chip.cls
                            )}
                          >
                            <ChipIcon className="h-3 w-3" />
                            {chip.label}
                          </span>
                        </div>
                      );
                      return u ? (
                        <Link key={kp.id} href={`/learn/${kp.id}`} className="block">
                          {row}
                        </Link>
                      ) : (
                        <div key={kp.id}>{row}</div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-5 py-8 text-center sm:px-6">
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-ink/5 text-ink-2">
                      <Lock className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-sm font-medium text-ink-2">
                      Selesaikan Topik {topic.num - 1} terlebih dahulu untuk
                      membuka materi ini.
                    </p>
                  </div>
                )}

                {nextKp && nextKp.topicNumber === topic.num && (
                  <div className="border-t border-ink/8 bg-paper-2/40 px-5 py-4 sm:px-6">
                    <Link
                      href={`/learn/${nextKp.id}`}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-bold tracking-wide text-brand-50 shadow-md transition hover:bg-brand-800"
                    >
                      LANJUT BELAJAR {nextKp.id} — {nextKp.kpTitle}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                )}
              </section>
            </Reveal>
          ))}
        </div>

        {/* Stats */}
        <Reveal delay={0.2}>
          <section className="mt-8">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-ink-2">
              Statistikmu
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  icon: ClipboardList,
                  label: "Soal Dikerjakan",
                  value: `${totalAttempts} soal`,
                  tint: "bg-brand-50 text-brand-700 border-brand-600/20",
                },
                {
                  icon: Target,
                  label: "Akurasi Jawaban",
                  value: totalAttempts ? `${accuracy}%` : "—",
                  tint: "bg-gold-100 text-gold-700 border-gold-500/30",
                },
                {
                  icon: Clock3,
                  label: "Waktu Belajar",
                  value: formatMinutes(minutes),
                  tint: "bg-violet-50 text-violet-700 border-violet-500/20",
                },
              ].map(({ icon: Icon, label, value, tint }) => (
                <div
                  key={label}
                  className="card-lift flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-5"
                >
                  <span
                    className={clsx(
                      "grid h-12 w-12 shrink-0 place-items-center rounded-2xl border",
                      tint
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-2">
                      {label}
                    </p>
                    <p className="font-display text-2xl font-bold text-ink">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      </main>
    </div>
  );
}
