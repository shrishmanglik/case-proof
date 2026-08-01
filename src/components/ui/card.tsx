import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-[1.4rem] border border-white/10 bg-[var(--panel)] shadow-[0_24px_80px_rgba(0,0,0,.22)]", className)} {...props} />;
}
