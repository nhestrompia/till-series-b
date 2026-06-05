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
          "inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] px-5 py-3 text-sm font-black transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acid)] disabled:pointer-events-none disabled:opacity-50",
          variant === "primary" &&
            "bg-[var(--acid)] text-white hover:bg-[color-mix(in_oklch,var(--acid),white_8%)]",
          variant === "secondary" &&
            "border border-[var(--line)] bg-[var(--surface-lift)] text-[var(--text)] hover:border-[var(--acid)] hover:bg-[color-mix(in_oklch,var(--surface-lift),var(--acid)_8%)]",
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
