import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "good" | "warn" | "bad" | "unknown";

export function Badge({ className, tone = "neutral", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  const tones: Record<Tone, string> = {
    neutral: "border-white/12 bg-white/6 text-[var(--muted)]",
    good: "border-[var(--good)]/30 bg-[var(--good)]/10 text-[var(--good-soft)]",
    warn: "border-[var(--signal)]/30 bg-[var(--signal)]/10 text-[var(--signal-soft)]",
    bad: "border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger-soft)]",
    unknown: "border-[var(--unknown)]/30 bg-[var(--unknown)]/10 text-[var(--unknown-soft)]",
  };
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]", tones[tone], className)} {...props} />;
}
