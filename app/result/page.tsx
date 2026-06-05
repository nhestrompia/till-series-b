"use client";

import { ResultCard } from "@/components/ResultCard";
import { ShareButton } from "@/components/ShareButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackGameEvent } from "@/lib/analytics";
import { scoreGame } from "@/lib/scoring";
import { useGameStore } from "@/store/game-store";
import {
  ArrowLeft,
  Copy,
  Download,
  Link2,
  MessageCircle,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

export default function ResultPage() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const game = useGameStore((state) => state.game);
  const reset = useGameStore((state) => state.reset);
  const result = useMemo(
    () =>
      game && game.picks.length >= game.maxRounds ? scoreGame(game) : undefined,
    [game],
  );
  const companyName = game?.companyName?.trim() || "Pied Piper";

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

  function restart() {
    reset();
    trackGameEvent("replay_clicked");
    router.push("/");
  }

  if (!result) {
    return (
      <main className="page-shell relative grid place-items-center">
        <Badge tone="acid">Calculating valuation...</Badge>
      </main>
    );
  }

  return (
    <main className="app-page relative">
      <div className="app-container grid max-w-6xl gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="secondary" onClick={restart}>
            <ArrowLeft className="h-4 w-4" />
            New Game
          </Button>
          <ShareButton
            target={cardRef}
            result={result}
            companyName={companyName}
          />
        </div>

        <ResultCard ref={cardRef} result={result} companyName={companyName} />

        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--panel)] p-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_2fr] lg:items-center">
            <div>
              <h2 className="text-lg font-semibold">Share your result</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Brag. Roast. Start arguments.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {[
                [Copy, "Copy Link"],
                [MessageCircle, "Twitter"],
                [Link2, "LinkedIn"],
                [Share2, "Reddit"],
                [Download, "Download"],
              ].map(([Icon, label]) => (
                <Button
                  key={label as string}
                  variant="secondary"
                  onClick={() =>
                    document
                      .querySelector<HTMLButtonElement>("[data-share-trigger]")
                      ?.click()
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label as string}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--panel)] p-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <p className="text-center font-semibold sm:text-left">
              Think you can build a better team?
            </p>
            <Button onClick={restart} className="w-full sm:w-72">
              <RotateCcw className="h-4 w-4" />
              Play Again
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
