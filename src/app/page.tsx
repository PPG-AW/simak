import { redirect } from "next/navigation";
import Image from "next/image";
import {
  GraduationCap,
  Layers,
  MessageSquareText,
  LineChart,
} from "lucide-react";
import { getSession } from "@/lib/session";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session?.role === "guru") redirect("/guru");
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Mobile banner */}
      <div className="relative h-52 overflow-hidden lg:hidden">
        <Image
          src="/images/chalkboard.jpg"
          alt="Papan tulis dengan persamaan kuadrat"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent" />
        <div className="absolute bottom-4 left-5 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-800 shadow-md">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="leading-tight text-white">
            <span className="block font-display text-xl font-bold">SIMAK</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">
              Sistem Mandiri Anti Ketinggalan
            </span>
          </span>
        </div>
      </div>

      {/* Desktop art panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/chalkboard.jpg"
          alt="Papan tulis dengan persamaan kuadrat"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-900/45 to-brand-900/15" />
        <div className="absolute inset-x-10 bottom-12 space-y-6 text-white">
          <p className="font-display text-4xl font-medium italic leading-snug xl:text-[2.6rem]">
            Belajar mandiri,
            <br />
            tanpa takut ketinggalan.
          </p>
          <p className="max-w-md text-sm leading-relaxed text-white/85">
            Kuasai persamaan kuadrat selangkah demi selangkah — sistem
            memberikan petunjuk bertingkat setiap kali kamu tersesat, dan guru
            memantau progresmu dari dasbor khusus.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Layers, label: "9 Knowledge Points" },
              { icon: MessageSquareText, label: "Umpan Balik 3 Tingkat" },
              { icon: LineChart, label: "Dasbor Guru" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="texture-dots relative flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="card-lift rounded-3xl border border-ink/10 bg-white/90 p-7 sm:p-9">
            <div className="mb-7 hidden items-center gap-3 lg:flex">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-700 text-brand-50 shadow-md">
                <GraduationCap className="h-6 w-6" />
              </span>
              <span>
                <h1 className="font-display text-3xl font-bold tracking-tight">
                  SIMAK
                </h1>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-2">
                  Sistem Mandiri Anti Ketinggalan
                </p>
              </span>
            </div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Selamat datang!
            </h2>
            <p className="mb-6 mt-1 text-sm text-ink-2">
              Masuk dengan namamu untuk melanjutkan petualangan persamaan
              kuadrat.
            </p>
            <LoginForm />
          </div>
          <p className="mt-6 text-center text-[11px] uppercase tracking-[0.2em] text-ink-2/60">
            Persamaan Kuadrat · Kelas IX
          </p>
        </div>
      </div>
    </main>
  );
}
