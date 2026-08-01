import Link from "next/link";
import { ArrowRight, Check, CircleDashed, GitBranch, LockKeyhole, RotateCcw, ScanSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const stages = [
  ["01", "Direction", "Accepted source and named authority"],
  ["02", "Ready work", "Traceable story, edge cases, dependencies"],
  ["03", "Proof", "Bad fails, clean passes, detector survives mutation"],
  ["04", "Release", "Exact artifact, cohort, rollback and expected set"],
  ["05", "Learning", "Observed behaviour becomes an accountable decision"],
];

export default function Home() {
  return (
    <div>
      <section className="grid-lines border-b border-white/8 px-5 py-16 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-[1360px] gap-14 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div>
            <div className="mb-7 flex flex-wrap items-center gap-3"><Badge tone="warn">Open implementation</Badge><Badge tone="unknown">Commercial demand unknown</Badge></div>
            <p className="eyebrow mb-5">Evidence-bound product delivery</p>
            <h1 className="display max-w-4xl text-[clamp(3.2rem,7vw,7.4rem)] leading-[.88] text-[var(--paper)]">A green check is not the same as a proven release.</h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)]">CaseProof binds direction, ready work, dependencies, acceptance, rollback, rollout, and post-release evidence into one inspectable chain—without letting AI or a dashboard claim authority it does not have.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link href="/workspace" className={buttonVariants({ variant: "primary" })}>Open synthetic workflow <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/proof" className={buttonVariants({ variant: "secondary" })}>Inspect controls</Link></div>
          </div>
          <Card className="relative overflow-hidden p-5 sm:p-7">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--signal)] to-transparent" />
            <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-5"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--muted)]">Synthetic release candidate</p><h2 className="mt-2 text-xl font-semibold">Notification status · RC-04</h2></div><Badge tone="bad">Release held</Badge></div>
            <div className="space-y-1 py-5">
              {[
                [Check, "Direction bound", "goal-v3 · accepted"],
                [Check, "Story ready", "12 acceptance controls"],
                [Check, "Detector health", "two identical runs"],
                [CircleDashed, "Expected event set", "collector health unknown"],
              ].map(([Icon, title, detail], index) => <div key={String(title)} className="grid grid-cols-[2.4rem_1fr_auto] items-center gap-3 rounded-xl px-2 py-3 hover:bg-white/4"><span className={`grid size-9 place-items-center rounded-full ${index === 3 ? "bg-[var(--unknown)]/10 text-[var(--unknown-soft)]" : "bg-[var(--good)]/10 text-[var(--good-soft)]"}`}><Icon size={17} aria-hidden="true" /></span><span className="text-sm font-semibold">{String(title)}</span><span className="text-right text-xs text-[var(--muted)]">{String(detail)}</span></div>)}
            </div>
            <div className="rounded-xl border border-[var(--danger)]/20 bg-[var(--danger)]/8 p-4"><div className="flex gap-3"><ScanSearch className="mt-0.5 shrink-0 text-[var(--danger-soft)]" size={18} aria-hidden="true" /><div><p className="text-sm font-semibold text-[var(--danger-soft)]">The adjacent check failed</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">Deployment succeeded. User-visible delivery and the complete expected event set remain unproven.</p></div></div></div>
          </Card>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-10">
        <div className="mx-auto max-w-[1360px]">
          <div className="grid gap-px overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/10 sm:grid-cols-3">
            {[["12", "deterministic P0 controls", "Bad and clean fixtures"], ["0", "runtime AI decisions", "Proposals never execute"], ["24", "synthetic acceptance fixtures", "Clearly labelled, repeatable"]].map(([value, label, detail]) => <div key={label} className="bg-[var(--ink-soft)] p-6 sm:p-8"><p className="display text-5xl text-[var(--signal)]">{value}</p><p className="mt-3 text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-[var(--muted)]">{detail}</p></div>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-10">
        <div className="mx-auto max-w-[1360px]">
          <div className="max-w-3xl"><p className="eyebrow">One chain, five gates</p><h2 className="display mt-4 text-4xl leading-tight sm:text-6xl">The join between tools is where false confidence survives.</h2></div>
          <div className="mt-12 grid gap-4 lg:grid-cols-5">
            {stages.map(([number, title, body], index) => <Card key={number} className="relative min-h-60 p-5"><p className="text-xs font-bold tracking-[.18em] text-[var(--signal)]">{number}</p><h3 className="mt-10 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{body}</p>{index < stages.length - 1 && <ArrowRight className="absolute -right-3 top-8 z-10 hidden rounded-full bg-[var(--ink)] p-1 text-[var(--muted)] lg:block" size={24} aria-hidden="true" />}</Card>)}
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-white/[.025] px-5 py-20 lg:px-10">
        <div className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-3">
          {[
            [GitBranch, "Deterministic first", "Typed validators, lifecycle maps, exact expected sets, idempotency, and receipts run before interpretive assistance."],
            [LockKeyhole, "Human authority visible", "Named people retain product, safety, privacy, readiness, release, rollback, and commercial authority."],
            [RotateCcw, "Recovery is a product path", "The compensating change, target read, reconciliation, and restored-state proof live beside the release decision."],
          ].map(([Icon, title, body]) => <div key={String(title)} className="border-l border-white/10 pl-6"><Icon className="text-[var(--signal)]" size={24} aria-hidden="true" /><h3 className="mt-6 text-xl font-semibold">{String(title)}</h3><p className="mt-3 max-w-sm text-sm leading-7 text-[var(--muted)]">{String(body)}</p></div>)}
        </div>
      </section>
    </div>
  );
}
