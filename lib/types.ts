// Mirrors core/schemas.py's PredictionsResponse. Keep these in sync by
// hand for now — small enough surface that a codegen step isn't justified
// yet (see docs/adr/0005 for the general "don't add complexity early" bar).

export interface GatedDriverScore {
  driver_id: string;
  driver: string;
  team: string;
  win_score: number;
  eligible: boolean;
  rank: number | null;
  driver_finish_5: number | null;
}

export interface PredictionsResponse {
  race: string;
  race_date: string;
  data_through: string;
  generated_at: string;
  model_pick: string;
  drivers: GatedDriverScore[];
}

export interface ScenarioResponse {
  driver_id: string;
  driver: string;
  team: string;
  original_win_score: number;
  original_rank: number | null;
  scenario_win_score: number;
  scenario_rank: number | null;
  score_change: number;
}
