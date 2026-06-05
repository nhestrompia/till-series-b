"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackGameEvent } from "@/lib/analytics";
import { getRosterSize } from "@/lib/game";
import { useGameStore } from "@/store/game-store";
import { motion } from "framer-motion";
import { BarChart3, Blocks, Rocket, Share2, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const beats = [
  {
    icon: Users,
    label: "1. Draft",
    copy: "Every round shows a new category. Pick one person.",
  },
  {
    icon: Blocks,
    label: "2. Fill roles",
    copy: "Complete 5 core roles to build your startup team.",
  },
  {
    icon: BarChart3,
    label: "3. See results",
    copy: "Get your startup rating, strengths, and weaknesses.",
  },
  {
    icon: Share2,
    label: "4. Share",
    copy: "Brag, roast, or start arguments online.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const startGame = useGameStore((state) => state.startGame);

  function start() {
    startGame();
    trackGameEvent("game_started", { roster_size: getRosterSize() });
    router.push("/play");
  }

  return (
    <main className="page-shell relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_31px,color-mix(in_oklch,var(--line),transparent_78%)_32px),linear-gradient(90deg,transparent_31px,color-mix(in_oklch,var(--line),transparent_78%)_32px)] bg-[size:32px_32px] [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[color-mix(in_oklch,var(--bg-strong),transparent_10%)] px-3 py-1.5 text-base font-semibold">
          TILL <span className="text-[var(--pink)]">SERIES B</span>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-82px)] w-full max-w-5xl place-items-center px-5 pb-8 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full"
        >
          <Badge tone="pink" className="mx-auto">
            DRAFT. BUILD. DECIDE.
          </Badge>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
            Build a startup team from tech’s most volatile roster.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
            You get 5 picks. Fill 5 roles. Build your dream team or nightmare.
          </p>
          <div className="mt-6 flex justify-center">
            <Button onClick={start} className="min-w-56">
              <Rocket className="h-5 w-5" />
              Start a New Game
            </Button>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            No signup. Just one draft.
          </p>

          <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2">
            {["SA", "AK", "PC", "MM", "EM"].map((label) => (
              <div
                key={label}
                className="grid h-10 w-10 place-items-center rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] text-xs font-semibold text-[var(--pink)]"
              >
                {label}
              </div>
            ))}
            <div className="grid h-10 w-10 place-items-center rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] text-xs font-semibold text-[var(--text)]">
              +100
            </div>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            {getRosterSize()} builders, operators, and chaos merchants
          </p>
        </motion.div>

        <section
          id="how"
          className="mt-9 w-full rounded-[var(--radius)] border border-[var(--line)] bg-[color-mix(in_oklch,var(--surface),transparent_8%)]"
        >
          <h2 className="px-4 pt-4 text-left text-lg font-semibold">
            How it works
          </h2>
          <div className="grid gap-3 p-4 sm:grid-cols-4">
            {beats.map((beat) => (
              <div
                key={beat.label}
                className="grid justify-items-center gap-2 p-2 text-center"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-[color-mix(in_oklch,var(--pink),transparent_90%)] text-[var(--pink)]">
                  <beat.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold">{beat.label}</h3>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  {beat.copy}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--line)] px-4 py-3 text-sm text-[var(--muted)]">
            Made for fun. Not affiliated with any company or person.
          </div>
        </section>
      </section>
    </main>
  );
}
