"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createGame, getRoundChoices, pickPerson } from "@/lib/game";
import type { GameState, Person } from "@/data/types";

type LastAssignment = {
  assignedRole: string;
  replacedPersonId?: string;
  pickedPersonId: string;
};

type GameStore = {
  game?: GameState;
  choices: Person[];
  lastAssignment?: LastAssignment;
  startGame: () => GameState;
  pick: (personId: string) => { completed: boolean; state: GameState; assignment: LastAssignment };
  reset: () => void;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      choices: [],
      startGame: () => {
        const game = createGame();
        const choices = getRoundChoices(game);
        set({ game, choices, lastAssignment: undefined });
        return game;
      },
      pick: (personId: string) => {
        const currentGame = get().game;

        if (!currentGame) {
          const game = createGame();
          const choices = getRoundChoices(game);
          set({ game, choices });
          return get().pick(personId);
        }

        const result = pickPerson(currentGame, personId);
        const choices = result.completed ? [] : getRoundChoices(result.state);
        const assignment = {
          ...result.assignment,
          assignedRole: result.assignment.assignedRole,
          pickedPersonId: personId,
        };

        set({ game: result.state, choices, lastAssignment: assignment });

        return {
          completed: result.completed,
          state: result.state,
          assignment,
        };
      },
      reset: () => set({ game: undefined, choices: [], lastAssignment: undefined }),
    }),
    {
      name: "startup-82-0",
      partialize: (state) => ({
        game: state.game,
        choices: state.choices,
        lastAssignment: state.lastAssignment,
      }),
    }
  )
);
