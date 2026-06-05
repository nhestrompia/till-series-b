import { describe, expect, it } from "vitest";
import { peopleById } from "@/data/people";
import { assignPersonToTeam, createGame, getRoundChoices, pickPerson } from "@/lib/game";
import type { Role } from "@/data/types";

describe("game engine", () => {
  it("starts a 5-round game with a valid first group", () => {
    const game = createGame();

    expect(game.maxRounds).toBe(5);
    expect(game.round).toBe(1);
    expect(game.currentGroupId).toBeTruthy();
    expect(game.usedGroupIds).toHaveLength(1);
  });

  it("samples 3-5 people for the current round", () => {
    const game = createGame();
    const choices = getRoundChoices(game);

    expect(choices.length).toBeGreaterThanOrEqual(3);
    expect(choices.length).toBeLessThanOrEqual(5);
  });

  it("does not repeat groups before exhaustion during a normal game", () => {
    let game = createGame();

    for (let index = 0; index < 8; index += 1) {
      const choice = getRoundChoices(game)[0];
      game = pickPerson(game, choice.id).state;
    }

    expect(new Set(game.usedGroupIds).size).toBe(game.usedGroupIds.length);
  });

  it("always accepts a pick and fills an empty primary role first", () => {
    const person = peopleById.get("andrej-karpathy")!;
    const assignment = assignPersonToTeam({}, person);

    expect(assignment.assignedRole).toBe("cto");
    expect(assignment.team.cto).toBe(person.id);
  });

  it("replaces a weaker relevant incumbent when roles are full", () => {
    const fullTeam: Record<Role, string> = {
      ceo: "marc-lou",
      cto: "swizec-teller",
      product: "arvid-kahl",
      growth: "courtland-allen",
      operator: "brian-lee",
    };
    const person = peopleById.get("jensen-huang")!;
    const assignment = assignPersonToTeam(fullTeam, person);

    expect(Object.values(assignment.team)).toContain(person.id);
    expect(assignment.replacedPersonId).toBeTruthy();
  });
});
