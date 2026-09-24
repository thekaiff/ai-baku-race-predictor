# ADR-0001: Confidence-Gate Low-Signal Drivers Instead of Modifying the Model

## Context

The frozen XGBoost model's `predict_proba` uses default missing-value split
routing. A driver whose entire feature row is null (e.g. a late-season
replacement with no recorded starts) could be routed down a high-scoring
leaf and rank artificially high, despite carrying zero real signal.

As of the current field (verified by running `core/scorer.py` against
`data/Baku_XGBoost_Dashboard_Data.json`), no driver actually has all 9
features null — the field's top pick, Andrea Kimi Antonelli at 53.6%, is
driven by genuinely strong recent form (win_rate_5=0.6, podium_rate_5=1.0,
finish_5=1.6), not missing data. The one partial gap in the current field
(Arvid Lindblad, missing only `circuit_finish_3`/`circuit_win_rate_3` —
no prior Baku starts) is the training notebook's own documented, expected
behavior, not an anomaly. This ADR's gate is therefore not currently
active on any driver — it exists as a safeguard against a case that
hasn't occurred yet in this data, not a fix for one that has.

The product still requires (FR-8) that a driver with no usable signal can
never outrank drivers with real recent-form data, since the entry list
changes race to race and a genuinely-blank row (e.g. a mid-season debut)
is a realistic future case. Separately, the API's scorer must reproduce
the notebook's `verification` reference cases exactly, as a CI-gated
regression test (NFR-1) — so the scoring function itself cannot be
altered to special-case any driver.

## Decision

Leave the XGBoost scoring function untouched. Add a post-scoring business
rule ("confidence gate"): any driver with `driver_history_count` null or
below `MIN_HISTORY_COUNT`, or with all 9 features null, is marked
`eligible: false`. Ineligible drivers are excluded from top-pick and top-5
selection and from the eligible-field renormalization, and are rendered in
the full-field list with an "insufficient recent data" badge instead of a
score bar. Raw scores are still computed and retained internally for
verification/debugging.

## Alternatives Considered

- **Impute missing features with field medians before scoring.** Rejected
  — fabricates a performance history the driver doesn't have, and would
  change the scorer's input distribution away from what the verification
  cases assume.
- **Retrain the model with explicit missing-value handling.** Rejected —
  the model is frozen for this phase; retraining is out of scope and would
  invalidate exact parity with the notebook's verification cases.
- **No gate at all, since it isn't currently triggered.** Rejected — the
  entry list is not static (substitutions, mid-season debuts happen), and
  the cost of the gate is a small, well-tested, inert-by-default rule
  versus the cost of an untested code path when it eventually matters.

## Consequences

Raw model output stays 100% auditable against the notebook — the scorer is
never modified. The gate is a small, independently testable rule
(`core/gate.py`, unit-tested against synthetic null/partial/complete rows)
that is currently a no-op on live data, verified by
`tests/unit/test_gate.py`'s synthetic cases rather than by any real driver
in the current field.
