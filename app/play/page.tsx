"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Menu, RotateCw, Sun, LogOut } from "lucide-react";
import { PersonCard } from "@/components/PersonCard";
import { StartupBoard } from "@/components/StartupBoard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { sourceGroupsById } from "@/data/groups";
import { peopleById } from "@/data/people";
import { trackGameEvent } from "@/lib/analytics";
import { useGameStore } from "@/store/game-store";

export default function PlayPage() {
  const router = useRouter();
  const game = useGameStore((state) => state.game);
  const choices = useGameStore((state) => state.choices);
  const startGame = useGameStore((state) => state.startGame);
  const pick = useGameStore((state) => state.pick);
  const lastAssignment = useGameStore((state) => state.lastAssignment);

  useEffect(() => {
    if (!game) {
      startGame();
    }
  }, [game, startGame]);

  if (!game) {
    return (
      <main className="page-shell relative grid place-items-center">
        <Badge tone="acid">Starting company...</Badge>
      </main>
    );
  }

  const currentGame = game;
  const group = sourceGroupsById.get(currentGame.currentGroupId);
  const progress = ((currentGame.round - 1) / currentGame.maxRounds) * 100;
  const picked = lastAssignment?.pickedPersonId ? peopleById.get(lastAssignment.pickedPersonId) : undefined;

  function choose(personId: string) {
    const result = pick(personId);
    trackGameEvent("person_picked", {
      person_id: personId,
      round: currentGame.round,
      group_id: currentGame.currentGroupId,
      assigned_role: result.assignment.assignedRole,
      replaced: Boolean(result.assignment.replacedPersonId),
    });
    trackGameEvent("round_completed", { round: currentGame.round, group_id: currentGame.currentGroupId });

    if (result.completed) {
      trackGameEvent("game_completed", { rounds: result.state.picks.length });
      router.push("/result");
    }
  }

  return (
    <main className="page-shell relative">
      <header className="top-bar flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-[var(--acid)] bg-[var(--surface)] text-xs font-black leading-none text-[var(--acid)]">
            82<br />0
          </div>
          <p className="text-xl font-black">Round {currentGame.round}/{currentGame.maxRounds}</p>
        </div>
        <div className="flex gap-2">
          {[Sun, Menu, LogOut].map((Icon, index) => (
            <button
              key={index}
              type="button"
              aria-label="Game control"
              className="grid h-11 w-11 place-items-center rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]"
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-5 p-4 sm:p-8">
        <Progress value={progress} />
        <section className="game-grid">
          <div className="grid content-start gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
              <div className="flex flex-wrap gap-2">
                <Badge tone="cyan">{group?.name ?? "Tech Twitter"}</Badge>
                <Badge tone="gold">{group?.type ?? "scene"}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm font-black text-[var(--gold)]">
                <RotateCw className="h-4 w-4" />
                Forced pick
              </div>
            </div>

            <div>
              <h1 className="display-font text-3xl leading-none sm:text-5xl">Pick one</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
                {group?.description ?? "Choose the person who makes this startup least likely to implode."}
              </p>
            </div>

            {picked ? (
              <div className="rounded-[var(--radius)] border border-[var(--acid)] bg-[color-mix(in_oklch,var(--surface),var(--acid)_10%)] p-3 text-sm font-black text-[var(--gold)]">
                Added {picked.name} as {lastAssignment?.assignedRole.toUpperCase()}
                {lastAssignment?.replacedPersonId ? ". Someone got org-charted." : "."}
              </div>
            ) : null}

            <section className="grid gap-3">
              <AnimatePresence mode="popLayout">
                {choices.map((person) => (
                  <motion.div
                    key={`${currentGame.round}-${person.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <PersonCard person={person} onPick={choose} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </section>
          </div>

          <StartupBoard game={currentGame} />
        </section>
      </div>
    </main>
  );
}
