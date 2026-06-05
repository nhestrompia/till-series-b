import { people } from "@/data/people";
import type { SourceGroup, SourceGroupType } from "@/data/types";

const definitions: Array<Omit<SourceGroup, "peopleIds">> = [
  {
    id: "openai",
    name: "OpenAI",
    type: "company",
    category: "AI",
    description: "Frontier model drama with demo-day upside.",
  },
  {
    id: "stripe",
    name: "Stripe",
    type: "company",
    category: "Fintech",
    description: "API taste, payments, and terrifying polish.",
  },
  {
    id: "airbnb",
    name: "Airbnb",
    type: "company",
    category: "Marketplace",
    description: "Design founders who made air mattresses institutional.",
  },
  {
    id: "figma",
    name: "Figma",
    type: "company",
    category: "Design",
    description: "Multiplayer design taste and browser-native craft.",
  },
  {
    id: "vercel",
    name: "Vercel",
    type: "company",
    category: "Infra",
    description: "Frontend infra with launch-week dopamine.",
  },
  {
    id: "nvidia",
    name: "Nvidia",
    type: "company",
    category: "AI",
    description: "GPU empire, AI wave, leather jacket optional.",
  },
  {
    id: "meta",
    name: "Meta",
    type: "company",
    category: "Social",
    description: "Distribution, ads, social graphs, and public pivots.",
  },
  {
    id: "apple",
    name: "Apple",
    type: "company",
    category: "Consumer",
    description: "Taste, hardware, and supply-chain violence.",
  },
  {
    id: "google",
    name: "Google",
    type: "company",
    category: "AI",
    description: "Search, AI labs, and products with launch committees.",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    type: "company",
    category: "Enterprise",
    description: "Cloud, enterprise, and patient platform power.",
  },
  {
    id: "shopify",
    name: "Shopify",
    type: "company",
    category: "Commerce",
    description: "Commerce infrastructure and founder-mode arguments.",
  },
  {
    id: "coinbase",
    name: "Coinbase",
    type: "company",
    category: "Crypto",
    description: "Crypto, compliance, and exchange-scale operations.",
  },
  {
    id: "tesla",
    name: "Tesla",
    type: "company",
    category: "Hard Tech",
    description: "Hardware speed, product spectacle, and chaos debt.",
  },
  {
    id: "spacex",
    name: "SpaceX",
    type: "company",
    category: "Hard Tech",
    description: "Rockets, operations, and improbable execution.",
  },
  {
    id: "netflix",
    name: "Netflix",
    type: "company",
    category: "Entertainment",
    description: "Streaming, growth, and culture-deck lore.",
  },
  {
    id: "amazon",
    name: "Amazon",
    type: "company",
    category: "Commerce",
    description: "Commerce, cloud, logistics, and operating-system scale.",
  },
  {
    id: "oracle",
    name: "Oracle",
    type: "company",
    category: "Enterprise",
    description: "Databases, enterprise sales, and legendary competitive energy.",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    type: "company",
    category: "Enterprise",
    description: "SaaS, enterprise GTM, and conference-keynote gravity.",
  },
  {
    id: "adobe",
    name: "Adobe",
    type: "company",
    category: "Design",
    description: "Creative tools, document rails, and subscription transformation.",
  },
  {
    id: "uber",
    name: "Uber",
    type: "company",
    category: "Marketplace",
    description: "Marketplace growth, logistics, and regulatory boss fights.",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    type: "company",
    category: "Social",
    description: "Professional networks, enterprise distribution, and feed mechanics.",
  },
  {
    id: "indie-hackers",
    name: "Indie Hackers",
    type: "scene",
    category: "Indie",
    description: "Ships fast, raises little, posts revenue screenshots.",
  },
  {
    id: "tech-twitter",
    name: "Tech Twitter",
    type: "twitter",
    category: "Social",
    description: "Takes, threads, and launch-day reply guys.",
  },
  {
    id: "crypto-twitter",
    name: "Crypto Twitter",
    type: "crypto",
    category: "Crypto",
    description: "Protocol genius and liquidation-grade volatility.",
  },
  {
    id: "ai-researchers",
    name: "AI Researchers",
    type: "ai",
    category: "AI",
    description:
      "Research taste, scaling laws, and existential calendar invites.",
  },
  {
    id: "yc",
    name: "YC",
    type: "investor",
    category: "Investor",
    description: "Fundraising speedrun with demo-day muscle memory.",
  },
  {
    id: "design-legends",
    name: "Design Legends",
    type: "category",
    category: "Design",
    description: "Taste, craft, and refusal to ship ugly onboarding.",
  },
  {
    id: "growth-people",
    name: "Growth People",
    type: "category",
    category: "Growth",
    description: "Distribution wizards who can make a waitlist reproduce.",
  },
  {
    id: "infra-nerds",
    name: "Infra Nerds",
    type: "category",
    category: "Infra",
    description: "Rewrites the backend, but sometimes for good reasons.",
  },
  {
    id: "founder-mode",
    name: "Founder Mode",
    type: "scene",
    category: "Founder",
    description: "High agency, high conviction, high calendar risk.",
  },
  {
    id: "product-taste",
    name: "Product Taste",
    type: "category",
    category: "Product",
    description: "Knows which pixel is ruining the company.",
  },
  {
    id: "vc-personalities",
    name: "VC Personalities",
    type: "investor",
    category: "Investor",
    description: "Capital, podcasts, and market maps with strong opinions.",
  },
  {
    id: "operator-business",
    name: "Operators",
    type: "category",
    category: "Operator",
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

export function getGroupCategory(id: string) {
  return sourceGroupsById.get(id)?.category;
}
