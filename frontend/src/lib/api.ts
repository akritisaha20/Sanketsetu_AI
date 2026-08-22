import { MOCK_SCHEMES, type SchemeResult } from "./mockSchemes";
import { matchScheme } from "./matchScheme";

export type InputType = "sign" | "voice" | "document" | "text";

// Matches the /api/v1/process contract from the team's API design:
// { status, intent, response: { title, summary, eligibility, documents, ... }, accessible_output }
type ProcessResponse = {
  status: "success" | "error";
  intent?: string;
  response?: {
    title: string;
    summary: string;
    eligibility: string[];
    documents: string[];
    source?: string;
  };
  accessible_output?: { text: string; audio_available: boolean };
};

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

/**
 * rawInput is whatever the user actually provided — the sign word, the
 * typed text, the speech transcript, or the OCR'd document text. It's
 * always what gets sent to the real backend. For the mock fallback, it's
 * matched against a small set of known scheme keywords.
 */
export async function fetchSchemeResult(
  inputType: InputType,
  rawInput: string,
  confidence: number
): Promise<{ result: SchemeResult; live: boolean }> {
  const matchedGesture = inputType === "sign" && MOCK_SCHEMES[rawInput] ? rawInput : matchScheme(rawInput);
  const fallback = MOCK_SCHEMES[matchedGesture];

  // No backend configured yet (Aayusha's API isn't deployed) — use mock data
  // so the UI keeps working standalone. Set VITE_API_BASE_URL in .env once
  // the real /api/v1/process endpoint is up.
  if (!API_BASE) {
    return { result: fallback, live: false };
  }

  try {
    const res = await fetch(`${API_BASE}/api/v1/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input_type: inputType,
        input: rawInput,
        confidence,
        session_id: crypto.randomUUID(),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`API responded ${res.status}`);

    const data: ProcessResponse = await res.json();
    if (data.status !== "success" || !data.response) throw new Error("API returned no result");

    return {
      result: {
        gesture: matchedGesture,
        title: data.response.title,
        summary: data.response.summary,
        eligibility: data.response.eligibility,
        documents: data.response.documents,
        applySteps: fallback.applySteps, // apply-steps aren't in the current API contract yet
        source: data.response.source ?? fallback.source,
      },
      live: true,
    };
  } catch {
    // Backend unreachable or erroring — fall back to mock so the demo
    // never breaks, but this codepath is a signal to check the backend.
    return { result: fallback, live: false };
  }
}
