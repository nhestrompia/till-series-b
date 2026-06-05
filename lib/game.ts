import { sourceGroups } from "@/data/groups";
import { people, peopleById } from "@/data/people";
import type { GamePick, GameState, Person, Role } from "@/data/types";
import { createId, shuffle } from "@/lib/random";

export const roles: Role[] = ["ceo", "cto", "product", "growth", "operator"];

export const roleLabels: Record<Role, string> = {
  ceo: "CEO / Vision",
  cto: "CTO / Engineering",
  product: "Product",
  growth: "Growth / Distribution",
  operator: "Operator / Business",
};

export const roleShortLabels: Record<Role, string> = {
  ceo: "CEO",
  cto: "CTO",
  product: "Product",
  growth: "Growth",
  operator: "Operator",
};

export function roleFitScore(person: Person, role: Role) {
  const { stats } = person;

  const scores: Record<Role, number> = {
    ceo: stats.vision * 0.35 + stats.fundraising * 0.3 + stats.operations * 0.2 + stats.fame * 0.15,
    cto: stats.engineering * 0.5 + stats.product * 0.25 + stats.vision * 0.25,
    product: stats.product * 0.45 + stats.vision * 0.3 + stats.growth * 0.25,
    growth: stats.growth * 0.5 + stats.fame * 0.25 + stats.product * 0.25,
    operator: stats.operations * 0.45 + stats.fundraising * 0.3 + stats.growth * 0.25,
  };

  const roleBonus = person.primaryRole === role ? 10 : person.secondaryRole === role ? 5 : 0;
  return Math.round(scores[role] + roleBonus);
}

function personCanFillRole(person: Person, role: Role) {
  return person.primaryRole === role || person.secondaryRole === role;
}

export function getOpenRoles(team: Partial<Record<Role, string>>) {
  return roles.filter((role) => !team[role]);
}

export function getCompatibleRoles(person: Person, team: Partial<Record<Role, string>>) {
  return getOpenRoles(team).filter((role) => personCanFillRole(person, role));
}

export function groupCanFillOpenRole(groupId: string, team: Partial<Record<Role, string>>, pickedIds: string[] = []) {
  const picked = new Set(pickedIds);
  const group = sourceGroups.find((item) => item.id === groupId);
  if (!group) return false;

  return group.peopleIds.some((personId) => {
    const person = peopleById.get(personId);
    return person && !picked.has(person.id) && getCompatibleRoles(person, team).length > 0;
  });
}

function getNextGroupId(usedGroupIds: string[], team: Partial<Record<Role, string>>, pickedIds: string[] = []) {
  const compatibleGroups = sourceGroups.filter((group) => groupCanFillOpenRole(group.id, team, pickedIds));
  const unused = compatibleGroups.filter((group) => !usedGroupIds.includes(group.id));
  const pool = unused.length > 0 ? unused : compatibleGroups.length > 0 ? compatibleGroups : sourceGroups;
  return shuffle(pool)[0]?.id ?? "tech-twitter";
}

export function createGame(maxRounds = 5): GameState {
  const currentGroupId = getNextGroupId([], {});

  return {
    id: createId(),
    round: 1,
    maxRounds,
    currentGroupId,
    team: {},
    picks: [],
    usedGroupIds: [currentGroupId],
  };
}

export function getCurrentGroup(state: GameState) {
  return sourceGroups.find((group) => group.id === state.currentGroupId) ?? sourceGroups[0];
}

export function getRoundChoices(state: GameState) {
  const group = getCurrentGroup(state);
  const groupPeople = group.peopleIds.map((id) => peopleById.get(id)).filter(Boolean) as Person[];
  const roundPickIds = new Set(state.picks.map((pick) => pick.selectedPersonId));
  const available = groupPeople.filter((person) => !roundPickIds.has(person.id) && getCompatibleRoles(person, state.team).length > 0);
  return shuffle(available);
}

export function assignPersonToTeam(team: Partial<Record<Role, string>>, person: Person, role: Role) {
  const nextTeam = { ...team };

  if (nextTeam[role]) {
    throw new Error(`${role} is already filled`);
  }

  if (!personCanFillRole(person, role)) {
    throw new Error(`${person.name} cannot fill ${role}`);
  }

  nextTeam[role] = person.id;
  return { team: nextTeam, assignedRole: role };
}

export function placePerson(state: GameState, selectedPersonId: string, role: Role) {
  const person = peopleById.get(selectedPersonId);

  if (!person) {
    throw new Error(`Unknown person: ${selectedPersonId}`);
  }

  const assignment = assignPersonToTeam(state.team, person, role);
  const pick: GamePick = {
    round: state.round,
    groupId: state.currentGroupId,
    selectedPersonId,
    assignedRole: role,
  };

  const completed = state.round >= state.maxRounds;
  const nextTeam = assignment.team;
  const nextPickedIds = [...state.picks, pick].map((item) => item.selectedPersonId);
  const nextGroupId = completed ? state.currentGroupId : getNextGroupId(state.usedGroupIds, nextTeam, nextPickedIds);

  return {
    state: {
      ...state,
      round: completed ? state.round : state.round + 1,
      currentGroupId: nextGroupId,
      team: nextTeam,
      picks: [...state.picks, pick],
      usedGroupIds: completed ? state.usedGroupIds : [...state.usedGroupIds, nextGroupId],
    },
    assignment,
    completed,
  };
}

export function spinGroup(state: GameState) {
  const pickedIds = state.picks.map((pick) => pick.selectedPersonId);
  const nextGroupId = getNextGroupId([...state.usedGroupIds, state.currentGroupId], state.team, pickedIds);

  return {
    ...state,
    currentGroupId: nextGroupId,
    usedGroupIds: [...state.usedGroupIds, nextGroupId],
  };
}

export function getTeamPeople(team: Partial<Record<Role, string>>) {
  return roles.map((role) => ({
    role,
    person: team[role] ? peopleById.get(team[role] as string) : undefined,
  }));
}

export function getPickedPeople(picks: GamePick[]) {
  return picks.map((pick) => peopleById.get(pick.selectedPersonId)).filter(Boolean) as Person[];
}

export function getRosterSize() {
  return people.length;
}
