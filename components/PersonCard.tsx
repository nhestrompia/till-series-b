"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { roleShortLabels } from "@/lib/game";
import type { Person } from "@/data/types";

type PersonCardProps = {
  person: Person;
  onPick: (id: string) => void;
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

export function PersonCard({ person, onPick }: PersonCardProps) {
  const labels = person.tags.slice(0, 3).map((tag) => tagLabels[tag] ?? tag.replaceAll("-", " "));

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onPick(person.id)}
      data-person-card={person.id}
      className="group w-full rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 text-left transition duration-150 hover:border-[var(--acid)] hover:bg-[color-mix(in_oklch,var(--surface),var(--acid)_8%)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acid)]"
    >
      <div className="flex items-center gap-3">
        <Avatar name={person.name} className="h-12 w-12 shrink-0 rounded-[10px]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-black leading-tight text-[var(--text)]">{person.name}</h3>
              <p className="mt-1 truncate text-sm text-[var(--muted)]">{person.handle ?? person.knownFor}</p>
            </div>
            <Badge tone="gold">{roleShortLabels[person.primaryRole]}</Badge>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        {[
          ["VIS", person.stats.vision],
          ["ENG", person.stats.engineering],
          ["GRW", person.stats.growth],
          ["CHS", person.stats.chaos],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-[var(--bg)] px-2 py-1.5">
            <p className="text-base font-black">{value}</p>
            <p className="text-[10px] font-black text-[var(--muted)]">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {labels.map((label, index) => (
          <Badge key={`${person.id}-${label}`} tone={index === 0 ? "gold" : index === 1 ? "pink" : "cyan"}>
            {label}
          </Badge>
        ))}
      </div>
    </motion.button>
  );
}
