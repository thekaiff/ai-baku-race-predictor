

from __future__ import annotations

from core.schemas import GatedDriverScore, RawDriverScore


def _is_eligible(score: RawDriverScore, min_history_count: int) -> bool:
    if score.all_features_null:
        return False
    if score.driver_history_count is None:
        return False
    if score.driver_history_count < min_history_count:
        return False
    return True


def apply_gate(
    scores: list[RawDriverScore], min_history_count: int
) -> list[GatedDriverScore]:
    """Mark eligible=False for any driver with no usable feature history.
    win_score is renormalized across eligible drivers only, so an
    ineligible driver's raw score can never inflate or distort the
    eligible field's ranking. Ineligible drivers get win_score=0.0 and
    rank=None — the frontend renders them with an "insufficient recent
    data" badge instead of a score bar (FR-3, FR-8)."""
    eligible_flags = [_is_eligible(s, min_history_count) for s in scores]
    eligible_total = sum(
        s.raw_score for s, ok in zip(scores, eligible_flags) if ok
    )

    # Rank eligible drivers by raw_score, descending, ties broken by
    # original field order (stable sort).
    eligible_indices = [i for i, ok in enumerate(eligible_flags) if ok]
    eligible_indices.sort(key=lambda i: scores[i].raw_score, reverse=True)
    rank_by_index = {idx: rank for rank, idx in enumerate(eligible_indices, start=1)}

    gated: list[GatedDriverScore] = []
    for i, score in enumerate(scores):
        ok = eligible_flags[i]
        win_score = (
            score.raw_score / eligible_total
            if ok and eligible_total > 0
            else 0.0
        )
        gated.append(
            GatedDriverScore(
                driver_id=score.driver_id,
                driver=score.driver,
                team=score.team,
                win_score=win_score,
                eligible=ok,
                rank=rank_by_index.get(i),
                driver_finish_5=score.driver_finish_5,
            )
        )

    return gated
