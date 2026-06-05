import { describe, expect, it } from "vitest";
import type { GameState, Role } from "@/data/types";
import { outcomeForScore, scoreGame } from "@/lib/scoring";

function stateWithTeam(team: Record<Role, string>): GameState {
  return {
    id: "test-game",
    round: 12,
    maxRounds: 12,
    currentGroupId: "tech-twitter",
    team,
    usedGroupIds: ["tech-twitter"],
    picks: Object.values(team).map((selectedPersonId, index) => ({
      round: index + 1,
      groupId: "tech-twitter",
      selectedPersonId,
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
      operator: "sheryl-sandberg",
    }));
    const oneDimensional = scoreGame(stateWithTeam({
      ceo: "sam-altman",
      cto: "ilya-sutskever",
      product: "vitalik-buterin",
      growth: "john-carmack",
      operator: "george-hotz",
    }));

    expect(balanced.score).toBeGreaterThan(oneDimensional.score);
  });

  it("penalizes high chaos", () => {
    const calm = scoreGame(stateWithTeam({
      ceo: "satya-nadella",
      cto: "evan-you",
      product: "melanie-perkins",
      growth: "lenny-rachitsky",
      operator: "tim-cook",
    }));
    const chaos = scoreGame(stateWithTeam({
      ceo: "elon-musk",
      cto: "george-hotz",
      product: "steve-jobs",
      growth: "chamath-palihapitiya",
      operator: "cz",
    }));

    expect(chaos.breakdown.penalty).toBeGreaterThan(calm.breakdown.penalty);
  });

  it("applies fame multiplier and deterministic tag bonuses", () => {
    const result = scoreGame(stateWithTeam({
      ceo: "sam-altman",
      cto: "andrej-karpathy",
      product: "mira-murati",
      growth: "lee-robinson",
      operator: "greg-brockman",
    }));

    expect(result.breakdown.fameMultiplier).toBeGreaterThan(1);
    expect(result.breakdown.synergyBonus).toBeGreaterThan(0);
    expect(scoreGame(stateWithTeam({
      ceo: "sam-altman",
      cto: "andrej-karpathy",
      product: "mira-murati",
      growth: "lee-robinson",
      operator: "greg-brockman",
    })).score).toBe(result.score);
  });
});
