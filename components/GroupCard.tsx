import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { SourceGroup } from "@/data/types";

type GroupCardProps = {
  group: SourceGroup;
  round: number;
  maxRounds: number;
};

export function GroupCard({ group, round, maxRounds }: GroupCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <Badge tone="cyan">Round {round} / {maxRounds}</Badge>
        <Badge tone="gold">{group.category}</Badge>
      </div>
      <h1 className="display-font mt-5 text-4xl leading-none sm:text-6xl">{group.name}</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">{group.description}</p>
    </Card>
  );
}
