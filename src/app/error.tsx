"use client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="mx-auto max-w-2xl px-5 py-24 text-center"><AlertTriangle className="mx-auto text-[var(--danger-soft)]" size={36} aria-hidden="true" /><h1 className="display mt-6 text-5xl">The surface failed closed.</h1><p className="mt-4 text-sm leading-7 text-[var(--muted)]">No release or evidence state was advanced. Retry the local render; if the failure repeats, inspect the operator runbook.</p><Button className="mt-7" onClick={reset}>Retry surface</Button></div>;
}
