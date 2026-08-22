import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Hand, AlertTriangle } from "lucide-react";
import HandMark from "../components/HandMark";
import { useHandLandmarker } from "../hooks/useHandLandmarker";
import { GESTURE_WORDS } from "../lib/mockSchemes";

type Status = "detecting" | "detected";

// How long a hand must stay in frame, continuously, before we treat it as
// "held" and reveal a result. This is still a MOCK gesture/confidence —
// Aditi's classifier isn't wired in yet. Real tracking (camera + 21-point
// landmarks) is live; only the word -> "scholarship" mapping is placeholder.
const HOLD_MS = 1200;

export default function SignMode({
  onBack,
  onConfirm,
}: {
  onBack: () => void;
  onConfirm: (gesture: string, confidence: number) => void;
}) {
  const { videoRef, canvasRef, state, error, handPresent } = useHandLandmarker();
  const [status, setStatus] = useState<Status>("detecting");
  const holdStart = useRef<number | null>(null);
  // Picks a different mock word each visit so the demo doesn't always land
  // on the same scheme. Real word will come from Aditi's classifier.
  const [gesture] = useState(() => GESTURE_WORDS[Math.floor(Math.random() * GESTURE_WORDS.length)]);
  const confidence = 0.9 + Math.random() * 0.08;

  useEffect(() => {
    if (state !== "tracking") return;
    let raf: number;

    const check = () => {
      if (handPresent) {
        if (holdStart.current === null) holdStart.current = performance.now();
        if (performance.now() - holdStart.current > HOLD_MS) {
          setStatus("detected");
        }
      } else {
        holdStart.current = null;
        setStatus("detecting");
      }
      raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);
    return () => cancelAnimationFrame(raf);
  }, [state, handPresent]);

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
        <span className="text-[12px] text-ink/45 font-medium">Sign mode</span>
      </div>

      <div className="px-5 pt-2">
        <h1 className="font-display font-semibold text-[20px] text-ink">Show your sign to the camera</h1>
        <p className="text-ink/55 text-[13px] mt-1">Hold your hand steady, centred in frame.</p>
      </div>

      {/* Announces camera/detection state changes for screen reader users,
          who can't see the video feed or landmark overlay. */}
      <p role="status" aria-live="polite" className="sr-only">
        {state === "loading-model" && "Loading hand-tracking model."}
        {state === "requesting-camera" && "Requesting camera access."}
        {state === "error" && error}
        {state === "tracking" && status === "detecting" && "Camera ready. Show your sign."}
        {state === "tracking" && status === "detected" && `Sign recognised: ${gesture}.`}
      </p>

      <div className="px-5 mt-4">
        <div className="relative aspect-[4/5] rounded-2xl bg-ink overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            muted
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full"
            style={{ transform: "scaleX(-1)" }}
          />

          {(state === "loading-model" || state === "requesting-camera") && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink">
              <HandMark className="w-16 h-16 text-beacon-400 motion-reduce:animate-none" animated />
              <p className="text-white/70 text-[12px]">
                {state === "loading-model" ? "Loading hand-tracking model…" : "Requesting camera access…"}
              </p>
            </div>
          )}

          {state === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink px-6 text-center">
              <AlertTriangle className="text-beacon-400" size={28} />
              <p className="text-white/80 text-[13px]">{error}</p>
            </div>
          )}

          <div className="absolute inset-4 border border-white/15 rounded-xl pointer-events-none" />

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/80 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full">
              <span
                className={`w-1.5 h-1.5 rounded-full ${status === "detecting" ? "bg-beacon-400 animate-pulse" : "bg-banyan-500"}`}
              />
              {state !== "tracking" ? "Starting camera" : status === "detecting" ? "Reading gesture" : "Sign recognised"}
            </span>
            <span className="text-[10px] font-mono text-white/50">21 pts / hand</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5">
        <div className="rounded-2xl border border-ink/10 bg-white px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-ink/45 uppercase tracking-wide">Detected</p>
              <p className="font-display font-semibold text-[22px] text-ink mt-0.5">
                {status === "detected" ? gesture : "—"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-ink/45 uppercase tracking-wide">Confidence</p>
              <p className="font-mono font-medium text-[22px] text-banyan-700 mt-0.5">
                {status === "detected" ? `${Math.round(confidence * 100)}%` : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto px-5 py-6">
        <button
          onClick={() => onConfirm(gesture, confidence)}
          disabled={status !== "detected"}
          className={`w-full rounded-xl py-3.5 font-display font-semibold text-[15px] flex items-center justify-center gap-2 transition
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-700
            ${status === "detected"
              ? "bg-signal-700 text-white hover:bg-signal-900 active:scale-[0.99]"
              : "bg-ink/10 text-ink/35 cursor-not-allowed"}`}
        >
          <Hand size={18} aria-hidden="true" />
          Get information
        </button>
      </div>
    </div>
  );
}
