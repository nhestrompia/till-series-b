import type { StartupResult } from "@/lib/scoring";

export function resultHeadline(result: StartupResult) {
  if (result.tier === "shutdown") return "You built a startup-shaped calendar invite.";
  if (result.tier === "seed") return `You built a ${result.valuation} seed-stage content machine.`;
  if (result.tier === "series-a") return `You built a ${result.valuation} Series A company.`;
  if (result.tier === "unicorn") return `You built a ${result.valuation} unicorn.`;
  if (result.tier === "decacorn") return `You built a ${result.valuation} decacorn.`;
  if (result.tier === "ipo") return `You built a ${result.valuation}.`;
  return `You built a ${result.valuation} monster.`;
}

export function shareText(result: StartupResult) {
  const team = result.team
    .filter((slot) => slot.person)
    .map((slot) => `${slot.role.toUpperCase()}: ${slot.person!.name}`)
    .join("\n");

  return `${resultHeadline(result)}
Outcome: ${result.outcome}
Best pick: ${result.bestPick.name}
Weakness: ${result.weakness}

${team}`;
}
