"use client";

import Link from "next/link";
import { GraduationCap, LogOut } from "lucide-react";

export default function SiteHeader({
  name,
  context,
  homeHref = "/dashboard",
}: {
  name: string;
  context?: string;
  homeHref?: string;
}) {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
  }

  return (
    <header className="glass-header sticky top-0 z-40 border-b border-ink/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href={homeHref} className="group flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-700 text-brand-50 shadow-sm transition-transform group-hover:-rotate-6">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold tracking-tight text-ink">
              SIMAK
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-2 sm:block">
              Sistem Mandiri Anti Ketinggalan
            </span>
          </span>
        </Link>

        {context ? (
          <span className="hidden min-w-0 flex-1 truncate text-center text-sm font-medium text-ink-2 md:block">
            {context}
          </span>
        ) : (
          <span className="flex-1" />
        )}

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-ink-2 sm:block">
            Halo, <span className="font-bold text-ink">{name}</span>
          </span>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/60 px-3.5 py-1.5 text-sm font-semibold text-ink-2 transition hover:border-clay-500/50 hover:bg-clay-100 hover:text-clay-700"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
