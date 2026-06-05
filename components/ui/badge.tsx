import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "acid" | "gold" | "pink" | "cyan" | "muted";
};

export function Badge({ className, tone = "muted", ...props }: BadgeProps) {
  const tones = {
    acid: "border-[color-mix(in_oklch,var(--acid),transparent_35%)] bg-[color-mix(in_oklch,var(--acid),transparent_86%)] text-[var(--acid)]",
    gold: "border-[color-mix(in_oklch,var(--gold),transparent_35%)] bg-[color-mix(in_oklch,var(--gold),transparent_86%)] text-[var(--gold)]",
    pink: "border-[color-mix(in_oklch,var(--pink),transparent_35%)] bg-[color-mix(in_oklch,var(--pink),transparent_86%)] text-[var(--pink)]",
    cyan: "border-[color-mix(in_oklch,var(--cyan),transparent_35%)] bg-[color-mix(in_oklch,var(--cyan),transparent_86%)] text-[var(--cyan)]",
    muted: "border-[var(--line)] bg-[var(--surface-lift)] text-[var(--muted)]",
  };

  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black", tones[tone], className)}
      {...props}
    />
  );
}
