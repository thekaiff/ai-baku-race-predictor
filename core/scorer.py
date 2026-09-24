

from __future__ import annotations

import json
import math
import tempfile
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

import numpy as np
import xgboost as xgb

from core.schemas import RawDriverScore


@dataclass(frozen=True)
class ScoringResult:
    raw_scores: list[float]
    win_scores: list[float]


@lru_cache(maxsize=1)
def _load_kit(model_artifact_path: str) -> dict:
    """The full dashboard data artifact: model, metadata, inputs,
    verification. Cached at module scope per ADR-0003 — read from disk
    once per process."""
    with open(model_artifact_path) as f:
        return json.load(f)


@lru_cache(maxsize=1)
def _load_booster(model_artifact_path: str) -> tuple[xgb.Booster, tuple[str, ...]]:
    """Load the XGBoost JSON booster embedded in the artifact's "model"
    key. Returns the booster plus the feature order it expects — read
    from the artifact itself, never hardcoded, so scorer and model can
    never silently drift out of order."""
    kit = _load_kit(model_artifact_path)
    model_dict = kit["model"]
    feature_names = tuple(model_dict["learner"]["feature_names"])

    booster = xgb.Booster()
    # xgboost's JSON loader keys off the .json file extension; write the
    # embedded model dict to a temp file rather than guessing at an
    # in-memory-buffer API that may not exist for every xgboost version.
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".json", delete=False
    ) as tmp:
        json.dump(model_dict, tmp)
        tmp_path = tmp.name
    try:
        booster.load_model(tmp_path)
    finally:
        Path(tmp_path).unlink(missing_ok=True)

    return booster, feature_names


def _rows_to_matrix(
    inputs: list[dict], feature_names: tuple[str, ...]
) -> np.ndarray:
    """Build a float32 matrix in the booster's expected feature order.
    Missing/null values (None, absent key, NaN) become np.nan — XGBoost's
    native missing-value handling takes it from there, unchanged from
    training (this is exactly the behavior ADR-0001's gate compensates
    for downstream, not something this function should paper over)."""
    matrix = np.empty((len(inputs), len(feature_names)), dtype=np.float32)
    for row_idx, row in enumerate(inputs):
        for col_idx, feature in enumerate(feature_names):
            value = row.get(feature)
            matrix[row_idx, col_idx] = np.nan if value is None else float(value)
    return matrix


def score_inputs(inputs: list[dict], model_artifact_path: str) -> ScoringResult:
    """Score an arbitrary list of driver input rows. Each row must be a
    dict containing at least the booster's feature keys (extra keys, e.g.
    driver/team/driverId, are ignored here). This is the function
    tests/unit/test_scorer.py checks against the notebook's verification
    cases — it must reproduce their raw_scores and win_scores exactly."""
    booster, feature_names = _load_booster(model_artifact_path)
    matrix = _rows_to_matrix(inputs, feature_names)

    dmatrix = xgb.DMatrix(matrix, feature_names=list(feature_names), missing=np.nan)
    # objective is binary:logistic (see docs/architecture.md) — Booster.predict
    # returns P(class=1) directly, matching the notebook's
    # model.predict_proba(...)[:, 1].
    raw_scores = booster.predict(dmatrix)

    total = float(raw_scores.sum())
    win_scores = [
        (float(s) / total if total > 0 else 0.0) for s in raw_scores
    ]

    return ScoringResult(raw_scores=[float(s) for s in raw_scores], win_scores=win_scores)


def _numeric_or_none(value) -> float | None:
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return None
    return float(value)


def _rows_to_raw_scores(
    inputs: list[dict], feature_names: tuple[str, ...], model_artifact_path: str
) -> list[RawDriverScore]:
    """Shared by score_field and score_field_with_override — scores a
    field of input rows and packages each into a RawDriverScore."""
    result = score_inputs(inputs, model_artifact_path)

    scores: list[RawDriverScore] = []
    for row, raw_score in zip(inputs, result.raw_scores):
        feature_values = [row.get(f) for f in feature_names]
        all_null = all(v is None for v in feature_values)
        scores.append(
            RawDriverScore(
                driver_id=row["driverId"],
                driver=row["driver"],
                team=row["team"],
                raw_score=raw_score,
                driver_history_count=_numeric_or_none(row.get("driver_history_count")),
                driver_finish_5=_numeric_or_none(row.get("driver_finish_5")),
                all_features_null=all_null,
            )
        )
    return scores


def score_field(model_artifact_path: str) -> tuple[dict, list[RawDriverScore]]:
    """Score the artifact's current field (kit["inputs"]) and return the
    kit's metadata alongside per-driver RawDriverScore objects, in the
    same order as the artifact's inputs array. core/gate.py consumes this
    output; nothing here decides eligibility or ranking."""
    kit = _load_kit(model_artifact_path)
    inputs = kit["inputs"]
    _, feature_names = _load_booster(model_artifact_path)

    scores = _rows_to_raw_scores(inputs, feature_names, model_artifact_path)
    return kit["metadata"], scores


def score_field_with_override(
    model_artifact_path: str, driver_id: str, feature: str, value: float
) -> list[RawDriverScore]:
    """Scenario Lab (ADR-0006): re-score the full field with exactly one
    driver's one feature overridden — every other driver's row is
    untouched, so the re-normalized win_score correctly reflects the
    field-wide effect of that single change. Raises KeyError if
    driver_id isn't in the current field."""
    kit = _load_kit(model_artifact_path)
    inputs = [dict(row) for row in kit["inputs"]]  # shallow copy, don't mutate the cached kit
    _, feature_names = _load_booster(model_artifact_path)

    match = next((row for row in inputs if row["driverId"] == driver_id), None)
    if match is None:
        raise KeyError(f"unknown driver_id: {driver_id}")
    match[feature] = value

    return _rows_to_raw_scores(inputs, feature_names, model_artifact_path)
