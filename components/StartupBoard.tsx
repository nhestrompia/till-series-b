import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { peopleById } from "@/data/people";
import type { GameState, Role } from "@/data/types";
import { roleShortLabels, roles } from "@/lib/game";
import { cn } from "@/lib/utils";

type StartupBoardProps = {
  game: GameState;
};

const positions: Record<Role, string> = {
  ceo: "left-1/2 top-[10%] -translate-x-1/2",
  cto: "left-[18%] top-[38%]",
  product: "right-[18%] top-[38%]",
  growth: "left-[27%] bottom-[12%]",
  operator: "right-[27%] bottom-[12%]",
};

export function StartupBoard({ game }: StartupBoardProps) {
  return (
    <section className="startup-board relative overflow-hidden rounded-[24px] border border-[var(--line)]">
      <div className="absolute left-1/2 top-[16%] h-[52%] w-[66%] -translate-x-1/2 rounded-b-[999px] border border-[color-mix(in_oklch,var(--muted),transparent_45%)] border-t-0" />
      <div className="absolute left-1/2 top-[26%] h-28 w-40 -translate-x-1/2 rounded-b-full border border-[color-mix(in_oklch,var(--muted),transparent_55%)] border-t-0" />
      <div className="absolute left-8 top-0 h-full w-px bg-[color-mix(in_oklch,var(--muted),transparent_60%)]" />
      <div className="absolute right-8 top-0 h-full w-px bg-[color-mix(in_oklch,var(--muted),transparent_60%)]" />
      <div className="absolute inset-x-6 top-6 flex items-center justify-between">
        <Badge tone="muted">Startup formation</Badge>
        <Badge tone="gold">{Object.keys(game.team).length}/5 roles</Badge>
      </div>

      {roles.map((role) => {
        const person = game.team[role] ? peopleById.get(game.team[role] as string) : undefined;

        return (
          <div
            key={role}
            className={cn(
              "absolute w-[132px] rounded-[18px] border p-3 text-center transition",
              positions[role],
              person
                ? "border-[var(--acid)] bg-[color-mix(in_oklch,var(--surface),var(--acid)_12%)]"
                : "border-dashed border-[color-mix(in_oklch,var(--muted),transparent_45%)] bg-[color-mix(in_oklch,var(--surface),transparent_25%)]"
            )}
          >
            {person ? (
              <>
                <Avatar name={person.name} className="mx-auto h-11 w-11 rounded-xl" />
                <p className="mt-2 truncate text-sm font-black">{person.name}</p>
                <p className="text-xs font-bold text-[var(--muted)]">{roleShortLabels[role]}</p>
              </>
            ) : (
              <>
                <p className="py-4 text-xl font-black text-[var(--muted)]">{roleShortLabels[role]}</p>
                <p className="text-[10px] font-black uppercase text-[var(--muted)]">open slot</p>
              </>
            )}
          </div>
        );
      })}
    </section>
  );
}
