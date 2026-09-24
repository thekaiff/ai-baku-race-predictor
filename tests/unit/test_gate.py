"""
Unit tests for core/gate.py (ADR-0001). Uses synthetic RawDriverScore rows
rather than live data, since — as of the current field — no real driver
triggers the gate (see ADR-0001's corrected context). These tests are how
the gate stays verified despite being currently inert on live data.
"""

import pytest

from core.gate import apply_gate
from core.schemas import RawDriverScore


def _row(driver_id, raw_score, history_count, all_null=False, finish_5=5.0):
    return RawDriverScore(
        driver_id=driver_id,
        driver=driver_id.title(),
        team="Team",
        raw_score=raw_score,
        driver_history_count=history_count,
        driver_finish_5=None if all_null else finish_5,
        all_features_null=all_null,
    )


def test_fully_null_driver_is_ineligible():
    rows = [_row("rookie", raw_score=0.9, history_count=None, all_null=True)]
    gated = apply_gate(rows, min_history_count=1)
    assert gated[0].eligible is False
    assert gated[0].rank is None
    assert gated[0].win_score == 0.0


def test_below_min_history_driver_is_ineligible():
    rows = [_row("debut", raw_score=0.5, history_count=0)]
    gated = apply_gate(rows, min_history_count=1)
    assert gated[0].eligible is False
    assert gated[0].rank is None


def test_normal_driver_is_eligible_and_unaffected():
    rows = [_row("veteran", raw_score=0.3, history_count=5, finish_5=4.2)]
    gated = apply_gate(rows, min_history_count=1)
    assert gated[0].eligible is True
    assert gated[0].rank == 1
    assert gated[0].win_score == 1.0  # sole eligible driver, renormalizes to 100%
    assert gated[0].driver_finish_5 == 4.2  # passed through for Scenario Lab


def test_win_score_renormalizes_across_eligible_drivers_only():
    rows = [
        _row("a", raw_score=0.6, history_count=5),
        _row("b", raw_score=0.3, history_count=5),
        _row("ghost", raw_score=0.9, history_count=None, all_null=True),
    ]
    gated = apply_gate(rows, min_history_count=1)
    by_id = {g.driver_id: g for g in gated}

    assert by_id["ghost"].eligible is False
    assert by_id["ghost"].win_score == 0.0
    # Renormalized across a (0.6) + b (0.3) = 0.9 total, ghost excluded
    assert by_id["a"].win_score == pytest.approx(0.6 / 0.9)
    assert by_id["b"].win_score == pytest.approx(0.3 / 0.9)
    assert by_id["a"].rank == 1
    assert by_id["b"].rank == 2

