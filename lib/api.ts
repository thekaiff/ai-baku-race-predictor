// Client-side data access for the dashboard. Per FR-6: callers are
// responsible for keeping the last successful result visible on failure —
// this function just throws on non-2xx/network errors, it doesn't retry
// or cache (that's the API's job per ADR-0003).

import type { PredictionsResponse, ScenarioResponse } from "./types";

export async function fetchPredictions(): Promise<PredictionsResponse> {
  const res = await fetch("/api/v1/predictions", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Predictions request failed (${res.status})`);
  }
  return (await res.json()) as PredictionsResponse;
}

export async function runScenario(
  driverId: string,
  assumedRecentFinish: number
): Promise<ScenarioResponse> {
  const res = await fetch("/api/v1/scenario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      driver_id: driverId,
      assumed_recent_finish: assumedRecentFinish,
    }),
  });
  if (!res.ok) {
    throw new Error(`Scenario request failed (${res.status})`);
  }
  return (await res.json()) as ScenarioResponse;
}
