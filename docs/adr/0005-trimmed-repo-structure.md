# ADR-0005: Trimmed Repository Structure

## Context

Our standard canonical folder structure for AI/ML products is oriented
around RAG/agent/LLM products (`agents/`, `rag/`, `prompts/`). This project
has no LLM component — it serves a frozen gradient-boosted tree model's
predictions. Including empty LLM-oriented scaffolding would misrepresent
what the repo is.

## Decision

Adopt the standard structure with `agents/`, `rag/`, and `prompts/` omitted
entirely (not created as empty folders). Kept: `core/` (config, scorer,
gate — the framework-agnostic scoring logic), `schemas/` folded into
`core/schemas.py` given the project's small surface area, `tests/`
(mirroring `core/`), `docs/adr/`. Frontend-specific directories (`app/`,
`components/`, `lib/`) are additions our standard structure doesn't
specify, since it predates a Next.js-frontend use case; they follow
standard Next.js App Router convention instead.

## Alternatives Considered

- **Create the full canonical structure including unused LLM folders**,
  per the letter of the standard structure. Rejected — our own repo
  checklist requires "unused folders omitted, not renamed," which this
  ADR follows.

## Consequences

Repo layout accurately signals "ML-serving API + dashboard," not
"agent/RAG system." Anyone applying our standard repo checklist to this
repo will find it compliant. If a future feature
genuinely needs `agents/` or `rag/` (unlikely for this project's stated
scope), add it then with its own justification.
