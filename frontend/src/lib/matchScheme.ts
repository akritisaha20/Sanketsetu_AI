import { GESTURE_WORDS } from "./mockSchemes";

// Very small keyword matcher standing in for real intent detection
// (Gourisha's orchestrator will replace this). Looks for scheme keywords
// inside whatever free text the user typed, spoke, or scanned.
const KEYWORDS: Record<string, string> = {
  scholarship: "Scholarship",
  study: "Scholarship",
  student: "Scholarship",
  ration: "Ration card",
  food: "Ration card",
  grain: "Ration card",
  pension: "Pension",
  disability: "Pension",
  elderly: "Pension",
};

export function matchScheme(text: string): string {
  const lower = text.toLowerCase();
  for (const [keyword, gesture] of Object.entries(KEYWORDS)) {
    if (lower.includes(keyword)) return gesture;
  }
  // No keyword match — fall back to a random known scheme so the demo
  // still shows something relevant-looking rather than nothing.
  return GESTURE_WORDS[Math.floor(Math.random() * GESTURE_WORDS.length)];
}
