import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { peopleById } from "@/data/people";
import type { GameState, Role } from "@/data/types";
import { roleShortLabels, roles } from "@/lib/game";
import { cn } from "@/lib/utils";

type TeamBarProps = {
  game?: GameState;
  compact?: boolean;
};

export function TeamBar({ game, compact = false }: TeamBarProps) {
  return (
    <div className={cn("grid grid-cols-5 gap-2", compact ? "gap-1.5" : "gap-2")}>
      {roles.map((role: Role) => {
        const person = game?.team[role] ? peopleById.get(game.team[role] as string) : undefined;

        return (
          <div
            key={role}
            className="min-w-0 rounded-2xl border border-[var(--line)] bg-[color-mix(in_oklch,var(--surface),transparent_18%)] p-2"
          >
            <div className="mb-2 flex justify-center">
              {person ? (
                <Avatar name={person.name} className={cn(compact ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm")} />
              ) : (
                <div className={cn("grid place-items-center rounded-2xl border border-dashed border-[var(--line)] text-xs text-[var(--muted)]", compact ? "h-8 w-8" : "h-10 w-10")}>
                  ?
                </div>
              )}
            </div>
            <Badge className="w-full justify-center truncate px-1 text-[10px]" tone={person ? "acid" : "muted"}>
              {roleShortLabels[role]}
            </Badge>
            {!compact && person ? (
              <p className="mt-2 truncate text-center text-xs font-bold text-[var(--text)]">{person.name}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
