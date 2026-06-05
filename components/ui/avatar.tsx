import { cn } from "@/lib/utils";

type AvatarProps = {
  name: string;
  className?: string;
};

const colors = [
  "bg-[color-mix(in_oklch,var(--acid),transparent_16%)] text-[var(--bg-strong)]",
  "bg-[color-mix(in_oklch,var(--gold),transparent_14%)] text-[var(--bg-strong)]",
  "bg-[color-mix(in_oklch,var(--pink),transparent_16%)] text-[var(--bg-strong)]",
  "bg-[color-mix(in_oklch,var(--cyan),transparent_14%)] text-[var(--bg-strong)]",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({ name, className }: AvatarProps) {
  const tone = colors[name.length % colors.length];

  return (
    <div className={cn("grid aspect-square place-items-center rounded-lg text-sm font-semibold", tone, className)}>
      {initials(name)}
    </div>
  );
}
