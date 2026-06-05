import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "acid" | "gold" | "pink" | "cyan" | "muted";
};

export function Badge({ className, tone = "muted", ...props }: BadgeProps) {
  const tones = {
    acid: "border-[color-mix(in_oklch,var(--acid),transparent_55%)] bg-[color-mix(in_oklch,var(--acid),transparent_91%)] text-[color-mix(in_oklch,var(--acid),var(--text)_12%)]",
    gold: "border-[color-mix(in_oklch,var(--gold),transparent_55%)] bg-[color-mix(in_oklch,var(--gold),transparent_91%)] text-[color-mix(in_oklch,var(--gold),var(--text)_10%)]",
    pink: "border-[color-mix(in_oklch,var(--pink),transparent_55%)] bg-[color-mix(in_oklch,var(--pink),transparent_91%)] text-[color-mix(in_oklch,var(--pink),var(--text)_12%)]",
    cyan: "border-[color-mix(in_oklch,var(--cyan),transparent_55%)] bg-[color-mix(in_oklch,var(--cyan),transparent_92%)] text-[color-mix(in_oklch,var(--cyan),var(--text)_12%)]",
    muted: "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]",
  };

  return (
    <span
      className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold", tones[tone], className)}
      {...props}
    />
  );
}
