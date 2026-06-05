import { people } from "@/data/people";
import type { SourceGroup, SourceGroupType } from "@/data/types";

const definitions: Array<Omit<SourceGroup, "peopleIds">> = [
  {
    id: "openai",
    name: "OpenAI",
    type: "company",
    description: "Frontier model drama with demo-day upside.",
  },
  {
    id: "stripe",
    name: "Stripe",
    type: "company",
    description: "API taste, payments, and terrifying polish.",
  },
  {
    id: "airbnb",
    name: "Airbnb",
    type: "company",
    description: "Design founders who made air mattresses institutional.",
  },
  {
    id: "figma",
    name: "Figma",
    type: "company",
    description: "Multiplayer design taste and browser-native craft.",
  },
  {
    id: "vercel",
    name: "Vercel",
    type: "company",
    description: "Frontend infra with launch-week dopamine.",
  },
  {
    id: "nvidia",
    name: "Nvidia",
    type: "company",
    description: "GPU empire, AI wave, leather jacket optional.",
  },
  {
    id: "meta",
    name: "Meta",
    type: "company",
    description: "Distribution, ads, social graphs, and public pivots.",
  },
  {
    id: "apple",
    name: "Apple",
    type: "company",
    description: "Taste, hardware, and supply-chain violence.",
  },
  {
    id: "google",
    name: "Google",
    type: "company",
    description: "Search, AI labs, and products with launch committees.",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    type: "company",
    description: "Cloud, enterprise, and patient platform power.",
  },
  {
    id: "shopify",
    name: "Shopify",
    type: "company",
    description: "Commerce infrastructure and founder-mode arguments.",
  },
  {
    id: "coinbase",
    name: "Coinbase",
    type: "company",
    description: "Crypto, compliance, and exchange-scale operations.",
  },
  {
    id: "tesla",
    name: "Tesla",
    type: "company",
    description: "Hardware speed, product spectacle, and chaos debt.",
  },
  {
    id: "spacex",
    name: "SpaceX",
    type: "company",
    description: "Rockets, operations, and improbable execution.",
  },
  {
    id: "netflix",
    name: "Netflix",
    type: "company",
    description: "Streaming, growth, and culture-deck lore.",
  },
  {
    id: "indie-hackers",
    name: "Indie Hackers",
    type: "scene",
    description: "Ships fast, raises little, posts revenue screenshots.",
  },
  {
    id: "tech-twitter",
    name: "Tech Twitter",
    type: "twitter",
    description: "Takes, threads, and launch-day reply guys.",
  },
  {
    id: "crypto-twitter",
    name: "Crypto Twitter",
    type: "crypto",
    description: "Protocol genius and liquidation-grade volatility.",
  },
  {
    id: "ai-researchers",
    name: "AI Researchers",
    type: "ai",
    description:
      "Research taste, scaling laws, and existential calendar invites.",
  },
  {
    id: "yc",
    name: "YC",
    type: "investor",
    description: "Fundraising speedrun with demo-day muscle memory.",
  },
  {
    id: "design-legends",
    name: "Design Legends",
    type: "category",
    description: "Taste, craft, and refusal to ship ugly onboarding.",
  },
  {
    id: "growth-people",
    name: "Growth People",
    type: "category",
    description: "Distribution wizards who can make a waitlist reproduce.",
  },
  {
    id: "infra-nerds",
    name: "Infra Nerds",
    type: "category",
    description: "Rewrites the backend, but sometimes for good reasons.",
  },
  {
    id: "founder-mode",
    name: "Founder Mode",
    type: "scene",
    description: "High agency, high conviction, high calendar risk.",
  },
  {
    id: "product-taste",
    name: "Product Taste",
    type: "category",
    description: "Knows which pixel is ruining the company.",
  },
  {
    id: "vc-personalities",
    name: "VC Personalities",
    type: "investor",
    description: "Capital, podcasts, and market maps with strong opinions.",
  },
  {
    id: "operator-business",
    name: "Operators",
    type: "category",
    description: "Actually answers customer emails and renews the SOC 2.",
  },
];

export const sourceGroups: SourceGroup[] = definitions
  .map((definition) => ({
    ...definition,
    peopleIds: people
      .filter((person) => person.sourceGroupIds.includes(definition.id))
      .map((person) => person.id),
  }))
  .filter((group) => group.peopleIds.length >= 3);

export const sourceGroupsById = new Map(
  sourceGroups.map((group) => [group.id, group]),
);

export function getGroupType(id: string): SourceGroupType | undefined {
  return sourceGroupsById.get(id)?.type;
}
