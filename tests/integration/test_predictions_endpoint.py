

import os

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault(
    "MODEL_ARTIFACT_PATH", "data/Baku_XGBoost_Dashboard_Data.json"
)

from api.index import app  # noqa: E402  (env var must be set first)

client = TestClient(app)


def test_healthz():
    resp = client.get("/api/healthz")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"
    assert resp.json()["model_loaded"] is True


def test_predictions_endpoint_shape():
    resp = client.get("/api/v1/predictions")
    assert resp.status_code == 200
    body = resp.json()

    assert body["race"] == "Azerbaijan Grand Prix"
    assert body["race_date"] == "2026-09-26"
    assert isinstance(body["drivers"], list)
    assert len(body["drivers"]) == 22

    driver = body["drivers"][0]
    assert set(driver.keys()) == {
        "driver_id", "driver", "team", "win_score", "eligible", "rank",
        "driver_finish_5",
    }


def test_predictions_endpoint_never_exposes_accuracy_fields():
    """FR-7 tripwire: assert none of these keys ever appear anywhere in
    the response body, at any nesting depth."""
    banned_keys = {
        "accuracy",
        "winner_accuracy",
        "recent_form_baseline_accuracy",
        "backtest",
        "evaluation",
        "verification",
        "test_races",
        "raw_score",  # internal only — RawDriverScore must never leak
    }

    resp = client.get("/api/v1/predictions")
    body = resp.json()

    def _all_keys(obj):
        if isinstance(obj, dict):
            for k, v in obj.items():
                yield k
                yield from _all_keys(v)
        elif isinstance(obj, list):
            for item in obj:
                yield from _all_keys(item)

    found = banned_keys & set(_all_keys(body))
    assert not found, f"Leaked internal keys in API response: {found}"


def test_eligible_drivers_are_ranked_1_through_n_with_no_gaps():
    resp = client.get("/api/v1/predictions")
    ranks = sorted(
        d["rank"] for d in resp.json()["drivers"] if d["eligible"]
    )
    assert ranks == list(range(1, len(ranks) + 1))


def test_win_scores_sum_to_one_across_eligible_drivers():
    resp = client.get("/api/v1/predictions")
    total = sum(
        d["win_score"] for d in resp.json()["drivers"] if d["eligible"]
    )
    assert total == pytest.approx(1.0, abs=1e-6)
