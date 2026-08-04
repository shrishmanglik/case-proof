"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertTriangle, ArrowRight, Check, FileCheck2, LoaderCircle, RotateCcw, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProofSuiteReceipt } from "@/domain/types";

const reviewSchema = z.object({
  userOutcome: z.string().min(12, "Name the observable user outcome."),
  acceptanceCriteria: z.string().min(20, "Acceptance must be observable, not a completion label."),
  failureBehavior: z.string().min(12, "Define a fail-closed recovery path."),
  telemetryContract: z.string().min(12, "Define the expected set and collector health."),
});
type ReviewForm = z.infer<typeof reviewSchema>;

const workflow = [
  ["Direction", "ACCEPTED", "goal-v3"],
  ["Vertical slice", "READY", "slice-04"],
  ["Story readiness", "READY", "story-v1"],
  ["Dependency", "RESOLVED", "manifest-v1"],
  ["Release", "HELD", "RC-04"],
  ["Reconciliation", "UNKNOWN", "collector"],
];

async function requestProof(mode: "RESTORED" | "DISABLED") {
  const response = await fetch("/api/v1/proof-runs", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(mode === "DISABLED" ? { mode, detectorId: "DET-CP-R4" } : { mode }) });
  if (!response.ok) throw new Error("The proof service rejected the request.");
  return (await response.json()).data as ProofSuiteReceipt;
}

