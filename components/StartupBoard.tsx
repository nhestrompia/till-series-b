import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { peopleById } from "@/data/people";
import type { GameState, Person, Role } from "@/data/types";
import { getCompatibleRoles, roleShortLabels, roles } from "@/lib/game";
import { cn } from "@/lib/utils";
import { Briefcase, Code2, Crown, Cuboid, TrendingUp } from "lucide-react";

type StartupBoardProps = {
  game: GameState;
  selectedPerson?: Person;
  onPlace?: (role: Role) => void;
};

const positions: Record<Role, string> = {
  ceo: "left-1/2 top-[10%] -translate-x-1/2",
  cto: "left-[18%] top-[38%]",
  product: "right-[18%] top-[38%]",
  growth: "left-[27%] bottom-[12%]",
  operator: "right-[27%] bottom-[12%]",
};

const roleTone: Record<Role, { text: string; border: string; bg: string; icon: typeof Crown }> = {
  ceo: {
    text: "text-[var(--pink)]",
    border: "border-[var(--pink)]",
    bg: "bg-[color-mix(in_oklch,var(--pink),transparent_88%)]",
    icon: Crown,
  },
  cto: {
    text: "text-[var(--cyan)]",
    border: "border-[var(--cyan)]",
    bg: "bg-[color-mix(in_oklch,var(--cyan),transparent_88%)]",
    icon: Code2,
  },
  product: {
    text: "text-[var(--acid)]",
    border: "border-[var(--acid)]",
    bg: "bg-[color-mix(in_oklch,var(--acid),transparent_88%)]",
    icon: Cuboid,
  },
  growth: {
    text: "text-[var(--gold)]",
    border: "border-[var(--gold)]",
    bg: "bg-[color-mix(in_oklch,var(--gold),transparent_88%)]",
    icon: TrendingUp,
  },
  operator: {
    text: "text-[var(--cyan)]",
    border: "border-[var(--cyan)]",
    bg: "bg-[color-mix(in_oklch,var(--cyan),transparent_90%)]",
    icon: Briefcase,
  },
};

export function StartupBoard({ game, selectedPerson, onPlace }: StartupBoardProps) {
  const compatibleRoles = selectedPerson ? getCompatibleRoles(selectedPerson, game.team) : [];

  return (
    <section className="relative self-start overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[color-mix(in_oklch,var(--panel-cool),transparent_4%)] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Startup formation</h2>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            {selectedPerson ? `Place ${selectedPerson.name} into a matching open role.` : "Select a person, then choose a matching role."}
          </p>
        </div>
        <Badge tone="gold">{Object.keys(game.team).length}/5 roles</Badge>
      </div>

      <div className="grid gap-3">
        {roles.map((role) => {
          const person = game.team[role] ? peopleById.get(game.team[role] as string) : undefined;
          const canPlace = !person && compatibleRoles.includes(role);
          const blocked = Boolean(selectedPerson && !person && !canPlace);
          const tone = roleTone[role];
          const Icon = tone.icon;

          return (
            <div key={role}>
              <div className={cn("mb-1.5 flex items-center gap-2 text-xs font-semibold", tone.text)}>
                <Icon className="h-4 w-4" />
                <span>{roleShortLabels[role]}</span>
                <span className="h-px flex-1 border-t border-dashed border-[var(--line)]" />
              </div>
              <button
                type="button"
                disabled={!canPlace}
                onClick={() => onPlace?.(role)}
                className={cn(
                  "grid min-h-[72px] w-full grid-cols-[auto_1fr] items-center gap-3 rounded-[var(--radius)] border p-2.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acid)]",
                  person && `${tone.border} ${tone.bg}`,
                  canPlace && `${tone.border} ${tone.bg} hover:bg-[var(--surface-lift)]`,
                  !person && !canPlace && "border-dashed border-[var(--line)] bg-[color-mix(in_oklch,var(--bg),var(--surface)_35%)]",
                  blocked && "opacity-45"
                )}
              >
                <div className={cn("grid h-9 w-9 place-items-center rounded-lg text-sm font-semibold", person ? "" : "bg-[var(--surface-lift)] text-[var(--muted)]")}>
                  {person ? <Avatar name={person.name} className="h-9 w-9" /> : "+"}
                </div>
                <div className="min-w-0">
                  {person ? (
                    <>
                      <p className="truncate text-sm font-semibold">{person.name}</p>
                      <p className="truncate text-xs text-[var(--muted)]">{person.knownFor}</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[var(--muted)]">Pick a {roleShortLabels[role]}</p>
                        {canPlace ? <Badge tone="pink">Place here</Badge> : null}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                        {selectedPerson
                          ? canPlace
                            ? `Use ${selectedPerson.name} here.`
                            : `${selectedPerson.name} cannot fill this role.`
                          : "Select a matching person from the left."}
                      </p>
                    </>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function LegacyStartupBoard({ game }: StartupBoardProps) {
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
