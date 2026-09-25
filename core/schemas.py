"""
Pydantic models, split into two layers on purpose:

- RawDriverScore: internal only. Carries everything core/gate.py needs to
  decide eligibility (driver_history_count, whether every feature was
  null). Never returned directly by the API.
- GatedDriverScore / PredictionsResponse: the enforced boundary of what the
  API can ever return (FR-7). Accuracy, backtest, and verification data
  simply have no field to travel through here — they can't leak by
  omission elsewhere, because response_model= in api/index.py strips
  anything not declared on these models.
- ScenarioRequest / ScenarioResponse: Scenario Lab (added per user
  request, originally out of scope for Phase 1 — see ADR-0006). Reuses
  the same scorer and gate; original-vs-scenario score comparison is
  explicitly allowed by FR-7, unlike accuracy/backtest data.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class RawDriverScore(BaseModel):
    driver_id: str
    driver: str
    team: str
    raw_score: float
    driver_history_count: float | None
    driver_finish_5: float | None
    all_features_null: bool


class GatedDriverScore(BaseModel):
    driver_id: str
    driver: str
    team: str
    win_score: float
    eligible: bool
    rank: int | None  # null when not eligible
    driver_finish_5: float | None  # actual recent avg finish — Scenario Lab's slider start


class PredictionsResponse(BaseModel):
    model_config = {"protected_namespaces": ()}  # allow the model_pick field name

    race: str
    race_date: str
    data_through: str
    generated_at: str
    model_pick: str
    drivers: list[GatedDriverScore]


class ScenarioRequest(BaseModel):
    driver_id: str
    assumed_recent_finish: float = Field(ge=1, le=22)


class ScenarioResponse(BaseModel):
    driver_id: str
    driver: str
    team: str
    original_win_score: float
    original_rank: int | None
    scenario_win_score: float
    scenario_rank: int | None
    score_change: float  # scenario - original, in win_score units (not %)
