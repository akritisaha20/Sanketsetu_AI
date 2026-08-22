import { useEffect, useState } from "react";
import { ChevronLeft, Volume2, FileText, RotateCcw, Check, ExternalLink, WifiOff } from "lucide-react";
import { fetchSchemeResult } from "../lib/api";
import type { SchemeResult } from "../lib/mockSchemes";
import HandMark from "../components/HandMark";

export default function Result({
  gesture,
  confidence,
  onBack,
  onNewQuery,
}: {
  gesture: string;
  confidence: number;
  onBack: () => void;
  onNewQuery: () => void;
}) {
  const [reading, setReading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [r, setR] = useState<SchemeResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchSchemeResult(gesture, confidence).then(({ result, live }) => {
      if (cancelled) return;
      setR(result);
      setLive(live);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [gesture, confidence]);

  const readAloud = () => {
    if (!r || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (reading) {
      window.speechSynthesis.cancel();
      setReading(false);
      return;
    }
    const text = `${r.title}. ${r.summary} Eligibility: ${r.eligibility.join(". ")}.`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = () => setReading(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setReading(true);
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex items-center gap-2 px-5 pt-6 pb-2">
        <button
          onClick={onBack}
          aria-label="Back to sign mode"
          className="w-8 h-8 rounded-full flex items-center justify-center text-ink/60 hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-700"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-[12px] text-ink/45 font-medium">
          Result for &ldquo;{gesture}&rdquo;
        </span>
      </div>

      {/* Announces loading/ready state to screen readers without a visible alert */}
      <p role="status" aria-live="polite" className="sr-only">
        {loading ? "Looking up information" : r ? `Showing information for ${r.title}` : ""}
      </p>

      {!loading && !live && (
        <div className="mx-5 mt-2 flex items-center gap-2 rounded-lg bg-beacon-100 text-beacon-600 text-[11px] px-3 py-2">
          <WifiOff size={13} className="shrink-0" />
          Showing sample data — backend not connected yet.
        </div>
      )}

      <div className="px-5 flex-1 overflow-y-auto pb-4">
        {loading || !r ? (
          <div className="mt-8 flex flex-col items-center gap-3 text-ink/40" aria-hidden="true">
            <HandMark className="w-10 h-10 animate-pulse" />
            <p className="text-[12px]">Fetching information…</p>
          </div>
        ) : (
          <div className="mt-2 rounded-2xl border border-ink/10 bg-white overflow-hidden">
            <div className="px-4 pt-4 pb-3 border-b border-ink/8">
              <h1 className="font-display font-semibold text-[19px] leading-snug text-ink">{r.title}</h1>
              <p className="text-ink/60 text-[13px] mt-1.5 leading-relaxed">{r.summary}</p>
            </div>

            <Section title="Eligibility">
              {r.eligibility.map((item) => (
                <ListRow key={item} text={item} />
              ))}
            </Section>

            <Section title="Required documents">
              {r.documents.map((item) => (
                <ListRow key={item} text={item} />
              ))}
            </Section>

            <Section title="How to apply" last>
              <ol className="flex flex-col gap-2.5">
                {r.applySteps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-[13px] text-ink/75">
                    <span className="font-mono text-[11px] text-signal-600 shrink-0 mt-0.5" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </Section>

            <div className="px-4 py-3 bg-ink/[0.02] flex items-center gap-2 text-[11px] text-ink/45">
              <ExternalLink size={12} aria-hidden="true" />
              Source · {r.source}
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-4 grid grid-cols-3 gap-2 border-t border-ink/8 bg-paper">
        <ActionButton
          icon={<Volume2 size={17} />}
          label={reading ? "Stop" : "Read aloud"}
          onClick={readAloud}
          disabled={loading || !r}
          pressed={reading}
          primary
        />
        <ActionButton icon={<FileText size={17} />} label="View details" onClick={() => {}} disabled={loading || !r} />
        <ActionButton icon={<RotateCcw size={17} />} label="New query" onClick={onNewQuery} />
      </div>
    </div>
  );
}

function Section({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`px-4 py-3.5 ${!last ? "border-b border-ink/8" : ""}`}>
      <h2 className="text-[11px] font-medium text-ink/45 uppercase tracking-wide mb-2.5">{title}</h2>
      {children}
    </div>
  );
}

function ListRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 py-1 text-[13px] text-ink/75">
      <span className="w-4 h-4 rounded-full bg-banyan-100 text-banyan-700 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
        <Check size={10} strokeWidth={3} />
      </span>
      {text}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  primary,
  disabled,
  pressed,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
  pressed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className={`flex flex-col items-center gap-1.5 rounded-xl py-2.5 text-[11px] font-medium transition active:scale-[0.97]
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-700
        disabled:opacity-40 disabled:cursor-not-allowed
        ${primary ? "bg-signal-700 text-white hover:bg-signal-900" : "bg-white border border-ink/10 text-ink/70 hover:border-ink/25"}`}
    >
      {icon}
      {label}
    </button>
  );
}
