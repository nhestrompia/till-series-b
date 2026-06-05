import type { StartupResult } from "@/lib/scoring";

type InsightVariant = {
  title: string;
  detail: (result: StartupResult) => string;
};

type StrengthAxis =
  | "engineering"
  | "product"
  | "growth"
  | "fundraising"
  | "operations"
  | "fame";

type WeaknessAxis = StrengthAxis | "chaos";

const strengthVariants: Record<StrengthAxis, InsightVariant[]> = {
  engineering: [
    { title: "Shipping velocity", detail: ({ bestPick }) => `${bestPick.name} turned ambitious roadmaps into releases before the market could catch up.` },
    { title: "Technical firepower", detail: ({ bestPick }) => `With ${bestPick.name} in the room, the hard engineering problems started looking suspiciously manageable.` },
    { title: "Builder density", detail: ({ bestPick }) => `${bestPick.name} gave the team enough technical range to prototype, rebuild, and still ship on time.` },
    { title: "Execution engine", detail: ({ bestPick }) => `${bestPick.name} kept the product moving while everyone else was still debating the architecture.` },
  ],
  product: [
    { title: "Product instinct", detail: ({ bestPick }) => `${bestPick.name} made the roadmap feel edited instead of accumulated.` },
    { title: "Taste advantage", detail: ({ bestPick }) => `${bestPick.name} helped the team spot the version users would actually want before building the other six.` },
    { title: "User obsession", detail: ({ bestPick }) => `${bestPick.name} kept customer pain louder than internal opinions.` },
    { title: "Roadmap discipline", detail: ({ bestPick }) => `${bestPick.name} turned a pile of good ideas into one product people could understand.` },
  ],
  growth: [
    { title: "Distribution machine", detail: ({ bestPick }) => `${bestPick.name} found the audience before the launch post finished rendering.` },
    { title: "Growth reflexes", detail: ({ bestPick }) => `${bestPick.name} gave every release a credible path to users, not just applause.` },
    { title: "Market pull", detail: ({ bestPick }) => `${bestPick.name} made adoption look organic even when the playbook was ruthlessly engineered.` },
    { title: "Audience gravity", detail: ({ bestPick }) => `${bestPick.name} brought enough reach to make early traction compound fast.` },
  ],
  fundraising: [
    { title: "Fundraising aura", detail: ({ bestPick }) => `${bestPick.name} could turn a rough demo and three charts into a competitive round.` },
    { title: "Capital magnetism", detail: ({ bestPick }) => `${bestPick.name} made the next raise feel less like a process and more like an allocation problem.` },
    { title: "Investor narrative", detail: ({ bestPick }) => `${bestPick.name} connected the product, timing, and market into a story investors could repeat.` },
    { title: "Boardroom confidence", detail: ({ bestPick }) => `${bestPick.name} gave the company enough credibility to fund the next several mistakes.` },
  ],
  operations: [
    { title: "Operational control", detail: ({ bestPick }) => `${bestPick.name} kept launches, hiring, and priorities moving in the same direction.` },
    { title: "Adult supervision", detail: ({ bestPick }) => `${bestPick.name} added just enough process to stop momentum from becoming collateral damage.` },
    { title: "Scale discipline", detail: ({ bestPick }) => `${bestPick.name} made the company look organized before it had any right to be.` },
    { title: "Company cadence", detail: ({ bestPick }) => `${bestPick.name} turned founder urgency into a rhythm the whole team could sustain.` },
  ],
  fame: [
    { title: "Narrative momentum", detail: ({ bestPick }) => `${bestPick.name} gave the company instant relevance and a launch people felt obligated to discuss.` },
    { title: "Attention advantage", detail: ({ bestPick }) => `${bestPick.name} ensured the market heard the story before competitors wrote their response.` },
    { title: "Category presence", detail: ({ bestPick }) => `${bestPick.name} made the company feel like a category leader unusually early.` },
    { title: "Brand velocity", detail: ({ bestPick }) => `${bestPick.name} turned every milestone into a reason for the market to pay attention again.` },
  ],
};

