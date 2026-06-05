export type Role = "ceo" | "cto" | "product" | "growth" | "operator";

export type SourceGroupType =
  | "company"
  | "scene"
  | "category"
  | "twitter"
  | "investor"
  | "crypto"
  | "ai";

export type PersonStats = {
  vision: number;
  engineering: number;
  product: number;
  growth: number;
  operations: number;
  fundraising: number;
  fame: number;
  chaos: number;
};

export type Person = {
  id: string;
  name: string;
  handle?: string;
  imageUrl?: string;
  knownFor: string;
  primaryRole: Role;
  secondaryRole?: Role;
  stats: PersonStats;
  tags: string[];
  sourceGroupIds: string[];
};

export type SourceGroup = {
  id: string;
  name: string;
  type: SourceGroupType;
  description?: string;
  peopleIds: string[];
};

export type GamePick = {
  round: number;
  groupId: string;
  selectedPersonId: string;
};

export type GameState = {
  id: string;
  round: number;
  maxRounds: number;
  currentGroupId: string;
  team: Partial<Record<Role, string>>;
  picks: GamePick[];
  usedGroupIds: string[];
};
