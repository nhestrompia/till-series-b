import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius)] px-3.5 py-2 text-sm font-semibold transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acid)] disabled:pointer-events-none disabled:opacity-50",
          variant === "primary" &&
            "bg-[var(--acid)] text-[var(--bg-strong)] hover:bg-[color-mix(in_oklch,var(--acid),white_7%)]",
          variant === "secondary" &&
            "border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:border-[color-mix(in_oklch,var(--acid),transparent_35%)] hover:bg-[var(--surface-lift)]",
          variant === "ghost" &&
            "text-[var(--muted)] hover:bg-[var(--surface-lift)] hover:text-[var(--text)]",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