const weaknessVariants: Record<WeaknessAxis, InsightVariant[]> = {
  chaos: [
    { title: "Coordination debt", detail: () => "Every urgent decision created two more meetings and at least one private group chat." },
    { title: "Leadership turbulence", detail: () => "The company moved fast, but nobody could agree whether it was momentum or an evacuation." },
    { title: "Deadlines are optional", detail: () => "Launch plans survived right up until the team started improving them." },
    { title: "Too many plot twists", detail: () => "The strategy changed often enough that the roadmap needed version control." },
  ],
  engineering: [
    { title: "Technical bottleneck", detail: () => "The vision outran the team’s ability to turn it into reliable software." },
    { title: "Architecture risk", detail: () => "The demo worked beautifully, provided nobody touched it twice." },
    { title: "Engineering coverage", detail: () => "Critical systems had owners, but several of those owners were also imaginary." },
    { title: "Build capacity", detail: () => "The roadmap expected a platform team that had not been hired yet." },
  ],
  product: [
    { title: "Product ambiguity", detail: () => "The team could explain the market in detail, then became strangely vague about the product." },
    { title: "Roadmap sprawl", detail: () => "Every stakeholder got their favorite feature, including stakeholders who did not exist." },
    { title: "Taste gap", detail: () => "The product solved the problem, but not in a way users wanted to look at twice." },
    { title: "User-value drift", detail: () => "Internal excitement kept winning arguments against actual customer behavior." },
  ],
  growth: [
    { title: "Distribution gap", detail: () => "The product worked, but discovery depended heavily on someone already knowing the founders." },
    { title: "Quiet launch risk", detail: () => "The launch was polished, thoughtful, and largely witnessed by the team itself." },
    { title: "Acquisition drag", detail: () => "Users liked the product once they arrived; the difficult part was arranging their arrival." },
    { title: "Market invisibility", detail: () => "The company built a strong product in the strategic location known as under the radar." },
  ],
  fundraising: [
    { title: "Capital friction", detail: () => "The pitch had conviction, but the numbers kept asking for a second meeting." },
    { title: "Investor translation", detail: () => "The team understood the opportunity better than it could explain why the round should close now." },
    { title: "Runway pressure", detail: () => "The plan was credible as long as revenue arrived slightly before physics allowed." },
    { title: "Narrative financing", detail: () => "The company needed a sharper story before the next spreadsheet became a negotiation." },
  ],
  operations: [
    { title: "Operational drag", detail: () => "Launch week became a calendar-shaped crime scene." },
    { title: "Scaling strain", detail: () => "The company added complexity faster than it added people who enjoy managing complexity." },
    { title: "Process vacuum", detail: () => "Important work moved quickly until it crossed a team boundary." },
    { title: "Execution overhead", detail: () => "The team had plenty of urgency and no shared definition of done." },
  ],
  fame: [
    { title: "Attention deficit", detail: () => "The company had substance, but the market was not yet aware it should care." },
    { title: "Category obscurity", detail: () => "The product needed a clearer flag to plant before louder competitors claimed the territory." },
    { title: "Brand underreach", detail: () => "Strong work kept landing with the impact of a well-written private memo." },
    { title: "Narrative silence", detail: () => "The team shipped progress faster than it converted progress into market belief." },
  ],
};

export const RESULT_INSIGHT_VARIANT_COUNTS = {
  strength: Object.values(strengthVariants).flat().length,
  weakness: Object.values(weaknessVariants).flat().length,
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function resultSeed(result: StartupResult) {
  return result.team
    .map(({ role, person }) => `${role}:${person?.id ?? "vacant"}`)
    .join("|");
}

function teamAverages(result: StartupResult) {
  const people = result.team.flatMap(({ person }) => (person ? [person] : []));
  const axes: StrengthAxis[] = [
    "engineering",
    "product",
    "growth",
    "fundraising",
    "operations",
    "fame",
  ];

  return Object.fromEntries(
    axes.map((axis) => [
      axis,
      average(people.map((person) => person.stats[axis])),
    ]),
  ) as Record<StrengthAxis, number>;
}

function strongestAxis(averages: Record<StrengthAxis, number>) {
  return (Object.entries(averages) as Array<[StrengthAxis, number]>).sort(
    (a, b) => b[1] - a[1],
  )[0][0];
}

function strongestPersonForAxis(
  result: StartupResult,
  axis: StrengthAxis,
) {
  return result.team
    .flatMap(({ person }) => (person ? [person] : []))
    .sort((a, b) => b.stats[axis] - a.stats[axis])[0];
}

function weakestAxis(
  result: StartupResult,
  averages: Record<StrengthAxis, number>,
): WeaknessAxis {
  const people = result.team.flatMap(({ person }) => (person ? [person] : []));
  const chaos = average(people.map((person) => person.stats.chaos));
  if (chaos >= 65) return "chaos";

  return (Object.entries(averages) as Array<[StrengthAxis, number]>).sort(
    (a, b) => a[1] - b[1],
  )[0][0];
}

function selectVariant(
  variants: InsightVariant[],
  seed: string,
  result: StartupResult,
) {
  const variant = variants[hashString(seed) % variants.length];
  return {
    title: variant.title,
    detail: variant.detail(result),
  };
}

export function getResultInsights(result: StartupResult) {
  const averages = teamAverages(result);
  const seed = resultSeed(result);
  const strengthAxis = strongestAxis(averages);
  const weaknessAxis = weakestAxis(result, averages);
  const strengthPerson = strongestPersonForAxis(result, strengthAxis);
  const strengthResult = strengthPerson
    ? { ...result, bestPick: strengthPerson }
    : result;

  return {
    strength: selectVariant(
      strengthVariants[strengthAxis],
      `${seed}:strength`,
      strengthResult,
    ),
    weakness: selectVariant(
      weaknessVariants[weaknessAxis],
      `${seed}:weakness`,
      result,
    ),
  };
}
