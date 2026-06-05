"use client";

import type { GameState, Person, Role } from "@/data/types";
import { peopleById } from "@/data/people";
import {
  createGame,
  getCompatibleRoles,
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
  lastCompanyName?: string;
  choices: Person[];
  selectedPersonId?: string;
  lastAssignment?: LastAssignment;
  startGame: (companyName?: string) => GameState;
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
      startGame: (companyName) => {
        const game = createGame(companyName);
        const choices = getRoundChoices(game);
        set({
          game,
          lastCompanyName: game.companyName,
          choices,
          selectedPersonId: undefined,
          lastAssignment: undefined,
        });
        return game;
      },
      selectPerson: (personId: string) => {
        const currentGame = get().game;
        const person = peopleById.get(personId);

        if (
          !currentGame ||
          !person ||
          getCompatibleRoles(person, currentGame.team).length === 0
        ) {
          return;
        }

        set({ selectedPersonId: personId });
      },
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
      name: "till-series-b-v2",
      partialize: (state) => ({
        game: state.game,
        lastCompanyName: state.lastCompanyName,
        choices: state.choices,
        selectedPersonId: state.selectedPersonId,
        lastAssignment: state.lastAssignment,
      }),
    },
  ),
);
