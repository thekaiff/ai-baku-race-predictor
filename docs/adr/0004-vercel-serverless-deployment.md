# ADR-0004: Vercel Serverless Deployment Over Docker/AWS

## Context

Our default deployment target for other projects is AWS via Docker
multi-stage builds. For this project, the priority is deploying a working dashboard
quickly while building familiarity with Vercel specifically; Docker/AWS
proficiency is being developed separately and deliberately deferred here.

## Decision

Deploy as a single Vercel project: the Next.js frontend and a Python
serverless function (`api/index.py`, FastAPI/ASGI, Vercel's Python runtime)
on the same domain, routed via `vercel.json` rewrites (`/api/*` → the
Python function). No Dockerfile in this phase.

## Alternatives Considered

- **Docker + AWS (ECS/Fargate), our usual default.** Deferred, not
  rejected outright — revisit once the dashboard is live and there's an
  actual reason to move (cost at scale, need for a persistent process,
  team standardization). The application logic (`core/`) has no Vercel- or
  AWS-specific dependencies, so this migration is low-risk later.
- **Separate hosting for frontend and backend** (e.g. Vercel for Next.js,
  a different host for the API). Rejected for now — same-origin deployment
  avoids CORS configuration entirely and is simpler to operate.

## Consequences

Cold starts exist (Python function reloads on a cold instance) but are
negligible given the small model artifact (~166 KB) and simple scoring
path. No persistent long-running process, no container orchestration to
manage. Our usual `docker/` and AWS-specific setup does not apply to
this repo until/unless this ADR is superseded.
