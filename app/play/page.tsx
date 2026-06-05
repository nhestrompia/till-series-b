"use client";

import { PersonCard } from "@/components/PersonCard";
import { StartupBoard } from "@/components/StartupBoard";
import { HowToPlayDialog } from "@/components/HowToPlayDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { sourceGroups, sourceGroupsById } from "@/data/groups";
import { peopleById } from "@/data/people";
import { trackGameEvent } from "@/lib/analytics";
import { getCompatibleRoles } from "@/lib/game";
import { useGameStore } from "@/store/game-store";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlayPage() {
  const router = useRouter();
  const game = useGameStore((state) => state.game);
  const choices = useGameStore((state) => state.choices);
  const selectedPersonId = useGameStore((state) => state.selectedPersonId);
  const startGame = useGameStore((state) => state.startGame);
  const selectPerson = useGameStore((state) => state.selectPerson);
  const placeSelected = useGameStore((state) => state.placeSelected);
  const spin = useGameStore((state) => state.spin);
  const lastAssignment = useGameStore((state) => state.lastAssignment);
  const [showChoices, setShowChoices] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reel, setReel] = useState({ name: "???", category: "???" });

  useEffect(() => {
    if (!game) {
      startGame();
    }
  }, [game, startGame]);

  useEffect(() => {
    if (!game?.currentGroupId) return;

    const reset = window.setTimeout(() => {
      setShowChoices(false);
      setIsSpinning(false);
      setReel({ name: "???", category: "???" });
    }, 0);

    return () => {
      window.clearTimeout(reset);
    };
  }, [game?.currentGroupId, game?.id, game?.round]);

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
  const picked = lastAssignment?.pickedPersonId
    ? peopleById.get(lastAssignment.pickedPersonId)
    : undefined;
  const selectedPerson = selectedPersonId
    ? peopleById.get(selectedPersonId)
    : undefined;
  const playableChoices = choices.filter(
    (person) => getCompatibleRoles(person, currentGame.team).length > 0,
  );
  const hasPlayableChoices = playableChoices.length > 0;

  function place(role: Parameters<typeof placeSelected>[0]) {
    const result = placeSelected(role);
    trackGameEvent("person_picked", {
      person_id: result.assignment.pickedPersonId,
      round: currentGame.round,
      group_id: currentGame.currentGroupId,
      assigned_role: result.assignment.assignedRole,
    });
    trackGameEvent("round_completed", {
      round: currentGame.round,
      group_id: currentGame.currentGroupId,
    });

    if (result.completed) {
      trackGameEvent("game_completed", { rounds: result.state.picks.length });
      router.push("/result");
    }
  }

  function spinCurrentGroup() {
    const nextGame = spin();
    trackGameEvent("round_completed", {
      round: currentGame.round,
      group_id: currentGame.currentGroupId,
      spin: true,
      next_group_id: nextGame.currentGroupId,
    });
  }

  function runSpin() {
    if (isSpinning || showChoices) return;

    const settledGroup = sourceGroupsById.get(currentGame.currentGroupId);
    let tick = 0;
    setIsSpinning(true);

    const interval = window.setInterval(() => {
      const group = sourceGroups[(tick * 7) % sourceGroups.length];
      setReel({ name: group.name, category: group.category });
      tick += 1;
    }, 72);

    window.setTimeout(() => {
      window.clearInterval(interval);
      setReel({
        name: settledGroup?.name ?? "Tech Twitter",
        category: settledGroup?.category ?? "Social",
      });
    }, 950);

    window.setTimeout(() => {
      setIsSpinning(false);
      setShowChoices(true);
    }, 1250);
  }

  return (
    <main className="app-page relative">
      <header className="app-container grid gap-4 pb-6 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
        <div>
          <Link
            href="/"
            className="inline-flex rounded-[var(--radius)] text-3xl font-semibold leading-tight transition hover:text-[var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--acid)]"
          >
            Till Series B
          </Link>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Build a four-role startup team.
          </p>
        </div>
        <div className="min-w-[240px]">
          <p className="text-center text-sm font-semibold">
            Round {currentGame.round} / {currentGame.maxRounds}
          </p>
          <div className="mt-2">
            <Progress value={progress} />
          </div>
        </div>
        <div className="flex justify-start gap-2 lg:justify-end">
          <HowToPlayDialog />
        </div>
      </header>

      <div className="app-container grid gap-4">
        <section className="game-grid items-start">
          <div className="self-start rounded-[var(--radius)] border border-[color-mix(in_oklch,var(--pink),transparent_62%)] bg-[var(--panel)] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="muted" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  {showChoices ? "CURRENT GROUP" : "READY TO SPIN"}
                </Badge>
                <span className="hidden h-5 w-px bg-[var(--line)] sm:block" />
                <button
                  className="text-xs font-semibold text-[var(--muted)]"
                  type="button"
                >
                  {showChoices ? (group?.category ?? "Social") : "Category"}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
                  <RotateCw className="h-4 w-4" />
                  Forced pick
                </div>
                {showChoices && !hasPlayableChoices ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      spinCurrentGroup();
                      setReel({ name: "???", category: "???" });
                    }}
                    className="min-h-10 px-3 py-2"
                  >
                    <RotateCw className="h-4 w-4" />
                    Spin group
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
                Pick one from
              </p>
              <h2 className="mt-1 text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">
                {showChoices
                  ? (group?.name ?? "Tech Twitter")
                  : "Spin the category"}
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
                {showChoices && !hasPlayableChoices
                  ? "This group cannot fill any remaining open role. Spin for another group."
                  : showChoices
                    ? (group?.description ??
                      "Choose the person who makes this startup least likely to implode.")
                    : "Click spin to reveal this round's company or scene."}
              </p>
            </div>

            {showChoices && picked ? (
              <div className="mt-3 rounded-[var(--radius)] border border-[color-mix(in_oklch,var(--acid),transparent_45%)] bg-[color-mix(in_oklch,var(--surface),var(--acid)_7%)] p-2.5 text-sm font-semibold text-[var(--gold)]">
                Added {picked.name} as{" "}
                {lastAssignment?.assignedRole.toUpperCase()}.
              </div>
            ) : null}

            {showChoices && selectedPerson ? (
              <div className="mt-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-2.5 text-sm font-semibold text-[var(--text)]">
                Placing:{" "}
                <span className="text-[var(--gold)]">
                  {selectedPerson.name}
                </span>
                . Choose a matching open role.
              </div>
            ) : null}

            {!showChoices ? (
              <section className="mt-6 grid justify-items-center gap-5 py-6">
                <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
                  <div className="text-center">
                    <div className="rounded-[var(--radius)] bg-[color-mix(in_oklch,var(--gold),transparent_28%)] p-1.5">
                      <div className="rounded-md bg-[var(--surface)] px-4 py-4">
                        <p className="text-xs font-semibold uppercase text-[var(--gold)]">
                          Group
                        </p>
                        <p className="mt-1 truncate text-2xl font-semibold">
                          {reel.name}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
                      Company / Scene
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="rounded-[var(--radius)] bg-[color-mix(in_oklch,var(--pink),transparent_30%)] p-1.5">
                      <div className="rounded-md bg-[var(--surface)] px-4 py-4">
                        <p className="text-xs font-semibold uppercase text-[var(--pink)]">
                          Category
                        </p>
                        <p className="mt-1 truncate text-2xl font-semibold">
                          {reel.category}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
                      Category
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={runSpin}
                  disabled={isSpinning}
                  className="min-w-48 rounded-[var(--radius)] bg-[var(--acid)] px-8 py-3 text-base font-semibold text-[var(--bg-strong)] transition hover:bg-[color-mix(in_oklch,var(--acid),white_8%)] disabled:opacity-70"
                >
                  {isSpinning ? "SPINNING" : "SPIN"}
                </button>
              </section>
            ) : (
              <section className="mt-4 grid gap-3 xl:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {choices.map((person) => (
                    <motion.div
                      key={`${currentGame.round}-${person.id}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      <PersonCard
                        person={person}
                        selected={selectedPersonId === person.id}
                        disabled={
                          getCompatibleRoles(person, currentGame.team).length ===
                          0
                        }
                        onSelect={selectPerson}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {!hasPlayableChoices ? (
                  <div className="rounded-[var(--radius)] border border-dashed border-[var(--line)] bg-[var(--surface)] p-4 text-center xl:col-span-2">
                    <p className="text-lg font-semibold">
                      No matching roles in this group.
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Spin again. This does not spend a round.
                    </p>
                    <Button onClick={spinCurrentGroup} className="mt-4">
                      <RotateCw className="h-4 w-4" />
                      Spin group
                    </Button>
                  </div>
                ) : null}
              </section>
            )}
          </div>

          <StartupBoard
            game={currentGame}
            selectedPerson={selectedPerson}
            onPlace={place}
          />
        </section>
      </div>
    </main>
  );
}
