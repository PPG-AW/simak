import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SIMAK — Sistem Mandiri Anti Ketinggalan",
  description:
    "Platform pembelajaran mandiri persamaan kuadrat dengan umpan balik bertingkat dan dasbor pemantauan untuk guru.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
