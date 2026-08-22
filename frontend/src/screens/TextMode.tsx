import { useState } from "react";
import { ChevronLeft, Send } from "lucide-react";

export default function TextMode({
  onBack,
  onConfirm,
}: {
  onBack: () => void;
  onConfirm: (query: string, confidence: number) => void;
}) {
  const [text, setText] = useState("");

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onConfirm(trimmed, 1);
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex items-center gap-2 px-5 pt-6 pb-2">
        <button
          onClick={onBack}
          aria-label="Back to home"
          className="w-8 h-8 rounded-full flex items-center justify-center text-ink/60 hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-700"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-[12px] text-ink/45 font-medium">Text mode</span>
      </div>

      <div className="px-5 pt-2">
        <h1 className="font-display font-semibold text-[20px] text-ink">What do you want to know?</h1>
        <p className="text-ink/55 text-[13px] mt-1">Type your question below, in your own words.</p>
      </div>

      <div className="px-5 mt-6 flex-1">
        <label htmlFor="query" className="sr-only">
          Your question
        </label>
        <textarea
          id="query"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. How do I apply for a scholarship?"
          rows={5}
          autoFocus
          className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3.5 text-[14px] text-ink placeholder:text-ink/35 resize-none focus:outline-none focus:border-signal-700 focus:ring-2 focus:ring-signal-700/15"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {["Scholarship for students with disabilities", "How to get a ration card", "Disability pension eligibility"].map(
            (suggestion) => (
              <button
                key={suggestion}
                onClick={() => setText(suggestion)}
                className="text-[11px] text-signal-700 bg-signal-50 border border-signal-200 rounded-full px-3 py-1.5 hover:bg-signal-100 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-700"
              >
                {suggestion}
              </button>
            )
          )}
        </div>
      </div>

      <div className="mt-auto px-5 py-6">
        <button
          onClick={submit}
          disabled={!text.trim()}
          className={`w-full rounded-xl py-3.5 font-display font-semibold text-[15px] flex items-center justify-center gap-2 transition
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-700
            ${text.trim()
              ? "bg-signal-700 text-white hover:bg-signal-900 active:scale-[0.99]"
              : "bg-ink/10 text-ink/35 cursor-not-allowed"}`}
        >
          <Send size={16} aria-hidden="true" />
          Get information
        </button>
      </div>
    </div>
  );
}
