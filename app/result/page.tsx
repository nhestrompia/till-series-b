"use client";

import { useEffect, useMemo, useRef } from "react";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResultCard } from "@/components/ResultCard";
import { ShareButton } from "@/components/ShareButton";
import { scoreGame } from "@/lib/scoring";
import { trackGameEvent } from "@/lib/analytics";
import { useGameStore } from "@/store/game-store";

export default function ResultPage() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const game = useGameStore((state) => state.game);
  const startGame = useGameStore((state) => state.startGame);
  const reset = useGameStore((state) => state.reset);
  const result = useMemo(() => (game && game.picks.length >= game.maxRounds ? scoreGame(game) : undefined), [game]);

  useEffect(() => {
    if (!game) {
      router.replace("/");
      return;
    }

    if (game.picks.length < game.maxRounds) {
      router.replace("/play");
    }
  }, [game, router]);

  useEffect(() => {
    if (result) {
      trackGameEvent("outcome_generated", {
        outcome: result.tier,
        score: result.score,
        valuation: result.valuation,
      });
    }
  }, [result]);

  function playAgain() {
    reset();
    startGame();
    trackGameEvent("replay_clicked");
    trackGameEvent("game_started", { replay: true });
    router.push("/play");
  }

  if (!result) {
    return (
      <main className="page-shell relative grid place-items-center">
        <Badge tone="acid">Calculating valuation...</Badge>
      </main>
    );
  }

  return (
    <main className="page-shell relative">
      <div className="mx-auto grid w-full max-w-5xl gap-5">
        <ResultCard ref={cardRef} result={result} />
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <ShareButton target={cardRef} result={result} />
          <Button variant="secondary" onClick={playAgain} className="w-full sm:w-auto">
            <RotateCcw className="h-4 w-4" />
            Play again
          </Button>
        </div>
      </div>
    </main>
  );
}
