import { describe, expect, it } from "vitest";
import type { GameState, Role } from "@/data/types";
import {
  getResultInsights,
  RESULT_INSIGHT_VARIANT_COUNTS,
} from "@/lib/result-insights";
import { resultHeadline, shareText } from "@/lib/result-copy";
import { outcomeForScore, scoreGame } from "@/lib/scoring";

function stateWithTeam(team: Record<Role, string>): GameState {
  return {
    id: "test-game",
    companyName: "Orbit Labs",
    round: 4,
    maxRounds: 4,
    currentGroupId: "tech-twitter",
    team,
    usedGroupIds: ["tech-twitter"],
    picks: Object.values(team).map((selectedPersonId, index) => ({
      round: index + 1,
      groupId: "tech-twitter",
      selectedPersonId,
      assignedRole: Object.keys(team)[index] as Role,
    })),
  };
}

describe("scoring", () => {
  it("classifies every PRD outcome band", () => {
    expect(outcomeForScore(100).tier).toBe("shutdown");
    expect(outcomeForScore(300).tier).toBe("seed");
    expect(outcomeForScore(500).tier).toBe("series-a");
    expect(outcomeForScore(650).tier).toBe("unicorn");
    expect(outcomeForScore(800).tier).toBe("decacorn");
    expect(outcomeForScore(900).tier).toBe("ipo");
    expect(outcomeForScore(980).tier).toBe("trillion");
  });

  it("rewards strong balanced teams over one-dimensional teams", () => {
    const balanced = scoreGame(stateWithTeam({
      ceo: "patrick-collison",
      cto: "andrej-karpathy",
      product: "dylan-field",
      growth: "alex-hormozi",
    }));
    const oneDimensional = scoreGame(stateWithTeam({
      ceo: "sam-altman",
      cto: "ilya-sutskever",
      product: "vitalik-buterin",
      growth: "john-carmack",
    }));

    expect(balanced.score).toBeGreaterThan(oneDimensional.score);
  });

  it("penalizes high chaos", () => {
    const calm = scoreGame(stateWithTeam({
      ceo: "satya-nadella",
      cto: "evan-you",
      product: "melanie-perkins",
      growth: "lenny-rachitsky",
    }));
    const chaos = scoreGame(stateWithTeam({
      ceo: "elon-musk",
      cto: "george-hotz",
      product: "steve-jobs",
      growth: "chamath-palihapitiya",
    }));

    expect(chaos.breakdown.penalty).toBeGreaterThan(calm.breakdown.penalty);
  });

  it("applies fame multiplier and deterministic tag bonuses", () => {
    const result = scoreGame(stateWithTeam({
      ceo: "sam-altman",
      cto: "andrej-karpathy",
      product: "mira-murati",
      growth: "lee-robinson",
    }));

    expect(result.breakdown.fameMultiplier).toBeGreaterThan(1);
    expect(result.breakdown.synergyBonus).toBeGreaterThan(0);
    expect(scoreGame(stateWithTeam({
      ceo: "sam-altman",
      cto: "andrej-karpathy",
      product: "mira-murati",
      growth: "lee-robinson",
    })).score).toBe(result.score);
  });

  it("provides broad, deterministic result insight copy", () => {
    const result = scoreGame(stateWithTeam({
      ceo: "patrick-collison",
      cto: "andrej-karpathy",
      product: "dylan-field",
      growth: "alex-hormozi",
    }));

    expect(RESULT_INSIGHT_VARIANT_COUNTS.strength).toBeGreaterThanOrEqual(20);
    expect(RESULT_INSIGHT_VARIANT_COUNTS.weakness).toBeGreaterThanOrEqual(20);
    expect(getResultInsights(result)).toEqual(getResultInsights(result));
    expect(resultHeadline(result, "Orbit Labs")).toContain("Orbit Labs");
    expect(shareText(result, "Orbit Labs")).toContain("Orbit Labs");
  });
});
