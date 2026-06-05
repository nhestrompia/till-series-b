import { peopleById } from "@/data/people";
import type { GameState } from "@/data/types";
import {
  assignPersonToTeam,
  createGame,
  getCompatibleRoles,
  getCurrentGroup,
  getRoundChoices,
  placePerson,
} from "@/lib/game";
import { describe, expect, it } from "vitest";

describe("game engine", () => {
  it("starts a 4-round game with a valid first group", () => {
    const game = createGame("Orbit Labs");

    expect(game.companyName).toBe("Orbit Labs");
    expect(game.maxRounds).toBe(4);
    expect(game.round).toBe(1);
    expect(game.currentGroupId).toBeTruthy();
    expect(game.usedGroupIds).toHaveLength(1);
  });

  it("normalizes an empty company name", () => {
    expect(createGame("   ").companyName).toBe("Pied Piper");
  });

  it("lists every unpicked person for the current round", () => {
    const game = createGame();
    const choices = getRoundChoices(game);
    const group = getCurrentGroup(game);
    const expected = group.peopleIds
      .map((id) => peopleById.get(id))
      .filter(Boolean);

    expect(new Set(choices.map((person) => person.id))).toEqual(
      new Set(expected.map((person) => person!.id)),
    );
  });

  it("keeps incompatible people visible so the UI can disable them", () => {
    const game: GameState = {
      ...createGame(),
      currentGroupId: "openai",
      team: {
        cto: "ilya-sutskever",
        product: "mira-murati",
      },
    };
    const choices = getRoundChoices(game);
    const andrej = choices.find((person) => person.id === "andrej-karpathy");

    expect(andrej).toBeTruthy();
    expect(getCompatibleRoles(andrej!, game.team)).toHaveLength(0);
  });

  it("does not repeat groups before exhaustion during a normal game", () => {
    let game = createGame();

    for (let index = 0; index < game.maxRounds - 1; index += 1) {
      const choice = getRoundChoices(game).find(
        (person) => getCompatibleRoles(person, game.team).length > 0,
      )!;
      const role = getCompatibleRoles(choice, game.team)[0]!;
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

    expect(() => assignPersonToTeam({}, person, "growth")).toThrow(
      "cannot fill",
    );
  });

  it("places the selected person into an open secondary role", () => {
    const team = {
      cto: "swizec-teller",
    };
    const person = peopleById.get("andrej-karpathy")!;
    const assignment = assignPersonToTeam(team, person, "product");

    expect(assignment.team.product).toBe(person.id);
  });
});
