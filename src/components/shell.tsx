import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

const navigation = [
  ["Overview", "/"],
  ["Workspace", "/workspace"],
  ["Proof", "/proof"],
  ["Records", "/records"],
  ["Boundaries", "/boundaries"],
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[var(--ink)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-4 lg:px-10">
          <Link href="/" className="flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]" aria-label="CaseProof home">
            <span className="grid size-10 place-items-center rounded-xl border border-[var(--signal)]/35 bg-[var(--signal)]/10 text-[var(--signal)]"><ShieldCheck size={20} aria-hidden="true" /></span>
            <span><span className="block text-sm font-bold tracking-tight text-[var(--paper)]">CaseProof</span><span className="block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Evidence before release</span></span>
          </Link>
          <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
            {navigation.map(([label, href]) => <Link key={href} href={href} className="rounded-full px-4 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-white/6 hover:text-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]">{label}</Link>)}
          </nav>
          <a href="https://github.com/shrishmanglik/case-proof" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 text-sm font-semibold text-[var(--paper)] transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]">Repository <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
        <nav aria-label="Mobile navigation" className="scrollbar-none flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden">
          {navigation.map(([label, href]) => <Link key={href} href={href} className="shrink-0 rounded-full px-3 py-2 text-xs font-semibold text-[var(--muted)] hover:bg-white/6 hover:text-[var(--paper)]">{label}</Link>)}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t border-white/8 px-5 py-8 text-xs text-[var(--muted)] lg:px-10">
        <div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-3 sm:flex-row"><p>Open implementation · synthetic fixtures · no employer affiliation</p><p>Human authority remains explicit at every consequential gate.</p></div>
      </footer>
    </div>
  );
}
