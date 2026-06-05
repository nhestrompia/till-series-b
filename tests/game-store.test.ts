import { beforeEach, describe, expect, it } from "vitest";

import { useGameStore } from "@/store/game-store";

describe("game store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useGameStore.setState({
      game: undefined,
      lastCompanyName: undefined,
      choices: [],
      selectedPersonId: undefined,
      lastAssignment: undefined,
    });
  });

  it("remembers the company name after resetting a game", () => {
    useGameStore.getState().startGame("Orbit Labs");
    useGameStore.getState().reset();

    expect(useGameStore.getState().game).toBeUndefined();
    expect(useGameStore.getState().lastCompanyName).toBe("Orbit Labs");
  });
});
