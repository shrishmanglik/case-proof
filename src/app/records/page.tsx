import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Evidence records" };

const records = [
  ["ProductInitiative.v1", "initiative-synthetic-001", "ADMITTED", "Human-confirmed"],
  ["GoalStoryLink.v1", "link-synthetic-004", "ACTIVE", "Calculated"],
  ["StoryReadinessContract.v1", "readiness-synthetic-004", "READY", "Human-confirmed"],
  ["DependencyRecord.v1", "dependency-synthetic-002", "RESOLVED", "Imported"],
  ["DetectorHealthReceipt.v1", "proof-suite-v1", "HEALTHY", "Calculated"],
  ["ReleaseCandidate.v1", "rc-synthetic-004", "RELEASE_HELD", "Human-confirmed"],
  ["ExpectedEventManifest.v1", "manifest-synthetic-001", "UNKNOWN", "Imported"],
  ["PostReleaseObservation.v1", "observation-synthetic-001", "PENDING", "Calculated"],
];

export default function RecordsPage() {
  return <section className="px-5 py-12 lg:px-10 lg:py-16"><div className="mx-auto max-w-[1360px]"><p className="eyebrow">Record inventory</p><h1 className="display mt-4 text-5xl sm:text-7xl">State never loses its source.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">The screen below is a synthetic, read-only projection. It demonstrates provenance and lifecycle language; it is not connected to a provider or customer system.</p><Card className="mt-12 overflow-hidden"><div className="hidden grid-cols-[1.25fr_1fr_.65fr_.8fr] border-b border-white/8 px-6 py-4 text-[.68rem] font-bold uppercase tracking-[.14em] text-[var(--muted)] md:grid"><span>Contract</span><span>Record</span><span>State</span><span>Provenance</span></div>{records.map(([contract, id, state, provenance]) => <article key={id} className="grid gap-3 border-b border-white/6 px-5 py-5 last:border-0 md:grid-cols-[1.25fr_1fr_.65fr_.8fr] md:items-center md:px-6"><div><p className="text-xs text-[var(--muted)] md:hidden">Contract</p><h2 className="mt-1 text-sm font-semibold md:mt-0">{contract}</h2></div><div><p className="text-xs text-[var(--muted)] md:hidden">Record</p><code className="mt-1 block text-xs text-[var(--signal-soft)] md:mt-0">{id}</code></div><div><p className="text-xs text-[var(--muted)] md:hidden">State</p><span className="mt-1 block md:mt-0"><Badge tone={state === "UNKNOWN" ? "unknown" : state === "RELEASE_HELD" ? "bad" : state === "PENDING" ? "warn" : "good"}>{state}</Badge></span></div><div><p className="text-xs text-[var(--muted)] md:hidden">Provenance</p><p className="mt-1 text-xs text-[var(--muted)] md:mt-0">{provenance}</p></div></article>)}</Card></div></section>;
}
