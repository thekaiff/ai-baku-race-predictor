

import os

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault(
    "MODEL_ARTIFACT_PATH", "data/Baku_XGBoost_Dashboard_Data.json"
)

from api.index import app  # noqa: E402

client = TestClient(app)


def test_scenario_endpoint_shape():
    resp = client.post(
        "/api/v1/scenario",
        json={"driver_id": "antonelli", "assumed_recent_finish": 11.0},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert set(body.keys()) == {
        "driver_id", "driver", "team", "original_win_score",
        "original_rank", "scenario_win_score", "scenario_rank",
        "score_change",
    }
    assert body["driver_id"] == "antonelli"


def test_scenario_unknown_driver_returns_404():
    resp = client.post(
        "/api/v1/scenario",
        json={"driver_id": "not_a_real_driver", "assumed_recent_finish": 5},
    )
    assert resp.status_code == 404


@pytest.mark.parametrize("bad_value", [0, 23, -1])
def test_scenario_out_of_range_finish_returns_422(bad_value):
    resp = client.post(
        "/api/v1/scenario",
        json={"driver_id": "antonelli", "assumed_recent_finish": bad_value},
    )
    assert resp.status_code == 422


def test_scenario_worse_assumed_finish_lowers_score():
    """Sanity check on direction, not exact magnitude: assuming a much
    worse recent average finish for the model's current top pick should
    not increase his score."""
    resp = client.post(
        "/api/v1/scenario",
        json={"driver_id": "antonelli", "assumed_recent_finish": 20.0},
    )
    body = resp.json()
    assert body["scenario_win_score"] <= body["original_win_score"]
    assert body["score_change"] <= 0


def test_scenario_endpoint_never_exposes_accuracy_fields():
    resp = client.post(
        "/api/v1/scenario",
        json={"driver_id": "antonelli", "assumed_recent_finish": 11.0},
    )
    banned_keys = {
        "accuracy", "winner_accuracy", "backtest", "evaluation",
        "verification", "test_races", "raw_score",
    }
    found = banned_keys & set(resp.json().keys())
    assert not found, f"Leaked internal keys in scenario response: {found}"
