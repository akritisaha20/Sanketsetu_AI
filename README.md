# Sanket Setu AI

**Team Her Tech Hive · Smart India Hackathon 2026 · Team ID: SIH_26_005**

An AI-powered accessibility orchestrator. A user communicates however is
most comfortable for them — Indian Sign Language, voice, a scanned
document, or typed text — and the orchestrator figures out their intent
and coordinates the right AI capability (ISL recognition, OCR, speech,
government-scheme RAG) to deliver an accessible response.

> Problem Statement: AI-Powered Accessibility Infrastructure for
> Inclusive Digital Services · PS Category: Software

## Repo layout

```
sanket-setu-ai/
├── frontend/              React + TS + Vite + Tailwind — Akriti
├── backend/                FastAPI, single /api/v1/process endpoint — Aayusha
├── services/
│   ├── isl/                 Landmark-based ISL recognition model — Aditi
│   ├── rag/                 Government scheme knowledge pipeline — Tejasvi
│   └── orchestrator/        Intent detection + routing — Gourisha
├── data/
│   ├── government/          Curated scheme records
│   └── vocabulary/          ISL gesture vocabulary
├── docs/                    architecture.md, api-contract.md, setup.md
├── tests/
├── docker-compose.yml
└── .env.example
```

## Branch strategy

- `main` — stable, demo-ready only
- `develop` — integration branch
- `feature/isl`, `feature/backend`, `feature/orchestrator`, `feature/rag`,
  `feature/frontend` — one per module

**Nobody pushes directly to `main`.** Work on your `feature/*` branch,
open a PR into `develop`, merge to `main` only when it's demo-stable.

## MVP priority

🟢 **Must work:** Sign → Orchestrator → RAG → Response
🟡 **Should work if time allows:** Text → Orchestrator → RAG → Response
🔵 **Future / extension:** OCR, Voice, Vision, continuous ISL,
personalization, SDK

Don't try to build all six capabilities in 7 days — get the sign path
solid first.

## Getting started

Each module has its own setup instructions — see `docs/setup.md` and the
README inside each folder (e.g. `frontend/README.md`).

## Status

| Module | Status |
|---|---|
| `frontend/` | Home / Sign / Result flow live; real camera + hand tracking; wired to call the backend contract with mock fallback |
| `backend/` | Not started |
| `services/isl/` | Model trained (~97% test accuracy), not yet exposed as a service |
| `services/orchestrator/` | Not started |
| `services/rag/` | Not started |
