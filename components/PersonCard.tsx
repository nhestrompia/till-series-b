"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { roleShortLabels } from "@/lib/game";
import type { Person } from "@/data/types";
import { cn } from "@/lib/utils";

type PersonCardProps = {
  person: Person;
  selected?: boolean;
  onSelect: (id: string) => void;
};

const tagLabels: Record<string, string> = {
  "fast-shipper": "Ships in Public",
  "chaos-merchant": "Chaos Merchant",
  distribution: "Distribution Wizard",
  "10x-builder": "10x Builder",
  "rewrites-backend": "Rewrites Backend",
  fundraising: "Raises at 100x ARR",
  "probably-starts-a-podcast": "Starts a Podcast",
  operator: "Adult Supervision",
  taste: "Taste Premium",
  ai: "AI Wave",
  crypto: "Bull Market",
  indie: "Bootstrapped Menace",
};

export function PersonCard({ person, selected = false, onSelect }: PersonCardProps) {
  const labels = person.tags.slice(0, 2).map((tag) => tagLabels[tag] ?? tag.replaceAll("-", " "));

  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(person.id)}
      data-person-card={person.id}
      className={cn(
        "group w-full rounded-[var(--radius)] border bg-[var(--surface)] p-3 text-left transition duration-150 hover:border-[color-mix(in_oklch,var(--acid),transparent_35%)] hover:bg-[var(--surface-lift)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acid)]",
        selected ? "border-[var(--acid)] bg-[color-mix(in_oklch,var(--surface),var(--acid)_7%)]" : "border-[var(--line)]"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar name={person.name} className="h-10 w-10 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-semibold leading-snug text-[var(--text)]">{person.name}</h3>
              <p className="mt-0.5 truncate text-xs text-[var(--muted)]">{person.handle ?? person.knownFor}</p>
            </div>
            <Badge tone="gold">{roleShortLabels[person.primaryRole]}</Badge>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5 text-center">
        {[
          ["VIS", person.stats.vision],
          ["ENG", person.stats.engineering],
          ["GRW", person.stats.growth],
          ["CHS", person.stats.chaos],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md bg-[var(--bg)] px-2 py-1">
            <p className="text-sm font-semibold leading-tight">{value}</p>
            <p className="text-[10px] font-semibold leading-tight text-[var(--muted)]">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {labels.map((label, index) => (
          <Badge key={`${person.id}-${label}`} tone={index === 0 ? "gold" : index === 1 ? "pink" : "cyan"}>
            {label}
          </Badge>
        ))}
      </div>
    </motion.button>
  );
}
