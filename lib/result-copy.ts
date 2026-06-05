import type { StartupResult } from "@/lib/scoring";

export const SHARE_URL = "https://till-series-b.vercel.app";

export function resultHeadline(
  result: StartupResult,
  companyName = "Your startup",
) {
  if (result.tier === "shutdown")
    return `${companyName} became a startup-shaped calendar invite.`;
  if (result.tier === "seed")
    return `${companyName} is a ${result.valuation} seed-stage content machine.`;
  if (result.tier === "series-a")
    return `${companyName} is a ${result.valuation} Series A company.`;
  if (result.tier === "unicorn")
    return `${companyName} is a ${result.valuation} unicorn.`;
  if (result.tier === "decacorn")
    return `${companyName} is a ${result.valuation} decacorn.`;
  if (result.tier === "ipo")
    return `${companyName} reached ${result.valuation}.`;
  return `${companyName} became a ${result.valuation} monster.`;
}

export function shareText(result: StartupResult, companyName: string) {
  return `I built ${companyName}, a ${result.valuation} startup with a TSB score of ${result.score}.

Can you pass this?
${SHARE_URL}`;
}
