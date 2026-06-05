"use client";

import { Rocket, Shuffle, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useGameStore } from "@/store/game-store";
import { trackGameEvent } from "@/lib/analytics";
import { getRosterSize } from "@/lib/game";

const beats = [
  { icon: Shuffle, label: "5 forced picks", copy: "One group at a time. No skipping. No spreadsheet cosplay." },
  { icon: Rocket, label: "Hidden scoring", copy: "Coverage, synergy, fame, chaos, and ego collisions." },
  { icon: Trophy, label: "Shareable result", copy: "Screenshot your cursed cap table and start arguments." },
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
    <main className="page-shell relative">
      <header className="top-bar flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-[var(--acid)] bg-[var(--surface)] text-xs font-black leading-none text-[var(--acid)]">
            82<br />0
          </div>
          <p className="text-xl font-black">Startup 82-0</p>
        </div>
        <Badge tone="muted">{getRosterSize()} people</Badge>
      </header>
      <section className="mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-6xl gap-8 p-4 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Badge tone="gold">Startup 82-0</Badge>
          <h1 className="display-font mt-5 max-w-4xl text-5xl leading-[0.94] sm:text-7xl">
            Build the most cursed startup team in tech.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-[var(--muted)]">
            Five picks. No skipping. No spreadsheets. Just vibes, chaos, and valuation.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={start} className="text-base">
              <Rocket className="h-5 w-5" />
              Start Company
            </Button>
            <Button variant="secondary" onClick={start}>
              Randomize my cap table
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="grid gap-3"
        >
          <Card className="p-5">
            <div className="flex items-center justify-between gap-4">
              <Badge tone="acid">5 rounds</Badge>
              <Badge tone="cyan">{getRosterSize()}+ people</Badge>
            </div>
            <div className="mt-6 grid gap-3">
              {["CEO", "CTO", "Product", "Growth", "Ops"].map((role, index) => (
                <div key={role} className="flex items-center justify-between rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg)] px-4 py-3">
                  <span className="font-black text-[var(--muted)]">{role}</span>
                  <span className="text-sm font-black text-[var(--gold)]">Slot {index + 1}</span>
                </div>
              ))}
            </div>
          </Card>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {beats.map((beat) => (
              <Card key={beat.label} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--surface-lift)]">
                    <beat.icon className="h-5 w-5 text-[var(--acid)]" />
                  </div>
                  <div>
                    <h2 className="font-black">{beat.label}</h2>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{beat.copy}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
