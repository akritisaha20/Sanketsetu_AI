# Architecture

## High-level flow

```
USER → ORCHESTRATOR ┬── ISL
                     ├── OCR
                     ├── Speech
                     ├── Vision
                     └── RAG
```

1. **User input layer** (frontend) — user interacts however is
   comfortable: sign, voice, camera/document, or text.
2. **Orchestrator (the core)** — understands intent and context, decides
   which AI capability is needed.
3. **Capability selection** — triggers the relevant AI model(s).
4. **Execution & retrieval** — runs the model(s), retrieves knowledge
   (RAG) to generate an accurate, grounded response.
5. **Accessible output** — delivers a personalized, multi-modal response
   (voice, text, visual).

## ISL recognition pipeline (services/isl)

```
ISL Dataset → MediaPipe (21 landmarks/hand) → 84-D feature vector
  → Random Forest classifier → 33-class prediction
```

Current reported accuracy (~97%) is an experimental result on the
provided test split — not proof of full continuous ISL translation.
Framing for judges: *"Our current prototype provides static/sign-level
recognition, which forms the foundation for future continuous ISL
sequence recognition."*

## Orchestrator (services/orchestrator)

Deterministic intent routing for the MVP — not an autonomous agent.

```
Input: { input_type, content, confidence, session_id }
  → What did the user provide?
  → What does the user want?
  → Which capability is required?
  → Call that capability
```

Intents: `GOVERNMENT_INFO`, `DOCUMENT_HELP`, `GENERAL_QUERY`,
`SIGN_TRANSLATION`. Below-threshold confidence → fallback prompt
("Could you please repeat the sign?").

## Knowledge layer (services/rag)

```
Official Government Source → Document/Data → Clean → Chunk
  → Embedding → Vector Store → Retriever → LLM → Source-grounded Response
```

Each scheme record: `scheme_name`, `description`, `eligibility`,
`benefits`, `documents_required`, `application_process`, `official_url`,
`source_name`, `last_verified`. Start with a small curated set — don't
try to ingest hundreds of schemes for the MVP.

## API contract

See `docs/api-contract.md`.

## Database

PostgreSQL. Core tables for the MVP: `users`, `sessions`,
`interaction_logs`, `knowledge_sources`, `government_schemes`. Only
store what needs persistence — government knowledge is a knowledge
layer, not personal user data.