export function WorkspaceConsole() {
  const [receipt, setReceipt] = useState<ProofSuiteReceipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const form = useForm<ReviewForm>({ resolver: zodResolver(reviewSchema), defaultValues: { userOutcome: "Operator distinguishes delivered, delayed, and missing notifications.", acceptanceCriteria: "Known-bad input is rejected and the clean fixture passes with identical receipt digests.", failureBehavior: "Hold release, preserve the last accepted state, and expose the exact unblock owner.", telemetryContract: "Compare the complete expected event set to observed events and prove collector health." } });

  async function run(mode: "RESTORED" | "DISABLED") {
    setLoading(true); setError(null);
    try { setReceipt(await requestProof(mode)); } catch (caught) { setError(caught instanceof Error ? caught.message : "Unknown proof-service error."); }
    finally { setLoading(false); }
  }

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[.72fr_1.28fr]">
      <div className="min-w-0 space-y-6">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Synthetic initiative</p><h2 className="mt-2 text-xl font-semibold">Retry-safe notification status</h2></div><Badge tone="good">Admitted</Badge></div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">A bounded, fabricated workflow for demonstrating product controls. It contains no resident, health, employer, customer, or production data.</p>
          <dl className="mt-6 grid gap-4 border-t border-white/8 pt-5 text-sm sm:grid-cols-2"><div><dt className="text-xs text-[var(--muted)]">Risk class</dt><dd className="mt-1 font-semibold">HIGH · simulated</dd></div><div><dt className="text-xs text-[var(--muted)]">Stop authority</dt><dd className="mt-1 font-semibold">Named release owner</dd></div><div><dt className="text-xs text-[var(--muted)]">Scope</dt><dd className="mt-1 font-semibold">One notification state</dd></div><div><dt className="text-xs text-[var(--muted)]">External effects</dt><dd className="mt-1 font-semibold">None</dd></div></dl>
        </Card>
        <Card className="overflow-hidden">
          <div className="border-b border-white/8 p-5"><h2 className="text-sm font-semibold">Evidence chain</h2></div>
          <ol>{workflow.map(([label, status, record], index) => <li key={label} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 border-b border-white/6 px-5 py-4 last:border-0"><span className={`grid size-8 place-items-center rounded-full text-xs font-bold ${status === "UNKNOWN" ? "bg-[var(--unknown)]/10 text-[var(--unknown-soft)]" : status === "HELD" ? "bg-[var(--danger)]/10 text-[var(--danger-soft)]" : "bg-[var(--good)]/10 text-[var(--good-soft)]"}`}>{index + 1}</span><div><p className="text-sm font-semibold">{label}</p><p className="mt-0.5 text-xs text-[var(--muted)]">{record}</p></div><Badge tone={status === "UNKNOWN" ? "unknown" : status === "HELD" ? "bad" : "good"}>{status}</Badge></li>)}</ol>
        </Card>
      </div>

      <div className="min-w-0 space-y-6">
        <Card className="p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="eyebrow">Human readiness review</p><h2 className="mt-2 text-2xl font-semibold">The story cannot approve itself.</h2></div><Badge tone={reviewed ? "good" : "warn"}>{reviewed ? "Human review recorded" : "Human action required"}</Badge></div>
          <form className="mt-7 grid gap-5" onChange={() => { if (reviewed) setReviewed(false); }} onSubmit={form.handleSubmit(() => setReviewed(true))}>
            {([[
              "userOutcome", "Observable user outcome", "What changes for the user?"
            ], ["acceptanceCriteria", "Acceptance evidence", "What must be seen, not merely completed?"], ["failureBehavior", "Failure and recovery", "How does this fail closed?"], ["telemetryContract", "Expected set and telemetry", "What denominator and collector health are required?"]] as const).map(([name, label, hint]) => <label key={name} className="grid gap-2 text-sm font-semibold">{label}<span className="text-xs font-normal text-[var(--muted)]">{hint}</span><textarea {...form.register(name)} rows={2} className="min-h-20 resize-y rounded-xl border border-white/12 bg-black/15 px-4 py-3 text-sm leading-6 text-[var(--paper)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--signal)] focus:ring-2 focus:ring-[var(--signal)]/20" />{form.formState.errors[name] && <span role="alert" className="text-xs text-[var(--danger-soft)]">{form.formState.errors[name]?.message}</span>}</label>)}
            <div className="flex flex-wrap items-center gap-3"><Button type="submit"><FileCheck2 size={16} aria-hidden="true" /> Record human review</Button><span className="text-xs text-[var(--muted)]">Local synthetic session only · no persistence</span></div>
          </form>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex flex-col justify-between gap-4 border-b border-white/8 p-5 sm:flex-row sm:items-center sm:p-6"><div><p className="eyebrow">Detector health</p><h2 className="mt-2 text-xl font-semibold">Run the exact controls twice.</h2></div><div className="flex flex-wrap gap-2"><Button onClick={() => run("DISABLED")} disabled={loading} variant="danger" size="sm"><ShieldAlert size={14} aria-hidden="true" /> Disable CP-R4</Button><Button onClick={() => run("RESTORED")} disabled={loading} size="sm">{loading ? <LoaderCircle className="animate-spin" size={14} aria-hidden="true" /> : <RotateCcw size={14} aria-hidden="true" />} Run restored suite</Button></div></div>
          <div aria-live="polite" className="p-5 sm:p-6">
            {error && <div role="alert" className="flex gap-3 rounded-xl border border-[var(--danger)]/25 bg-[var(--danger)]/8 p-4 text-sm text-[var(--danger-soft)]"><AlertTriangle size={18} aria-hidden="true" />{error}</div>}
            {!receipt && !error && <div className="rounded-xl border border-dashed border-white/12 p-8 text-center"><p className="text-sm font-semibold">No proof receipt yet</p><p className="mt-2 text-xs text-[var(--muted)]">Run the disabled detector first, then restore it. No external system is touched.</p></div>}
            {receipt && <div><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div className="flex items-center gap-3">{receipt.status === "HEALTHY" ? <Check className="text-[var(--good-soft)]" size={20} aria-hidden="true" /> : <ShieldAlert className="text-[var(--danger-soft)]" size={20} aria-hidden="true" />}<div><p className="text-sm font-semibold">Suite {receipt.status.toLowerCase()}</p><p className="text-xs text-[var(--muted)]">{receipt.healthyCount}/{receipt.totalCount} detectors healthy · synthetic only</p></div></div><Badge tone={receipt.status === "HEALTHY" ? "good" : "bad"}>{receipt.status}</Badge></div><div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{receipt.controls.map((control) => <div key={control.requirementId} className="rounded-xl border border-white/8 bg-black/10 p-3"><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold">{control.requirementId}</span><span className={`size-2 rounded-full ${control.status === "HEALTHY" ? "bg-[var(--good)]" : "bg-[var(--danger)]"}`} aria-label={control.status} /></div><p className="mt-2 text-xs leading-5 text-[var(--muted)]">{control.label}</p></div>)}</div><div className="mt-5 flex min-w-0 items-center gap-2 border-t border-white/8 pt-4 text-xs text-[var(--muted)]"><ArrowRight className="shrink-0" size={14} aria-hidden="true" /><span className="shrink-0">Receipt digest</span><code className="min-w-0 flex-1 truncate text-[var(--signal-soft)]">{receipt.suiteDigest}</code></div></div>}
          </div>
        </Card>
      </div>
    </div>
  );
}
