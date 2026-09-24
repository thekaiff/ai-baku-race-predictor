# ADR-0003: Stateless, Module-Level Prediction Cache

## Context

The field and model artifact do not change per request in this phase (no
scenario/what-if endpoint yet). Recomputing all 22 drivers' scores on every
request is unnecessary work, and a database is unjustified complexity for
data that has no per-user or per-request variation.

## Decision

Compute predictions once per warm instance, lazily, on the first request
(`api/index.py`'s `_cached_predictions`, backed by `functools.lru_cache`) —
not at Python module import time. Vercel reuses a warm serverless
instance's module state across invocations, so this still acts as an
in-memory cache for the instance's lifetime; the only change from
computing at import is that a bad artifact or scoring bug fails the
request that triggers it, rather than crashing the whole process before
it can serve anything, including `/api/healthz`. A cold start simply
recomputes once (model load + scoring is well under a second given the
field size). No database, no external cache layer.

## Alternatives Considered

- **Recompute on every request.** Rejected — pure waste for data that
  doesn't change per request; adds needless latency.
- **Persist predictions to a database or edge KV store.** Rejected — there
  is nothing here that needs persistence across deploys; the artifact file
  itself is already the durable source of truth, versioned in the repo.

## Consequences

Simple, fast, no moving parts to operate. Revisit this ADR when the
Scenario Lab (explicitly out of scope for this build) is added — that
feature needs per-request scoring against a modified input, not the cached
baseline, and will need its own design.
