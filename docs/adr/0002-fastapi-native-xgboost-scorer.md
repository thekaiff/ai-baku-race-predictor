# ADR-0002: FastAPI + Native XGBoost Booster Over a Reimplemented Scorer

## Context

The model artifact (`data/Baku_XGBoost_Dashboard_Data.json`) contains a
native XGBoost JSON-exported booster. The original build reimplemented tree
traversal in the frontend platform's own runtime, which is exactly where
score-mismatch bugs get introduced — output no longer guaranteed to match
the trained model.

## Decision

Serve predictions from a Python API (FastAPI, run as a Vercel Python
serverless function) that loads the booster directly via the `xgboost`
library (`Booster.load_model`), pinned to the same version the model was
exported with (`xgboost==3.4.1`). No tree-traversal logic is reimplemented
anywhere.

## Alternatives Considered

- **Reimplement scoring in JavaScript/TypeScript** to keep the whole stack
  in one language. Rejected — introduces exactly the score-mismatch risk
  this ADR exists to avoid, and duplicates logic that already exists,
  tested, in the model artifact.
- **Precompute all possible outputs offline and serve a static file.**
  Rejected — brittle the moment any input changes (new entry list,
  corrected feature value), and defeats the purpose of having a live API.

## Consequences

Backend is Python-only; frontend stays TypeScript/React. This is a
deliberate two-language split, justified by correctness guarantees, not an
accident. Any future scenario/what-if feature reuses this same scorer
rather than adding a second implementation.
