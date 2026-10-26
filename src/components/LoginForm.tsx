"use client";

import { useState } from "react";
import { ArrowRight, BookMarked, Loader2 } from "lucide-react";

const DEMO_STUDENTS = [
  "Andi Pratama",
  "Budi Santoso",
  "Citra Dewi",
  "Dina Amelia",
  "Eka Saputra",
  "Fajar Hidayat",
];

export default function LoginForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"siswa" | "guru" | null>(null);

  async function login(payload: { name?: string; as?: "guru" }) {
    setError(null);
    setLoading(payload.as === "guru" ? "guru" : "siswa");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal masuk. Coba lagi ya.");
        setLoading(null);
        return;
      }
      window.location.assign(data.role === "guru" ? "/guru" : "/dashboard");
    } catch {
      setError("Koneksi bermasalah. Coba lagi ya.");
      setLoading(null);
    }
  }

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login({ name });
        }}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-semibold text-ink"
          >
            Nama Lengkap
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Masukkan nama kamu…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink shadow-sm outline-none transition placeholder:text-ink-2/50 focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-clay-500/30 bg-clay-100 px-3.5 py-2.5 text-sm font-medium text-clay-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading !== null || name.trim().length < 2}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3.5 text-sm font-bold tracking-wide text-brand-50 shadow-md transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "siswa" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              MULAI BELAJAR
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-medium text-ink-2">Coba akun contoh:</span>
        {DEMO_STUDENTS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setName(n)}
            className="rounded-full border border-ink/10 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-ink-2 transition hover:border-brand-600/40 hover:bg-brand-50 hover:text-brand-800"
          >
            {n.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-ink/15" />
        <span className="text-xs font-semibold uppercase tracking-widest text-ink-2/70">
          atau
        </span>
        <span className="h-px flex-1 bg-ink/15" />
      </div>

      <button
        type="button"
        disabled={loading !== null}
        onClick={() => login({ as: "guru" })}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-ink/15 bg-white/60 px-4 py-3 text-sm font-bold tracking-wide text-ink transition hover:border-gold-500 hover:bg-gold-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading === "guru" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <BookMarked className="h-4 w-4" />
            MASUK SEBAGAI GURU
          </>
        )}
      </button>

      <p className="mt-5 text-center text-xs leading-relaxed text-ink-2/80">
        Cukup nama — tanpa kata sandi. Progres belajarmu tersimpan otomatis.
      </p>
    </div>
  );
}
