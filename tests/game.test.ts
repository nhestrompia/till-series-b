import { describe, expect, it } from "vitest";
import { peopleById } from "@/data/people";
import { assignPersonToTeam, createGame, getCompatibleRoles, getCurrentGroup, getRoundChoices, placePerson } from "@/lib/game";
import type { Role } from "@/data/types";

describe("game engine", () => {
  it("starts a 5-round game with a valid first group", () => {
    const game = createGame();

    expect(game.maxRounds).toBe(5);
    expect(game.round).toBe(1);
    expect(game.currentGroupId).toBeTruthy();
    expect(game.usedGroupIds).toHaveLength(1);
  });

  it("lists every compatible person for the current round", () => {
    const game = createGame();
    const choices = getRoundChoices(game);
    const group = getCurrentGroup(game);
    const expected = group.peopleIds
      .map((id) => peopleById.get(id))
      .filter((person) => person && getCompatibleRoles(person, game.team).length > 0);

    expect(new Set(choices.map((person) => person.id))).toEqual(new Set(expected.map((person) => person!.id)));
  });

  it("does not repeat groups before exhaustion during a normal game", () => {
    let game = createGame();

    for (let index = 0; index < game.maxRounds - 1; index += 1) {
      const choice = getRoundChoices(game)[0];
      const role = getCompatibleRoles(choice, game.team)[0];
      game = placePerson(game, choice.id, role).state;
    }

    expect(new Set(game.usedGroupIds).size).toBe(game.usedGroupIds.length);
  });

  it("always accepts a pick and fills an empty primary role first", () => {
    const person = peopleById.get("andrej-karpathy")!;
    const assignment = assignPersonToTeam({}, person, "cto");

    expect(assignment.assignedRole).toBe("cto");
    expect(assignment.team.cto).toBe(person.id);
  });

  it("rejects incompatible role placement", () => {
    const person = peopleById.get("andrej-karpathy")!;

    expect(() => assignPersonToTeam({}, person, "growth")).toThrow("cannot fill");
  });

  it("places the selected person into the requested compatible open role", () => {
    const fullTeam: Record<Role, string> = {
      ceo: "marc-lou",
      cto: "swizec-teller",
      product: "arvid-kahl",
      growth: "courtland-allen",
      operator: "",
    };
    const person = peopleById.get("harley-finkelstein")!;
    const assignment = assignPersonToTeam({ ...fullTeam, operator: undefined }, person, "operator");

    expect(assignment.team.operator).toBe(person.id);
  });
});
