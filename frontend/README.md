# Sanket Setu AI — Frontend

Frontend for **Sanket Setu AI**, team Her Tech Hive's SIH 2026 entry
(SIH_26_005): an AI-powered accessibility orchestrator that lets users
communicate in Indian Sign Language, voice, document, or text, and get
back government scheme information in an accessible format.

Covers the **frontend/UX track**: Home (mode picker) → one of four input
modes (Sign / Voice / Document / Text) → Result (scheme information,
read aloud).

## Running it

```bash
npm install
npm run dev
```

Open the printed `http://localhost:5173/` link.

## What's real vs mocked right now

| Piece | Status |
|---|---|
| Camera access + live 21-point hand landmark tracking (MediaPipe) | **Real** |
| Voice input (browser Speech Recognition) | **Real** |
| Document OCR (Tesseract.js, reads text from an uploaded photo) | **Real** |
| Text input | **Real** |
| Home / 4 input modes / Result screen flow | **Real** |
| Read Aloud (browser Speech API) | **Real** |
| Which *scheme* an input maps to | **Mock** — a small keyword matcher stands in for Gourisha's orchestrator + Aditi's classifier |
| Government scheme content | **Mock** (3 sample schemes) — swaps in once Tejasvi's RAG pipeline is connected |

## Connecting to the real backend

`src/lib/api.ts` already calls the team's agreed contract:

```
POST /api/v1/process
{ "input_type": "sign" | "voice" | "document" | "text", "input": "<text>", "confidence": 0.95, "session_id": "..." }
```

Copy `.env.example` to `.env` and set:

```
VITE_API_BASE_URL=http://localhost:8000
```

Restart `npm run dev` after changing `.env`. With no URL set, the app
keeps working standalone using mock data — an amber banner appears on
Result whenever it's showing sample data instead of a live response.

## Project structure

```
src/
  components/   HandMark (signature landmark motif), Header
  hooks/        useHandLandmarker — camera + MediaPipe detection loop
  lib/          api.ts (backend client), mockSchemes.ts, matchScheme.ts, handConnections.ts
  screens/      Home.tsx, SignMode.tsx, VoiceMode.tsx, DocumentMode.tsx, TextMode.tsx, Result.tsx
```

## Accessibility notes

- Skip-to-content link, visible keyboard focus rings throughout
- `aria-live` status regions announce camera/mic/OCR state and result
  loading for screen reader users
- Respects `prefers-reduced-motion`
- Read Aloud uses the browser's built-in Speech API — no extra setup

## Demo run-through

1. Open the app fresh — **Home** screen, four mode cards, all tappable.
2. **Sign**: allow camera, hold a hand steady in frame for ~1s — point
   out the live green/amber 21-point landmark overlay tracking the real
   hand, then tap Get information.
3. **Voice**: tap the mic, speak a question, watch it transcribe live,
   tap Get information.
4. **Document**: upload/photograph a form, watch real OCR extract the
   text, tap Get information.
5. **Text**: type a question (or tap a suggestion chip), tap Get
   information.
6. On **Result** each time, narrate: "capture is real — sign tracking,
   speech-to-text, OCR, typing — the *matching to a scheme* is a
   placeholder until Gourisha's orchestrator and Aditi's classifier are
   connected; the screen, loading state, and API contract are real."
7. Tap **Read aloud** to show audio output working live.

If Wi-Fi/camera/mic access is a risk at the venue, test the full flow on
the actual demo device beforehand.
