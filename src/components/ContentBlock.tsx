import type { ReactNode } from "react";
import {
  Lightbulb,
  Search,
  BookOpen,
  TriangleAlert,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Dot,
} from "lucide-react";
import clsx from "clsx";

/** Replace pedagogical emoji markers; mid-line check/cross become glyphs. */
const EMOJI_RE = /[⚠💡🔍📖]\uFE0F?/gu;

function clean(s: string) {
  return s
    .replace(EMOJI_RE, "")
    .replace(/✅/g, "✓")
    .replace(/❌/g, "✗")
    .trimEnd();
}

function cleanLeading(s: string) {
  return clean(s).replace(/^[✓✗]\s*/, "");
}

type Tone =
  | "text"
  | "warn"
  | "hint"
  | "search"
  | "book"
  | "good"
  | "bad"
  | "bullet"
  | "arrow"
  | "mono"
  | "math"
  | "step";

const MATH_RE = /(x²|x³|×|≠|\(x|x₁|x₂|= 0)/;
const MONO_RE = /\s{2,}.*[↓↕x=−]/;

function classify(raw: string): { tone: Tone; icon?: ReactNode; text: string } {
  const t = raw.trim();
  if (t.startsWith("⚠")) {
    return { tone: "warn", icon: <TriangleAlert className="h-4 w-4" />, text: clean(raw) };
  }
  if (t.startsWith("💡")) {
    return { tone: "hint", icon: <Lightbulb className="h-4 w-4" />, text: clean(raw) };
  }
  if (t.startsWith("🔍")) {
    return { tone: "search", icon: <Search className="h-4 w-4" />, text: clean(raw) };
  }
  if (t.startsWith("📖")) {
    return { tone: "book", icon: <BookOpen className="h-4 w-4" />, text: clean(raw) };
  }
  if (t.startsWith("✅")) {
    return { tone: "good", icon: <CheckCircle2 className="h-4 w-4" />, text: cleanLeading(raw) };
  }
  if (t.startsWith("❌")) {
    return { tone: "bad", icon: <XCircle className="h-4 w-4" />, text: cleanLeading(raw) };
  }
  if (t.startsWith("→")) {
    return { tone: "arrow", icon: <ArrowRight className="h-3.5 w-3.5" />, text: clean(raw) };
  }
  if (t.startsWith("• ")) {
    return { tone: "bullet", icon: <Dot className="h-5 w-5 -mx-1" />, text: clean(raw) };
  }
  if (MONO_RE.test(raw)) {
    return { tone: "mono", text: raw };
  }
  if (/^(Langkah\s+\d+|\d+\.)/.test(t)) {
    return { tone: "step", text: clean(raw) };
  }
  if (t.length <= 72 && MATH_RE.test(t) && !/[.!?]$/.test(t)) {
    // short equation-like line
    return { tone: "math", text: clean(raw) };
  }
  return { tone: "text", text: clean(raw) };
}

export function ContentBlock({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const lines = text.split("\n");
  return (
    <div className={clsx("space-y-1.5", className)}>
      {lines.map((raw, i) => {
        if (raw.trim() === "") return <div key={i} className="h-2" />;
        const { tone, icon, text } = classify(raw);

        switch (tone) {
          case "warn":
            return (
              <Callout key={i} icon={icon} className="border-gold-500/40 bg-gold-100/70 text-gold-700">
                {text}
              </Callout>
            );
          case "hint":
            return (
              <Callout key={i} icon={icon} className="border-sky-500/30 bg-sky-50 text-sky-800">
                {text}
              </Callout>
            );
          case "search":
            return (
              <Callout key={i} icon={icon} className="border-violet-500/30 bg-violet-50 text-violet-800">
                {text}
              </Callout>
            );
          case "book":
            return (
              <Callout key={i} icon={icon} className="border-brand-500/30 bg-brand-50 text-brand-800">
                {text}
              </Callout>
            );
          case "good":
            return (
              <Row key={i} icon={icon} className="text-brand-700 font-medium">{text}</Row>
            );
          case "bad":
            return (
              <Row key={i} icon={icon} className="text-clay-700 font-medium">{text}</Row>
            );
          case "arrow":
            return (
              <Row key={i} icon={icon} className="pl-3 text-ink-2">{text}</Row>
            );
          case "bullet":
            return (
              <Row key={i} icon={icon} className="text-ink-2">{text}</Row>
            );
          case "mono":
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-lg border border-ink/8 bg-white/80 px-3 py-1.5 font-mono text-[13px] leading-relaxed text-brand-900 whitespace-pre"
              >
                {text}
              </pre>
            );
          case "math":
            return (
              <p
                key={i}
                className="rounded-lg border border-brand-200/70 bg-brand-50/60 px-3 py-1.5 font-display text-lg font-medium tracking-wide text-brand-900"
              >
                {text}
              </p>
            );
          case "step":
            return (
              <p key={i} className="pt-1 text-[15px] font-semibold text-ink">
                {text}
              </p>
            );
          default:
            return (
              <p key={i} className="text-[15px] leading-relaxed text-ink-2">
                {text}
              </p>
            );
        }
      })}
    </div>
  );
}

function Callout({
  icon,
  className,
  children,
}: {
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={clsx(
        "flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed",
        className
      )}
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function Row({
  icon,
  className,
  children,
}: {
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={clsx("flex items-start gap-1 text-[15px] leading-relaxed", className)}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}
