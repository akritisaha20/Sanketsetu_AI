# Setup

## Frontend (Akriti)

```bash
cd frontend
npm install
npm run dev
```

Open the printed `http://localhost:5173/`. See `frontend/README.md` for
what's real vs. mocked, and how to point it at a live backend via
`.env`.

## Backend (Aayusha)

Not yet scaffolded. Planned: FastAPI, single `/api/v1/process` endpoint
matching `docs/api-contract.md`.

## ISL service (Aditi)

Model training/inference pipeline. See `services/isl/` (to be filled
in) — dataset → MediaPipe landmarks → Random Forest classifier.

## Orchestrator (Gourisha)

Deterministic intent-routing layer. See `services/orchestrator/` (to be
filled in).

## RAG / knowledge (Tejasvi)

Government scheme ingestion + retrieval pipeline. See `services/rag/`
(to be filled in).

## Full stack (once modules are connected)

```bash
docker compose up
```

`docker-compose.yml` is a placeholder until each service has a
Dockerfile.
