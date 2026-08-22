# Sanket Setu AI — Frontend

Frontend for **Sanket Setu AI**, team Her Tech Hive's SIH 2026 entry
(SIH_26_005): an AI-powered accessibility orchestrator that lets users
communicate in Indian Sign Language, voice, document, or text, and get
back government scheme information in an accessible format.

This package covers the **frontend/UX track only** — three screens:
Home (mode picker) → Sign Mode (camera + live hand tracking) → Result
(scheme information, read aloud).

## Running it

```bash
npm install
npm run dev
```

Open the printed `http://localhost:5173/` link. Click **Sign**, allow
camera access when prompted, and hold a hand steady in frame for about
a second to see a result.

## What's real vs mocked right now

| Piece | Status |
|---|---|
| Camera access + live 21-point hand landmark tracking (MediaPipe) | **Real** |
| Home / Sign / Result screen flow | **Real** |
| Read Aloud (browser Speech API) | **Real** |
| Which *word* was signed (currently random from a small set) | **Mock** — swaps in once Aditi's ISL classifier is ready |
| Government scheme content | **Mock** (3 sample schemes) — swaps in once Tejasvi's RAG pipeline is connected |

## Connecting to the real backend

The app already calls `fetchSchemeResult()` (`src/lib/api.ts`) shaped to
match the team's agreed contract:

```
POST /api/v1/process
{ "input_type": "sign", "input": "<word>", "confidence": 0.95, "session_id": "..." }
```

To point it at Aayusha's backend once it's running, copy `.env.example`
to `.env` and set:

```
VITE_API_BASE_URL=http://localhost:8000
```

Restart `npm run dev` after changing `.env`. With no URL set, the app
keeps working standalone using mock data — a small amber banner appears
on the Result screen whenever it's showing sample data instead of a
live backend response, so it's always clear which mode you're in during
a demo.

## Project structure

```
src/
  components/   HandMark (signature landmark motif), Header
  hooks/        useHandLandmarker — camera + MediaPipe detection loop
  lib/          api.ts (backend client), mockSchemes.ts, handConnections.ts
  screens/      Home.tsx, SignMode.tsx, Result.tsx
```

## Accessibility notes

- Skip-to-content link, visible keyboard focus rings throughout
- `aria-live` status regions announce camera/detection state and result
  loading for screen reader users (who can't see the video feed)
- Respects `prefers-reduced-motion`
- Read Aloud uses the browser's built-in Speech API — no extra setup

## Demo run-through (Day 7)

Rehearse this exact path before presenting:

1. Open the app fresh at `localhost:5173` — **Home** screen, four mode cards.
2. Tap **Sign**. Allow the camera permission prompt.
3. Hold one hand up, centred in frame, steady, for ~1 second.
4. Point out the live green/amber 21-point landmark overlay tracking the
   real hand in real time — this is the part that's fully working, not a
   mock.
5. Once "Sign recognised" appears, tap **Get information**.
6. On **Result**, narrate: "this word and confidence are placeholder until
   Aditi's classifier is connected — the screen, loading state, and error
   handling are all real and already wired to the team's API contract."
7. Tap **Read aloud** to show the audio output working live.
8. Tap **New query** to reset and, if useful, repeat with a different
   random mock scheme to show the result screen isn't hardcoded to one
   answer.

If Wi-Fi/camera access is a risk at the venue, test the full flow on the
actual demo device beforehand — camera permissions and MediaPipe's model
download both require it.


