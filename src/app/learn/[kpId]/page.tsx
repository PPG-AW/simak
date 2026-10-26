import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  PenLine,
  ScrollText,
} from "lucide-react";
import { db } from "@/db";
import { knowledgePoints, studentMastery } from "@/db/schema";
import { getSession } from "@/lib/session";
import {
  ensureMasteryRows,
  isKpUnlockedForStudent,
} from "@/lib/learning";
import SiteHeader from "@/components/SiteHeader";
import { ContentBlock } from "@/components/ContentBlock";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ kpId: string }>;
}) {
  const { kpId } = await params;
  const session = await getSession();
  if (!session) redirect("/");
  if (session.role === "guru") redirect("/guru");

  const [kp] = await db
    .select()
    .from(knowledgePoints)
    .where(eq(knowledgePoints.id, kpId))
    .limit(1);
  if (!kp) notFound();

  await ensureMasteryRows(session.id);
  const unlocked = await isKpUnlockedForStudent(session.id, kp);
  if (!unlocked) redirect("/dashboard");

  const [m] = await db
    .select()
    .from(studentMastery)
    .where(
      and(
        eq(studentMastery.studentId, session.id),
        eq(studentMastery.kpId, kp.id)
      )
    )
    .limit(1);

  const mastered = m?.status === "mastered";

  return (
    <div className="min-h-screen">
      <SiteHeader
        name={session.name.split(" ")[0]}
        context={`${kp.id} · ${kp.kpTitle}`}
      />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6">
        <Reveal>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-800 px-3.5 py-1.5 text-xs font-bold tracking-widest text-brand-50">
              {kp.id}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-2">
              Topik {kp.topicNumber} · {kp.topicTitle}
            </span>
            {mastered && (
              <span className="inline-flex items-center gap-1 rounded-full border border-brand-600/30 bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Sudah Dikuasai
              </span>
            )}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {kp.kpTitle}
          </h1>
          {kp.kpDescription && (
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              {kp.kpDescription}
            </p>
          )}
        </Reveal>

        <Reveal delay={0.08}>
          <section className="card-lift mt-8 overflow-hidden rounded-3xl border border-ink/10 bg-white">
            <header className="flex items-center gap-2.5 border-b border-ink/8 bg-brand-50/70 px-5 py-3.5 sm:px-6">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700 text-brand-50">
                <BookOpen className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-brand-800">
                Materi
              </h2>
            </header>
            <div className="px-5 py-5 sm:px-6">
              {kp.materialContent ? (
                <ContentBlock text={kp.materialContent} />
              ) : (
                <p className="text-sm text-ink-2">Materi belum tersedia.</p>
              )}
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.14}>
          <section className="card-lift mt-6 overflow-hidden rounded-3xl border border-ink/10 bg-white">
            <header className="flex items-center gap-2.5 border-b border-ink/8 bg-gold-100/70 px-5 py-3.5 sm:px-6">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold-500 text-gold-100">
                <PenLine className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-gold-700">
                Contoh Berpandu
              </h2>
            </header>
            <div className="px-5 py-5 sm:px-6">
              {kp.exampleContent ? (
                <ContentBlock text={kp.exampleContent} />
              ) : (
                <p className="text-sm text-ink-2">Contoh belum tersedia.</p>
              )}
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-8 rounded-3xl border border-brand-600/20 bg-brand-50/60 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-brand-700 shadow-sm">
                <ScrollText className="h-4.5 w-4.5" />
              </span>
              <p className="text-sm leading-relaxed text-brand-900">
                <b>Siap berlatih?</b> Kamu akan mendapat soal singkat dengan{" "}
                <b>maksimal 3 percobaan</b>. Setiap kesalahan akan dibalas
                dengan petunjuk yang semakin detail. Kuasai KP ini dengan{" "}
                <b>3 jawaban benar berturut-turut</b>.
              </p>
            </div>
            <Link
              href={`/practice/${kp.id}`}
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3.5 text-sm font-bold tracking-wide text-brand-50 shadow-md transition hover:bg-brand-800"
            >
              SAYA SUDAH PAHAM, MULAI LATIHAN
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
