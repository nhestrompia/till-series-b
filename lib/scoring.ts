import { peopleById } from "@/data/people";
import type { GamePick, GameState, Person, Role } from "@/data/types";
import { getPickedPeople, getTeamPeople, roleFitScore, roles } from "@/lib/game";

export type OutcomeTier =
  | "shutdown"
  | "seed"
  | "series-a"
  | "unicorn"
  | "decacorn"
  | "ipo"
  | "trillion";

export type ScoreBreakdown = {
  roleScore: number;
  coverageBonus: number;
  balanceBonus: number;
  synergyBonus: number;
  categoryBonus: number;
  penalty: number;
  fameMultiplier: number;
  finalScore: number;
};

export type StartupResult = {
  tier: OutcomeTier;
  outcome: string;
  valuation: string;
  score: number;
  breakdown: ScoreBreakdown;
  bestPick: Person;
  weakness: string;
  story: string;
  strengths: string[];
  team: Array<{ role: Role; person?: Person }>;
};

const tagBonuses: Array<{ tags: string[]; label: string; points: number }> = [
  { tags: ["ai"], label: "AI wave", points: 55 },
  { tags: ["crypto"], label: "bull-market beta", points: 35 },
  { tags: ["yc"], label: "demo-day aura", points: 40 },
  { tags: ["design"], label: "taste premium", points: 32 },
  { tags: ["operator"], label: "adult supervision", points: 36 },
  { tags: ["distribution"], label: "distribution machine", points: 42 },
  { tags: ["infra"], label: "technical moat", points: 28 },
  { tags: ["indie"], label: "speed run", points: 25 },
];

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function teamPeople(state: GameState) {
  return getTeamPeople(state.team).map(({ person }) => person).filter(Boolean) as Person[];
}

function roleScore(state: GameState) {
  return getTeamPeople(state.team).reduce((sum, slot) => {
    if (!slot.person) return sum;
    return sum + roleFitScore(slot.person, slot.role);
  }, 0);
}

function calculateSynergy(team: Person[]) {
  const tags = team.flatMap((person) => person.tags);
  const tagCount = new Map<string, number>();

  tags.forEach((tag) => tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1));

  const tagScore = tagBonuses.reduce((sum, bonus) => {
    const matchingCount = bonus.tags.reduce((count, tag) => count + (tagCount.get(tag) ?? 0), 0);
    return matchingCount >= 2 ? sum + bonus.points : sum;
  }, 0);

  const ceo = team.find((person) => person.primaryRole === "ceo" || person.secondaryRole === "ceo");
  const cto = team.find((person) => person.primaryRole === "cto" || person.secondaryRole === "cto");
  const product = team.find((person) => person.primaryRole === "product" || person.secondaryRole === "product");
  const growth = team.find((person) => person.primaryRole === "growth" || person.secondaryRole === "growth");

  let comboScore = 0;
  if (ceo && cto && ceo.stats.vision + cto.stats.engineering > 175) comboScore += 70;
  if (product && growth && product.stats.product + growth.stats.growth > 170) comboScore += 60;
  if (cto && product && cto.stats.engineering + product.stats.product > 172) comboScore += 55;

  return tagScore + comboScore;
}

function calculatePenalty(team: Person[]) {
  const ceoTypes = team.filter((person) => person.primaryRole === "ceo" || person.secondaryRole === "ceo").length;
  const engineerTypes = team.filter((person) => person.primaryRole === "cto" || person.stats.engineering >= 88).length;
  const avgChaos = average(team.map((person) => person.stats.chaos));
  const avgFame = average(team.map((person) => person.stats.fame));
  const avgProduct = average(team.map((person) => person.stats.product));
  const avgGrowth = average(team.map((person) => person.stats.growth));
  let penalty = 0;

  if (ceoTypes >= 4) penalty += 90;
  if (engineerTypes >= 4 && avgGrowth < 72) penalty += 75;
  if (avgChaos > 70) penalty += Math.round((avgChaos - 70) * 5);
  if (avgFame < 58) penalty += 70;
  if (avgFame > 88 && avgProduct < 76) penalty += 65;

  return penalty;
}

export function outcomeForScore(score: number) {
  if (score <= 250) return { tier: "shutdown" as const, outcome: "Shut down after 3 months" };
  if (score <= 400) return { tier: "seed" as const, outcome: "Raised Seed, then pivoted forever" };
  if (score <= 550) return { tier: "series-a" as const, outcome: "Series A company" };
  if (score <= 700) return { tier: "unicorn" as const, outcome: "Unicorn" };
  if (score <= 850) return { tier: "decacorn" as const, outcome: "Decacorn" };
  if (score <= 950) return { tier: "ipo" as const, outcome: "IPO" };
  return { tier: "trillion" as const, outcome: "Trillion-dollar company" };
}

function valuationForScore(score: number) {
  if (score <= 250) return "$0";
  if (score <= 400) return `$${Math.max(2, Math.round(score / 18))}M`;
  if (score <= 550) return `$${Math.round(score / 8)}M`;
  if (score <= 700) return `$${(score / 130).toFixed(1)}B`;
  if (score <= 850) return `$${(score / 55).toFixed(1)}B`;
  if (score <= 950) return `$${Math.round(score / 12)}B public company`;
  return `$${(score / 980).toFixed(2)}T`;
}

