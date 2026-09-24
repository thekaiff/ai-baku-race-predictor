# ADR-0006: Scenario Lab — Scope Addition

## Context

Phase 1 requirements explicitly excluded Scenario Lab: *"Scenario Lab
explicitly out of scope for this build (confirmed) — API design should
not preclude adding it later, but we won't build it now."* The user
later asked for it after reviewing a reference build that included it.
This is a genuine scope change, not a bug fix — recorded here rather
than silently folded into an unrelated commit.

## Decision

Add one endpoint, `POST /api/v1/scenario`, that re-scores the full field
with a single driver's `driver_finish_5` overridden to an assumed value,
and returns that driver's original vs. scenario `win_score` and rank.

Implementation reuses the existing scorer and gate unchanged —
`core/scorer.py` gained `score_field_with_override()`, which clones the
cached field's inputs, overrides one driver's one feature, and re-runs
the same `score_inputs()` → `apply_gate()` pipeline the baseline
predictions use. No new scoring logic, no special-casing in the
verified scorer path — the Scenario Lab result and the baseline result
are guaranteed consistent because they're produced by the same code.

Frontend: a single `ScenarioLab` component (driver dropdown, slider
1–22 step 0.1, Run/Reset), matching the original reference spec. Per
FR-7, original-vs-scenario score comparison is explicitly permitted;
accuracy/backtest data is still never returned by this or any endpoint.

## Alternatives Considered

- **Client-side re-scoring** (reimplement the XGBoost evaluation in
  JS to avoid a round-trip). Rejected — reintroduces exactly the
  score-mismatch risk ADR-0002 exists to avoid.
- **Mutate `/api/v1/predictions` state on scenario run** (so the main
  rankings visibly update). Rejected — the reference spec keeps
  Scenario Lab self-contained with its own result display; mutating
  shared state would also break the "stateless, cached baseline"
  design in ADR-0003 for every other viewer hitting that endpoint.

## Consequences

`driver_finish_5` is now part of the public API response
(`GatedDriverScore`) — it's an input feature, not accuracy/backtest
data, so this doesn't cross the FR-7 boundary. Scenario requests are
NOT cached (each is a fresh score) — acceptable given they're
low-frequency, user-initiated actions, not page-load traffic.
