import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return <div className="mx-auto max-w-2xl px-5 py-24 text-center"><p className="eyebrow">404 · Unknown route</p><h1 className="display mt-5 text-6xl">No record exists here.</h1><p className="mt-5 text-sm text-[var(--muted)]">CaseProof does not infer a nearby record from an invalid identifier.</p><Link href="/" className={`${buttonVariants({ variant: "secondary" })} mt-8`}>Return to overview</Link></div>;
}
