# API contract

Owned by `backend/` (Aayusha). The frontend (`frontend/src/lib/api.ts`)
is already built against this contract.

## Endpoint

```
POST /api/v1/process
```

Frontend expects this at `${VITE_API_BASE_URL}/api/v1/process`. Other
endpoints from the original plan (kept for reference, not required by
the frontend today):

```
POST /api/v1/recognition
POST /api/v1/query
POST /api/v1/orchestrate
GET  /api/v1/health
```

## Request

```json
{
  "input_type": "sign",
  "input": "scholarship",
  "confidence": 0.95,
  "session_id": "abc123"
}
```

## Response

```json
{
  "status": "success",
  "intent": "government_information",
  "response": {
    "title": "Scholarship Information",
    "summary": "...",
    "eligibility": [],
    "documents": [],
    "source": "..."
  },
  "accessible_output": {
    "text": "...",
    "audio_available": true
  }
}
```

`status: "error"` or a missing `response` field makes the frontend fall
back to local mock data automatically — the demo never breaks even if
the backend is down, but a fallback banner appears on the Result screen
so it's clear which mode is active.

## Notes

- `documents_required` / apply-steps aren't part of `response` yet in
  this contract — the frontend currently fills those in from its own
  mock data regardless of live/mock mode. Add an `apply_steps: string[]`
  field to `response` when ready, and the frontend just needs a small
  change in `src/lib/api.ts` to use it.
