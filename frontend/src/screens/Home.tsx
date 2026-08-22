import { Hand, Mic, FileText, Keyboard, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import HandMark from "../components/HandMark";

type Mode = "sign" | "voice" | "document" | "text";

const MODES: {
  id: Mode;
  label: string;
  hint: string;
  icon: typeof Hand;
  ready: boolean;
}[] = [
  { id: "sign", label: "Sign", hint: "Communicate in Indian Sign Language", icon: Hand, ready: true },
  { id: "voice", label: "Voice", hint: "Speak your question aloud", icon: Mic, ready: true },
  { id: "document", label: "Document", hint: "Scan a form or notice", icon: FileText, ready: true },
  { id: "text", label: "Text", hint: "Type your question", icon: Keyboard, ready: true },
];

export default function Home({ onSelect }: { onSelect: (mode: Mode) => void }) {
  return (
    <div className="min-h-full flex flex-col">
      <Header />

      <div className="px-5 pt-2 pb-6">
        <h1 className="font-display font-semibold text-[26px] leading-tight text-ink">
          How would you like<br />to communicate?
        </h1>
        <p className="text-ink/55 text-[14px] mt-2 leading-relaxed">
          Choose the way that's most comfortable for you. Sanket Setu understands
          your intent and finds the right information.
        </p>
      </div>

      <div className="px-5 flex flex-col gap-3 flex-1" role="group" aria-label="Communication modes">
        {MODES.map(({ id, label, hint, icon: Icon, ready }) => (
          <button
            key={id}
            onClick={() => ready && onSelect(id)}
            disabled={!ready}
            aria-disabled={!ready}
            aria-label={!ready ? `${label}, coming soon, not yet available` : `${label} — ${hint}`}
            className={`group text-left rounded-2xl border px-4 py-4 flex items-center gap-4 transition
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-700
              ${ready
                ? "border-signal-700/15 bg-white hover:border-signal-700/40 hover:shadow-[0_1px_0_0_rgba(0,0,0,0.02)] active:scale-[0.99] cursor-pointer"
                : "border-ink/10 bg-ink/[0.02] cursor-not-allowed"}`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                ${ready ? "bg-signal-700 text-beacon-100" : "bg-ink/10 text-ink/35"}`}
            >
              <Icon size={22} strokeWidth={2} aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`font-display font-semibold text-[16px] ${ready ? "text-ink" : "text-ink/40"}`}>
                  {label}
                </p>
                {!ready && (
                  <span className="text-[10px] uppercase tracking-wide font-medium text-ink/40 bg-ink/[0.06] px-2 py-0.5 rounded-full">
                    Coming soon
                  </span>
                )}
              </div>
              <p className={`text-[13px] mt-0.5 ${ready ? "text-ink/55" : "text-ink/35"}`}>{hint}</p>
            </div>
            {ready && (
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="text-signal-700/40 group-hover:text-signal-700 group-hover:translate-x-0.5 transition shrink-0"
              />
            )}
          </button>
        ))}
      </div>

      <div className="px-5 py-6 flex items-center gap-3 text-ink/35">
        <HandMark className="w-5 h-5" />
        <p className="text-[11px]">Built for Persons with Disabilities, students and citizens</p>
      </div>
    </div>
  );
}

export type { Mode };