function bestPickFromPicks(picks: GamePick[]) {
  const picked = getPickedPeople(picks);
  return picked.sort((a, b) => {
    const aScore = Math.max(...roles.map((role) => roleFitScore(a, role)));
    const bScore = Math.max(...roles.map((role) => roleFitScore(b, role)));
    return bScore - aScore;
  })[0] ?? peopleById.get("pieter-levels")!;
}

function weaknessForTeam(team: Person[]) {
  const avgChaos = average(team.map((person) => person.stats.chaos));
  const avgGrowth = average(team.map((person) => person.stats.growth));
  const avgOperations = average(team.map((person) => person.stats.operations));
  const ceoTypes = team.filter((person) => person.primaryRole === "ceo" || person.secondaryRole === "ceo").length;

  if (avgChaos > 72) return "Your all-hands meetings needed moderators, lawyers, and probably a helmet.";
  if (ceoTypes >= 4) return "Your team had four visionaries and zero people willing to answer customer emails.";
  if (avgGrowth < 68) return "The product worked, but nobody outside the group chat ever found it.";
  if (avgOperations < 68) return "Launch week became a calendar-shaped crime scene.";
  return "Your CTO tried to rewrite the whole stack during launch week.";
}

function strengthsForTeam(team: Person[]) {
  const strengths: string[] = [];
  const avgProduct = average(team.map((person) => person.stats.product));
  const avgGrowth = average(team.map((person) => person.stats.growth));
  const avgEngineering = average(team.map((person) => person.stats.engineering));
  const avgFundraising = average(team.map((person) => person.stats.fundraising));
  const tags = new Set(team.flatMap((person) => person.tags));

  if (avgEngineering > 82) strengths.push("shipping machine");
  if (avgProduct > 82) strengths.push("product taste");
  if (avgGrowth > 82) strengths.push("distribution wizardry");
  if (avgFundraising > 84) strengths.push("fundraising aura");
  if (tags.has("ai")) strengths.push("AI-wave timing");
  if (tags.has("operator")) strengths.push("adult supervision");

  return strengths.slice(0, 4);
}

function storyForResult(tier: OutcomeTier, team: Person[], bestPick: Person) {
  const tags = new Set(team.flatMap((person) => person.tags));
  const fast = tags.has("fast-shipper") || tags.has("distribution");
  const ai = tags.has("ai");
  const crypto = tags.has("crypto");
  const operator = tags.has("operator");

  if (tier === "shutdown") {
    return `The team opened Notion, renamed the company six times, and shipped a manifesto. ${bestPick.name} did their best, but the launch thread had more replies than users.`;
  }

  if (tier === "seed") {
    return `You raised on vibes, then spent 14 months choosing a JavaScript framework. The deck was incredible. The product was technically an email waitlist.`;
  }

  if (tier === "series-a") {
    return `The company found a real wedge, hired a growth lead, and became impossible to explain at dinner. ${bestPick.name} kept the thing from turning into pure conference content.`;
  }

  if (tier === "unicorn") {
    return `Nobody fully understands the product, but every VC wants in. ${fast ? "It went viral before finance could make a model." : "The team grinded until the market pretended it was obvious."}`;
  }

  if (tier === "decacorn") {
    return `The team launched fast, raised a monster Series A, nearly died from internal chaos, then somehow became the default ${ai ? "AI" : crypto ? "crypto" : "startup"} company.`;
  }

  if (tier === "ipo") {
    return `The S-1 has beautiful margins, confusing risk factors, and one footnote that reads like a Tech Twitter thread. ${operator ? "Operations quietly saved the company every quarter." : "The brand did a suspicious amount of work."}`;
  }

  return "The product is terrifying, the margins are illegal-looking, and the CTO has not slept since 2027.";
}

export function scoreGame(state: GameState): StartupResult {
  const team = teamPeople(state);
  const baseRoleScore = roleScore(state);
  const coverageBonus = team.length * 25;
  const roleValues = getTeamPeople(state.team).map((slot) => slot.person ? roleFitScore(slot.person, slot.role) : 0);
  const balanceBonus = Math.max(0, 110 - Math.round(Math.max(...roleValues) - Math.min(...roleValues)));
  const synergyBonus = calculateSynergy(team);
  const avgFame = average(team.map((person) => person.stats.fame));
  const fameMultiplier = 1 + Math.max(-0.08, Math.min(0.14, (avgFame - 70) / 240));
  const categoryBonus = new Set(team.flatMap((person) => person.sourceGroupIds)).size * 4;
  const penalty = calculatePenalty(team);
  const finalScore = Math.max(0, Math.round((baseRoleScore + coverageBonus + balanceBonus + synergyBonus + categoryBonus - penalty) * fameMultiplier));
  const outcome = outcomeForScore(finalScore);
  const bestPick = bestPickFromPicks(state.picks);

  return {
    ...outcome,
    valuation: valuationForScore(finalScore),
    score: finalScore,
    breakdown: {
      roleScore: baseRoleScore,
      coverageBonus,
      balanceBonus,
      synergyBonus,
      categoryBonus,
      penalty,
      fameMultiplier,
      finalScore,
    },
    bestPick,
    weakness: weaknessForTeam(team),
    story: storyForResult(outcome.tier, team, bestPick),
    strengths: strengthsForTeam(team),
    team: getTeamPeople(state.team),
  };
}
