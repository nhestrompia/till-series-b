import { sourceGroups } from "@/data/groups";
import { people, peopleById } from "@/data/people";
import type { GamePick, GameState, Person, Role } from "@/data/types";
import { createId, sample, shuffle } from "@/lib/random";

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

function getNextGroupId(usedGroupIds: string[]) {
  const unused = sourceGroups.filter((group) => !usedGroupIds.includes(group.id));
  const pool = unused.length > 0 ? unused : sourceGroups;
  return shuffle(pool)[0]?.id ?? "tech-twitter";
}

export function createGame(maxRounds = 5): GameState {
  const currentGroupId = getNextGroupId([]);

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
  const available = groupPeople.filter((person) => !roundPickIds.has(person.id));
  const pool = available.length >= 3 ? available : groupPeople;
  return sample(pool, 3, 5);
}

function targetRolesForPick(person: Person) {
  const preferred = [person.primaryRole, person.secondaryRole].filter(Boolean) as Role[];
  const fallback = roles
    .filter((role) => !preferred.includes(role))
    .sort((a, b) => roleFitScore(person, b) - roleFitScore(person, a));

  return [...preferred, ...fallback];
}

export function assignPersonToTeam(team: Partial<Record<Role, string>>, person: Person) {
  const nextTeam = { ...team };
  const targetRoles = targetRolesForPick(person);

  for (const role of targetRoles) {
    if (!nextTeam[role]) {
      nextTeam[role] = person.id;
      return { team: nextTeam, assignedRole: role, replacedPersonId: undefined };
    }
  }

  const replacementRole = targetRoles
    .map((role) => {
      const incumbent = nextTeam[role] ? peopleById.get(nextTeam[role] as string) : undefined;
      const incumbentScore = incumbent ? roleFitScore(incumbent, role) : 0;
      const challengerScore = roleFitScore(person, role);

      return {
        role,
        incumbentId: incumbent?.id,
        incumbentScore,
        challengerScore,
        delta: challengerScore - incumbentScore,
      };
    })
    .sort((a, b) => b.delta - a.delta || a.incumbentScore - b.incumbentScore)[0];

  nextTeam[replacementRole.role] = person.id;

  return {
    team: nextTeam,
    assignedRole: replacementRole.role,
    replacedPersonId: replacementRole.incumbentId,
  };
}

export function pickPerson(state: GameState, selectedPersonId: string) {
  const person = peopleById.get(selectedPersonId);

  if (!person) {
    throw new Error(`Unknown person: ${selectedPersonId}`);
  }

  const assignment = assignPersonToTeam(state.team, person);
  const pick: GamePick = {
    round: state.round,
    groupId: state.currentGroupId,
    selectedPersonId,
  };

  const completed = state.round >= state.maxRounds;
  const nextUsedGroupIds = completed ? state.usedGroupIds : state.usedGroupIds;
  const nextGroupId = completed ? state.currentGroupId : getNextGroupId(nextUsedGroupIds);

  return {
    state: {
      ...state,
      round: completed ? state.round : state.round + 1,
      currentGroupId: nextGroupId,
      team: assignment.team,
      picks: [...state.picks, pick],
      usedGroupIds: completed ? state.usedGroupIds : [...state.usedGroupIds, nextGroupId],
    },
    assignment,
    completed,
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
