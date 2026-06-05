"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { roleShortLabels } from "@/lib/game";
import { resultHeadline } from "@/lib/result-copy";
import type { StartupResult } from "@/lib/scoring";
import { AlertTriangle, Star } from "lucide-react";
import * as React from "react";

type ResultCardProps = {
  result: StartupResult;
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function teamPeople(result: StartupResult) {
  return result.team.map((slot) => slot.person).filter(Boolean);
}

function teamRating(score: number) {
  if (score >= 900) return "A+";
  if (score >= 760) return "A";
  if (score >= 620) return "B+";
  if (score >= 480) return "B";
  if (score >= 330) return "C";
  return "D";
}

const metricToneClass = {
  acid: "text-[var(--acid)]",
  cyan: "text-[var(--cyan)]",
  gold: "text-[var(--gold)]",
  pink: "text-[var(--pink)]",
};

export const ResultCard = React.forwardRef<HTMLDivElement, ResultCardProps>(
  ({ result }, ref) => {
    const team = teamPeople(result);
    const market = average(team.map((person) => (person!.stats.growth + person!.stats.fundraising + person!.stats.fame) / 3));
    const execution = average(team.map((person) => (person!.stats.operations + person!.stats.product + person!.stats.engineering) / 3));
    const chaos = average(team.map((person) => person!.stats.chaos));
    const metrics = [
      ["Team Rating", teamRating(result.score), "pink"],
      ["Market Potential", market, "acid"],
      ["Execution", execution, "cyan"],
      ["Chaos Level", chaos, "gold"],
      ["TSB Score", result.score, "pink"],
    ] as const;

    return (
      <div
        ref={ref}
        className="result-card overflow-hidden rounded-[var(--radius)] border border-[var(--line)] p-4 sm:p-5"
      >
        <div className="py-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--pink)]">
            Your startup is ready
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
            {resultHeadline(result)}
          </h1>
        </div>

        <div className="grid gap-3 sm:grid-cols-5">
          {metrics.map(([label, value, tone]) => (
            <div key={label} className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg)] p-3 text-center">
              <p className="text-xs text-[var(--muted)]">{label}</p>
              <p className={`mt-1.5 text-2xl font-semibold ${metricToneClass[tone]}`}>{value}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-5 text-lg font-semibold">Your Team</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-5">
          {result.team.map(({ role, person }) => (
            <div
              key={role}
              className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg)] p-3 text-center"
            >
              <Badge tone={role === "growth" ? "gold" : role === "operator" ? "cyan" : role === "product" ? "acid" : "pink"} className="mx-auto">
                {roleShortLabels[role]}
              </Badge>
              {person ? (
                <>
                  <Avatar name={person.name} className="mx-auto mt-3 h-11 w-11" />
                  <p className="mt-3 min-h-10 text-sm font-semibold leading-snug">{person.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{person.knownFor}</p>
                </>
              ) : (
                <p className="mt-4 text-sm text-[var(--muted)]">Vacant</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="min-h-36 overflow-hidden rounded-[var(--radius)] border border-[color-mix(in_oklch,var(--acid),transparent_50%)] bg-[color-mix(in_oklch,var(--acid),transparent_94%)] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--acid)]">
              <Star className="h-4 w-4 fill-current" />
              Biggest Strength
            </div>
            <p className="mt-3 text-2xl font-semibold text-[var(--acid)]">
              {result.strengths[0] ?? "Distribution"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {result.bestPick.name} gave this team enough momentum to make the market look obvious.
            </p>
          </div>
          <div className="min-h-36 overflow-hidden rounded-[var(--radius)] border border-[color-mix(in_oklch,var(--gold),transparent_50%)] bg-[color-mix(in_oklch,var(--gold),transparent_94%)] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--gold)]">
              <AlertTriangle className="h-4 w-4 fill-current" />
              Biggest Weakness
            </div>
            <p className="mt-3 text-2xl font-semibold text-[var(--gold)]">
              {chaos > 65 ? "Deadlines are optional" : "Narrative risk"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{result.weakness}</p>
          </div>
        </div>

        <p className="mt-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg)] p-4 text-sm leading-7 text-[var(--muted)]">
          {result.story}
        </p>
      </div>
    );
  },
);

ResultCard.displayName = "ResultCard";
