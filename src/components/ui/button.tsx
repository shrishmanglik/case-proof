import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[var(--signal)] text-[var(--ink)] hover:bg-[var(--signal-strong)]",
        secondary: "border border-white/12 bg-white/5 text-[var(--paper)] hover:bg-white/10",
        ghost: "text-[var(--muted)] hover:bg-white/6 hover:text-[var(--paper)]",
        danger: "border border-[var(--danger)]/40 bg-[var(--danger)]/10 text-[var(--danger-soft)] hover:bg-[var(--danger)]/16",
      },
      size: { default: "min-h-11", sm: "min-h-9 px-4 text-xs" },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
