import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import {
  AlertTriangle,
  BookOpenCheck,
  Clock4,
  Lightbulb,
  LineChart,
  Phone,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { db } from "@/db";
import {
  attemptLogs,
  knowledgePoints,
  studentMastery,
  students,
  type MasteryStatus,
} from "@/db/schema";
import { getSession } from "@/lib/session";
import { ERROR_TYPE_LABELS } from "@/lib/shared";
import SiteHeader from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

const DAY = 24 * 3600 * 1000;

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

function adviceForError(type: string | null): string {
  switch (type) {
    case "sign_error":
    case "sign_error_partial":
      return "Ingatkan kembali bahwa tanda (+ / −) adalah BAGIAN dari koefisien.";
    case "no_rearrange":
    case "no_rearrange_partial":
    case "no_rearrange_sign":
      return "Latih menyusun persamaan ke bentuk standar sebelum identifikasi a, b, c.";
    case "pasangan_salah":
      return "Latih strategi mendaftar pasangan faktor secara sistematis.";
    case "missing_coefficient":
      return "Biasakan menulis koefisien 1 / −1 secara eksplisit.";
    case "bentuk_tidak_standar":
      return "Jelaskan ulang konsep pangkat tertinggi dan bentuk standar saat siswa kembali ke kelas.";
    case "konsep_salah":
    case "pangkat_salah":
    case "syarat_a_salah":
      return "Ulangi konsep dasar definisi persamaan kuadrat secara personal.";
    default:
      return "Berikan pendampingan personal untuk konsep ini.";
  }
}

function dotClass(status: MasteryStatus): string {
  switch (status) {
    case "mastered":
      return "bg-brand-600";
    case "almost":
      return "bg-gold-500";
    case "learning":
      return "bg-amber-300";
    default:
      return "border-2 border-ink/25 bg-white";
  }
}

export default async function GuruPage() {
  const session = await getSession();
  if (!session) redirect("/");
  if (session.role !== "guru") redirect("/dashboard");

  const [allStudents, kps, masteryRows, wrongLogs] = await Promise.all([
    db
      .select()
      .from(students)
      .where(eq(students.role, "siswa"))
      .orderBy(asc(students.name)),
    db.select().from(knowledgePoints).orderBy(asc(knowledgePoints.orderNum)),
    db.select().from(studentMastery),
    db.select().from(attemptLogs).where(eq(attemptLogs.isCorrect, false)),
  ]);

  const kpTitleById = new Map(kps.map((k) => [k.id, k.kpTitle]));

  interface StudentRow {
    id: string;
    name: string;
    lastLoginAt: Date;
    statuses: MasteryStatus[];
    attempts: number;
    accuracy: number | null;
    masteredCount: number;
    progress: number;
    stuckKp: { kpId: string; totalAttempts: number; errorType: string | null } | null;
    inactive: boolean;
    chip: "green" | "yellow" | "red";
  }

  const rows: StudentRow[] = allStudents.map((s) => {
    const ms = masteryRows.filter((m) => m.studentId === s.id);
    const attempts = ms.reduce((a, m) => a + m.totalAttempts, 0);
    const correctCount = ms.reduce((a, m) => a + m.totalCorrect, 0);
    const accuracy = attempts > 0 ? Math.round((correctCount / attempts) * 100) : null;
    const masteredCount = ms.filter((m) => m.status === "mastered").length;
    const progress = Math.round((masteredCount / Math.max(kps.length, 1)) * 100);
    const statuses = kps.map(
      (k) => ms.find((m) => m.kpId === k.id)?.status ?? ("untouched" as MasteryStatus)
    );
    const stuckCandidate = ms
      .filter(
        (m) =>
          (m.status === "learning" || m.status === "almost") &&
          m.totalAttempts >= 5
      )
      .sort((a, b) => b.totalAttempts - a.totalAttempts)[0];
    let stuckKp: StudentRow["stuckKp"] = null;
    if (stuckCandidate) {
      const theirErrors = wrongLogs.filter(
        (l) => l.studentId === s.id && l.kpId === stuckCandidate.kpId && l.errorType
      );
      const counts = new Map<string, number>();
      for (const l of theirErrors) {
        counts.set(l.errorType!, (counts.get(l.errorType!) ?? 0) + 1);
      }
      const topError =
        [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
      stuckKp = {
        kpId: stuckCandidate.kpId,
        totalAttempts: stuckCandidate.totalAttempts,
        errorType: topError,
      };
    }
    const inactive = Date.now() - s.lastLoginAt.getTime() > 7 * DAY;
    const chip: StudentRow["chip"] =
      stuckKp || inactive
        ? "red"
        : progress >= 60 && (accuracy ?? 0) >= 70
          ? "green"
          : "yellow";

    return {
      id: s.id,
      name: s.name,
      lastLoginAt: s.lastLoginAt,
      statuses,
      attempts,
      accuracy,
      masteredCount,
      progress,
      stuckKp,
      inactive,
      chip,
    };
  });

  const totalStudents = rows.length;
  const avgProgress = totalStudents
    ? Math.round(rows.reduce((a, r) => a + r.progress, 0) / totalStudents)
    : 0;
  const withAttempts = rows.filter((r) => r.accuracy !== null);
  const avgAccuracy = withAttempts.length
    ? Math.round(
        withAttempts.reduce((a, r) => a + (r.accuracy ?? 0), 0) /
          withAttempts.length
      )
    : 0;

  /* Error analysis: group wrong logs by KP + type */
  const errGroups = new Map<
    string,
    { kpId: string; type: string; count: number; students: Set<string> }
  >();
  for (const l of wrongLogs) {
    if (!l.errorType) continue;
    const key = `${l.kpId}||${l.errorType}`;
    const g = errGroups.get(key) ?? {
      kpId: l.kpId,
      type: l.errorType,
      count: 0,
      students: new Set<string>(),
    };
    g.count++;
    g.students.add(l.studentId);
    errGroups.set(key, g);
  }
  const errorList = [...errGroups.values()]
    .sort((a, b) => b.count - a.count || b.students.size - a.students.size)
    .slice(0, 5);
  const maxErr = Math.max(1, ...errorList.map((e) => e.count));

  /* Penguatan advice from top error types */
  const adviceSet: string[] = [];
  for (const e of errorList) {
    const a = adviceForError(e.type);
    if (!adviceSet.includes(a)) adviceSet.push(a);
    if (adviceSet.length >= 3) break;
  }
  if (adviceSet.length === 0)
    adviceSet.push("Belum ada data kesalahan — ajak siswa mulai berlatih.");

  return (
    <div className="min-h-screen">
      <SiteHeader name={session.name} context="Dasbor Guru" homeHref="/guru" />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        {/* Summary */}
        <Reveal>
          <section>
            <h1 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink-2">
              <LineChart className="h-4 w-4" />
              Ringkasan Kelas
            </h1>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Users,
                  label: "Total Siswa Terdaftar",
                  value: `${totalStudents} siswa`,
                  tint: "bg-brand-50 text-brand-700 border-brand-600/20",
                },
                {
                  icon: TrendingUp,
                  label: "Rata-rata Progres",
                  value: `${avgProgress}%`,
                  tint: "bg-gold-100 text-gold-700 border-gold-500/30",
                },
                {
                  icon: Target,
                  label: "Rata-rata Akurasi",
                  value: `${avgAccuracy}%`,
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

        {/* Per-student table */}
        <Reveal delay={0.08}>
          <section className="card-lift mt-8 overflow-hidden rounded-3xl border border-ink/10 bg-white">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/8 bg-paper-2/60 px-5 py-4 sm:px-6">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-ink">
                <BookOpenCheck className="h-4 w-4 text-brand-700" />
                Progres per Siswa
              </h2>
              <div className="flex items-center gap-3 text-[11px] font-medium text-ink-2">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-600" /> Dikuasai
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-gold-500" /> Hampir
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" /> Belajar
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-ink/25 bg-white" /> Belum
                </span>
              </div>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-ink/8 text-[11px] font-bold uppercase tracking-wider text-ink-2">
                    <th className="px-5 py-3 sm:px-6">Nama</th>
                    <th className="px-3 py-3">Knowledge Points (1.1 → 3.3)</th>
                    <th className="px-3 py-3 text-center">Akurasi</th>
                    <th className="px-5 py-3 text-center sm:px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/6">
                  {rows.map((r) => (
                    <tr key={r.id} className="transition hover:bg-brand-50/40">
                      <td className="px-5 py-3.5 sm:px-6">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={clsx(
                              "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold",
                              r.chip === "green"
                                ? "bg-brand-100 text-brand-800"
                                : r.chip === "yellow"
                                  ? "bg-gold-100 text-gold-700"
                                  : "bg-clay-100 text-clay-700"
                            )}
                          >
                            {r.name
                              .split(" ")
                              .map((w) => w[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-ink">{r.name}</p>
                            <p className="flex items-center gap-1 text-[11px] text-ink-2">
                              <Clock4 className="h-3 w-3" />
                              {timeAgo(r.lastLoginAt)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {[0, 1, 2].map((topic) => (
                            <div
                              key={topic}
                              className="flex items-center gap-1 rounded-lg bg-paper-2/80 px-1.5 py-1"
                            >
                              {[0, 1, 2].map((i) => {
                                const st = r.statuses[topic * 3 + i];
                                return (
                                  <span
                                    key={i}
                                    title={`${kps[topic * 3 + i]?.id ?? ""} · ${st}`}
                                    className={clsx("h-3 w-3 rounded-full", dotClass(st))}
                                  />
                                );
                              })}
                            </div>
                          ))}
                          <span className="ml-1 text-[11px] font-semibold text-ink-2">
                            {r.masteredCount}/{kps.length}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className="font-display text-lg font-bold text-ink">
                          {r.accuracy !== null ? `${r.accuracy}%` : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center sm:px-6">
                        <span
                          className={clsx(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold",
                            r.chip === "green"
                              ? "border-brand-600/30 bg-brand-50 text-brand-700"
                              : r.chip === "yellow"
                                ? "border-gold-500/40 bg-gold-100 text-gold-700"
                                : "border-clay-500/40 bg-clay-100 text-clay-700"
                          )}
                        >
                          <span
                            className={clsx(
                              "h-2 w-2 rounded-full",
                              r.chip === "green"
                                ? "bg-brand-600"
                                : r.chip === "yellow"
                                  ? "bg-gold-500"
                                  : "bg-clay-500"
                            )}
                          />
                          {r.chip === "green"
                            ? "Lancar"
                            : r.chip === "yellow"
                              ? "Pantau"
                              : "Perhatian"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-ink-2">
                        Belum ada siswa terdaftar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </Reveal>

        {/* Alerts */}
        <Reveal delay={0.14}>
          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink-2">
              <AlertTriangle className="h-4 w-4 text-clay-500" />
              Perlu Perhatian
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              {rows
                .filter((r) => r.stuckKp || r.inactive)
                .map((r) => (
                  <div
                    key={r.id}
                    className="card-lift rounded-2xl border border-clay-500/25 bg-white p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-clay-100 text-clay-700">
                        <AlertTriangle className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        {r.stuckKp && (
                          <>
                            <p className="text-sm font-bold text-ink">
                              {r.name} — stuck di {r.stuckKp.kpId}
                            </p>
                            <p className="mt-0.5 text-sm leading-relaxed text-ink-2">
                              {kpTitleById.get(r.stuckKp.kpId)}. Sudah{" "}
                              {r.stuckKp.totalAttempts}x percobaan
                              {r.stuckKp.errorType
                                ? `, didominasi kesalahan "${ERROR_TYPE_LABELS[r.stuckKp.errorType] ?? r.stuckKp.errorType}"`
                                : ""}
                              .
                            </p>
                            <p className="mt-2 text-sm font-medium text-brand-800">
                              → Saran: {adviceForError(r.stuckKp.errorType)}
                            </p>
                          </>
                        )}
                        {!r.stuckKp && r.inactive && (
                          <>
                            <p className="text-sm font-bold text-ink">
                              {r.name} — tidak aktif
                            </p>
                            <p className="mt-0.5 text-sm leading-relaxed text-ink-2">
                              Terakhir masuk {timeAgo(r.lastLoginAt)} (lebih dari 7
                              hari tidak ada aktivitas).
                            </p>
                            <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-brand-800">
                              <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                              Saran: hubungi siswa, cek kendala akses internet atau
                              perangkat.
                            </p>
                          </>
                        )}
                        {r.stuckKp && r.inactive && (
                          <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-brand-800">
                            <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                            Siswa juga tidak aktif sejak {timeAgo(r.lastLoginAt)} —
                            hubungi orang tua bila perlu.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              {rows.every((r) => !r.stuckKp && !r.inactive) && (
                <div className="card-lift flex items-center gap-3 rounded-2xl border border-brand-600/25 bg-brand-50/60 p-5 md:col-span-2">
                  <UserCheck className="h-5 w-5 text-brand-700" />
                  <p className="text-sm font-semibold text-brand-800">
                    Semua siswa belajar dengan lancar. Tidak ada yang perlu
                    perhatian khusus hari ini.
                  </p>
                </div>
              )}
            </div>
          </section>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Error analysis */}
          <Reveal delay={0.2}>
            <section className="card-lift h-full overflow-hidden rounded-3xl border border-ink/10 bg-white">
              <header className="border-b border-ink/8 bg-paper-2/60 px-5 py-4 sm:px-6">
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-ink">
                  <AlertTriangle className="h-4 w-4 text-gold-500" />
                  Kesalahan Terbanyak
                </h2>
              </header>
              <div className="space-y-4 px-5 py-5 sm:px-6">
                {errorList.map((e, i) => (
                  <div key={`${e.kpId}-${e.type}`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm font-semibold text-ink">
                        <span className="mr-1.5 font-display text-base font-bold text-clay-500">
                          {i + 1}.
                        </span>
                        {ERROR_TYPE_LABELS[e.type] ?? e.type}
                        <span className="ml-1.5 rounded-md bg-paper-2 px-1.5 py-0.5 text-[11px] font-bold text-ink-2">
                          {e.kpId} · {kpTitleById.get(e.kpId)}
                        </span>
                      </p>
                      <p className="shrink-0 text-xs font-bold text-ink-2">
                        {e.count}x · {e.students.size} siswa
                      </p>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/8">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-500 to-clay-500"
                        style={{ width: `${(e.count / maxErr) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                {errorList.length === 0 && (
                  <p className="text-sm text-ink-2">
                    Belum ada kesalahan tercatat.
                  </p>
                )}
              </div>
            </section>
          </Reveal>

          {/* Reinforcement advice */}
          <Reveal delay={0.26}>
            <section className="card-lift h-full overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-br from-brand-800 to-brand-900 text-brand-50">
              <header className="border-b border-white/10 px-5 py-4 sm:px-6">
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em]">
                  <Lightbulb className="h-4 w-4 text-gold-300" />
                  Saran Penguatan Saat Siswa Kembali
                </h2>
              </header>
              <div className="px-5 py-5 sm:px-6">
                <p className="text-sm leading-relaxed text-brand-100/90">
                  Berdasarkan data percobaan siswa, saat kelas berlangsung lagi
                  fokuslah pada:
                </p>
                <ol className="mt-4 space-y-3">
                  {adviceSet.map((a, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-500 text-xs font-bold text-brand-900">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed">{a}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </Reveal>
        </div>
      </main>
    </div>
  );
}
