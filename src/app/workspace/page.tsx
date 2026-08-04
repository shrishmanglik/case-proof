import type { Metadata } from "next";
import { WorkspaceConsole } from "@/components/workspace-console";

export const metadata: Metadata = { title: "Synthetic workspace" };

export default function WorkspacePage() {
  return <section className="px-5 py-12 lg:px-10 lg:py-16"><div className="mx-auto max-w-[1360px]"><div className="mb-10 max-w-4xl"><p className="eyebrow">Primary workflow</p><h1 className="display mt-4 text-5xl leading-[.95] sm:text-7xl">One initiative. Every consequential join visible.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">This runnable vertical admits a synthetic initiative, records a human readiness review, runs all twelve controls, exposes a disabled detector, and restores the gate.</p></div><WorkspaceConsole /></div></section>;
}
