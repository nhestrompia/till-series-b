"use client";

import { track } from "@vercel/analytics";

type AnalyticsEvent =
  | "game_started"
  | "round_completed"
  | "game_completed"
  | "replay_clicked"
  | "share_clicked"
  | "person_picked"
  | "outcome_generated";

export function trackGameEvent(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>) {
  track(event, properties);
}
