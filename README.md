# ai-baku-race-predictor

Pre-race Azerbaijan GP (Baku) win-likelihood dashboard. Serves a frozen XGBoost
model's per-driver scores through a Python API and a Next.js dashboard, both
deployed as a single Vercel project.

> Model scores show relative preference across the field, not calibrated win
> probabilities. Backtest/accuracy figures are intentionally never exposed by
> the public API or UI — see `docs/adr/0001-confidence-gate-not-model-change.md`.

## Setup

```bash
# Frontend
npm install

# Backend (Python API function)
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Local dev (runs Next.js + Python API together via Vercel CLI)
npm i -g vercel
vercel dev
```

Copy `.env.example` to `.env.local` and fill in any values before running.

## Running Tests

```bash
# Python (scorer + gate + API)
pytest tests/unit tests/integration -v

# Frontend
npm run test
```

## Architecture

See `docs/architecture.md` for the component diagram, request flow, and data
design. Key decisions are recorded as ADRs in `docs/adr/`.

## Deployment

Deployed to Vercel. Pushing to `main` triggers a production deploy; PRs get
preview deployments automatically. See `docs/adr/0004-vercel-serverless-deployment.md`
for why Vercel over Docker/AWS at this stage.

## Documentation

- [Architecture](docs/architecture.md)
- [ADRs](docs/adr/)
- [Changelog](CHANGELOG.md)



