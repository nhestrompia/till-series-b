"use client";

import type { GameState, Person, Role } from "@/data/types";
import {
  createGame,
  getRoundChoices,
  placePerson,
  spinGroup,
} from "@/lib/game";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LastAssignment = {
  assignedRole: string;
  replacedPersonId?: string;
  pickedPersonId: string;
};

type GameStore = {
  game?: GameState;
  choices: Person[];
  selectedPersonId?: string;
  lastAssignment?: LastAssignment;
  startGame: () => GameState;
  selectPerson: (personId: string) => void;
  placeSelected: (role: Role) => {
    completed: boolean;
    state: GameState;
    assignment: LastAssignment;
  };
  spin: () => GameState;
  reset: () => void;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      choices: [],
      startGame: () => {
        const game = createGame();
        const choices = getRoundChoices(game);
        set({
          game,
          choices,
          selectedPersonId: undefined,
          lastAssignment: undefined,
        });
        return game;
      },
      selectPerson: (personId: string) => set({ selectedPersonId: personId }),
      placeSelected: (role: Role) => {
        const currentGame = get().game;
        const selectedPersonId = get().selectedPersonId;

        if (!selectedPersonId) {
          throw new Error("Select a person before placing them");
        }

        if (!currentGame) {
          const game = createGame();
          const choices = getRoundChoices(game);
          set({ game, choices });
          return get().placeSelected(role);
        }

        const result = placePerson(currentGame, selectedPersonId, role);
        const choices = result.completed ? [] : getRoundChoices(result.state);
        const assignment = {
          assignedRole: result.assignment.assignedRole,
          pickedPersonId: selectedPersonId,
        };

        set({
          game: result.state,
          choices,
          selectedPersonId: undefined,
          lastAssignment: assignment,
        });

        return {
          completed: result.completed,
          state: result.state,
          assignment,
        };
      },
      spin: () => {
        const currentGame = get().game ?? createGame();
        const game = spinGroup(currentGame);
        const choices = getRoundChoices(game);
        set({
          game,
          choices,
          selectedPersonId: undefined,
          lastAssignment: undefined,
        });
        return game;
      },
      reset: () =>
        set({
          game: undefined,
          choices: [],
          selectedPersonId: undefined,
          lastAssignment: undefined,
        }),
    }),
    {
      name: "till-series-b",
      partialize: (state) => ({
        game: state.game,
        choices: state.choices,
        selectedPersonId: state.selectedPersonId,
        lastAssignment: state.lastAssignment,
      }),
    },
  ),
);
