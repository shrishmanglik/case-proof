import type { Metadata } from "next";
import { Ban, Bot, CircleHelp, Database, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Evidence boundaries" };

const boundaries = [
  [Database, "Implemented", "Typed domain controls, 24 synthetic fixtures, proof receipts, one API boundary, responsive UI, proposed Supabase schema, tests and runbooks.", "good"],
  [CircleHelp, "Unknown", "Buyer demand, willingness to pay, adoption, integration effort, live provider state, production reliability, and commercial outcomes.", "unknown"],
  [Ban, "Not claimed", "Employer affiliation, customer use, clinical effectiveness, production deployment, validated savings, revenue, testimonials, or market superiority.", "bad"],
];

export default function BoundariesPage() {
  return <section className="px-5 py-12 lg:px-10 lg:py-16"><div className="mx-auto max-w-[1360px]"><p className="eyebrow">Claim boundary</p><h1 className="display mt-4 max-w-5xl text-5xl leading-[.95] sm:text-7xl">Commercially coherent does not mean commercially proven.</h1><p className="mt-6 max-w-3xl text-base leading-7 text-[var(--muted)]">CaseProof is an independent application work sample informed by public role context. SafelyYou did not commission, endorse, validate, or provide internal information for this implementation.</p><div className="mt-12 grid gap-5 lg:grid-cols-3">{boundaries.map(([Icon, title, body, tone]) => <Card key={String(title)} className="p-6"><Icon className="text-[var(--signal)]" size={25} aria-hidden="true" /><div className="mt-8 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">{String(title)}</h2><Badge tone={tone as "good" | "unknown" | "bad"}>{String(title)}</Badge></div><p className="mt-4 text-sm leading-7 text-[var(--muted)]">{String(body)}</p></Card>)}</div><div className="mt-16 grid gap-6 lg:grid-cols-2"><Card className="p-6 sm:p-8"><Bot className="text-[var(--unknown-soft)]" size={27} aria-hidden="true" /><h2 className="mt-8 text-2xl font-semibold">AI may propose.</h2><p className="mt-4 text-sm leading-7 text-[var(--muted)]">A future AI adapter may draft decomposition, edge-case questions, ambiguity prompts, or release language from accepted sources. The current implementation makes no runtime AI call.</p><Badge className="mt-6" tone="unknown">Proposed · not implemented</Badge></Card><Card className="p-6 sm:p-8"><UserCheck className="text-[var(--good-soft)]" size={27} aria-hidden="true" /><h2 className="mt-8 text-2xl font-semibold">Humans decide.</h2><p className="mt-4 text-sm leading-7 text-[var(--muted)]">Named authorities own product meaning, safety, privacy, readiness, release, rollback, external communication, and commercial decisions. A completeness score cannot substitute.</p><Badge className="mt-6" tone="good">Implemented boundary</Badge></Card></div></div></section>;
}
