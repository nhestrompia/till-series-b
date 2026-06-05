import { cn } from "@/lib/utils";

type AvatarProps = {
  name: string;
  className?: string;
};

const colors = [
  "bg-[var(--acid)] text-slate-950",
  "bg-[var(--gold)] text-slate-950",
  "bg-[var(--pink)] text-slate-950",
  "bg-[var(--cyan)] text-slate-950",
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
    <div className={cn("grid aspect-square place-items-center rounded-2xl text-base font-black", tone, className)}>
      {initials(name)}
    </div>
  );
}
