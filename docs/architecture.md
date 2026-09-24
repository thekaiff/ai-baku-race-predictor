# Architecture — ai-baku-race-predictor

## Overview

A stateless prediction dashboard for the Baku (Azerbaijan) GP. A frozen
XGBoost model, exported from the training notebook as a portable JSON
booster, is loaded once per warm serverless instance and scored against the
current 22-driver field. A confidence gate (ADR-0001) flags drivers with no
usable feature history so they can't win the top spot purely on a
missing-data artifact. The frontend renders the top pick, top-5 bars, and
the full field, with a fixed disclaimer on what "model score" does and
doesn't mean.

## Component Diagram

```
┌─────────────────────────────┐
│ Model artifact (static JSON)│  loaded once, module scope
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────────────────────┐
│ api/index.py — FastAPI (Vercel Python fn)    │
│  ┌───────────────┐      ┌──────────────────┐ │
│  │ core/scorer.py│ ───▶ │ core/gate.py     │ │
│  │ raw XGBoost   │      │ eligibility rule │ │
│  │ scores        │      │ (ADR-0001)       │ │
│  └───────────────┘      └──────────────────┘ │
└──────────────────────┬────────────────────────┘
                        │ GET /api/v1/predictions
                        ▼
┌─────────────────────────────┐
│ app/ — Next.js dashboard     │
└─────────────────────────────┘
```

## Layers

| Layer | Directory | Responsibility |
|---|---|---|
| Presentation | `app/`, `components/` | Rendering, loading/error states, layout |
| Client data access | `lib/api.ts` | Typed fetch wrapper for `/api/v1/predictions` |
| API | `api/index.py` | FastAPI app, request/response wiring, Pydantic validation |
| Domain logic | `core/scorer.py`, `core/gate.py` | Model loading, scoring, eligibility rule |
| Schemas | `core/schemas.py` | Pydantic response models — the only surface allowed to leave `api/` |

## External Dependencies

- `xgboost` (Python) — loads and evaluates the model artifact
- `fastapi` — API framework, ASGI entrypoint for Vercel's Python runtime
- `next`, `react` — frontend framework

## Data Flow

1. Cold start (or first import): `core/scorer.py` loads
   `data/Baku_XGBoost_Dashboard_Data.json`, evaluates all 22 current drivers.
2. `core/gate.py` applies the eligibility rule (ADR-0001), producing the
   final ranked, gated result — cached at module scope (ADR-0003).
3. Every `GET /api/v1/predictions` returns the cached result, validated
   against `core/schemas.py`'s Pydantic response model.
4. Frontend fetches on page load, renders, and — on any request failure —
   keeps the last successful render visible with an error banner (FR-6).

## Deployment

Single Vercel project; see ADR-0004. `vercel.json` routes `/api/*` to the
Python function, everything else to Next.js.

## Known Limitation (tracked, not yet resolved)

Model backtest accuracy (33.3% vs. a 29.2% naive baseline) is intentionally
never exposed via the API or UI (FR-7) — recorded here, not hidden from the
engineering record, so the tradeoff stays visible to anyone building on
this repo even though it's invisible to end users.
