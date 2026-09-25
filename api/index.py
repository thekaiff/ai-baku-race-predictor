"""
Vercel Python entrypoint (auto-detected: exports top-level `app`).
Wiring only — no business logic here. Scoring lives in core/scorer.py,
eligibility in core/gate.py.
"""

from __future__ import annotations

from functools import lru_cache

from fastapi import FastAPI, HTTPException

from core.config import get_settings
from core.gate import apply_gate
from core.schemas import PredictionsResponse, ScenarioRequest, ScenarioResponse
from core.scorer import score_field, score_field_with_override
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="ai-baku-race-predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-baku-race-predictor.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@lru_cache(maxsize=1)
def _cached_predictions() -> PredictionsResponse:
    """Computed once per warm instance (ADR-0003), lazily on first
    request rather than at import time — a bad artifact fails the
    request instead of crashing the whole process at cold start."""
    settings = get_settings()
    metadata, raw_scores = score_field(str(settings.model_artifact_path))
    gated = apply_gate(raw_scores, settings.min_history_count)


    top = next((d for d in gated if d.rank == 1), None)
    model_pick = top.driver if top is not None else metadata["model_pick"]

    return PredictionsResponse(
        race=metadata["race"],
        race_date=metadata["race_date"],
        data_through=metadata["data_through"],
        generated_at=metadata["generated_at"],
        model_pick=model_pick,
        drivers=gated,
    )


@app.get("/api/healthz")
def healthz() -> dict:
    try:
        get_settings()
        return {"status": "ok", "model_loaded": True}
    except Exception:
        return {"status": "degraded", "model_loaded": False}


@app.get("/api/v1/predictions", response_model=PredictionsResponse)
def get_predictions() -> PredictionsResponse:
    return _cached_predictions()


@app.post("/api/v1/scenario", response_model=ScenarioResponse)
def run_scenario(body: ScenarioRequest) -> ScenarioResponse:
    """Scenario Lab (ADR-0006). Re-scores the full field with one
    driver's driver_finish_5 overridden, all other drivers unchanged.
    original_* comes from the same cached baseline /api/v1/predictions
    serves, so the two are always directly comparable."""
    settings = get_settings()
    original = _cached_predictions()
    original_driver = next(
        (d for d in original.drivers if d.driver_id == body.driver_id), None
    )
    if original_driver is None:
        raise HTTPException(status_code=404, detail="unknown driver_id")

    raw_scores = score_field_with_override(
        str(settings.model_artifact_path),
        body.driver_id,
        "driver_finish_5",
        body.assumed_recent_finish,
    )
    gated = apply_gate(raw_scores, settings.min_history_count)
    scenario_driver = next(d for d in gated if d.driver_id == body.driver_id)

    return ScenarioResponse(
        driver_id=original_driver.driver_id,
        driver=original_driver.driver,
        team=original_driver.team,
        original_win_score=original_driver.win_score,
        original_rank=original_driver.rank,
        scenario_win_score=scenario_driver.win_score,
        scenario_rank=scenario_driver.rank,
        score_change=scenario_driver.win_score - original_driver.win_score,
    )
