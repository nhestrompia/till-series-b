"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { roleShortLabels } from "@/lib/game";
import { resultHeadline } from "@/lib/result-copy";
import type { StartupResult } from "@/lib/scoring";

type ResultCardProps = {
  result: StartupResult;
};

export const ResultCard = React.forwardRef<HTMLDivElement, ResultCardProps>(({ result }, ref) => {
  return (
    <div ref={ref} className="result-card overflow-hidden rounded-[24px] border border-[var(--line)] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-5">
        <Badge tone="acid">Startup 82-0</Badge>
        <Badge tone={result.tier === "shutdown" ? "pink" : result.tier === "trillion" ? "gold" : "cyan"}>
          Score {result.score}
        </Badge>
      </div>
      <div className="py-8 text-center">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--muted)]">Projected company</p>
        <h1 className="display-font mx-auto mt-4 max-w-3xl text-4xl leading-[0.95] sm:text-6xl">{resultHeadline(result)}</h1>
        <p className="mt-5 text-xl font-black text-[var(--gold)]">{result.outcome}</p>
      </div>

      <div className="grid gap-3">
        {result.team.map(({ role, person }) => (
          <div key={role} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[var(--radius)] bg-[var(--bg)] p-4">
            <Badge tone="muted">{roleShortLabels[role]}</Badge>
            {person ? (
              <>
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={person.name} className="h-12 w-12 rounded-xl" />
                  <div className="min-w-0">
                    <p className="truncate text-lg font-black text-[var(--text)]">{person.name}</p>
                    <p className="truncate text-sm text-[var(--muted)]">{person.knownFor}</p>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-right text-lg font-black">{Math.max(person.stats.vision, person.stats.engineering, person.stats.growth, person.stats.product)}</p>
                  <p className="text-right text-xs font-black text-[var(--muted)]">OVR</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-[var(--muted)]">Vacant</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg)] p-4">
          <p className="text-xs font-black uppercase text-[var(--acid)]">Best pick</p>
          <p className="mt-2 text-lg font-black">{result.bestPick.name} shipped the MVP before the kickoff doc was approved.</p>
        </div>
        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg)] p-4">
          <p className="text-xs font-black uppercase text-[var(--pink)]">Weakness</p>
          <p className="mt-2 text-lg font-black">{result.weakness}</p>
        </div>
      </div>
      <p className="mt-5 text-base leading-7 text-[var(--muted)]">{result.story}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {result.strengths.map((strength) => (
          <Badge key={strength} tone="gold">{strength}</Badge>
        ))}
      </div>
    </div>
  );
});

ResultCard.displayName = "ResultCard";
