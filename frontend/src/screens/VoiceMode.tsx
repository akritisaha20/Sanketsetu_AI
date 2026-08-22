import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Mic, MicOff, AlertTriangle } from "lucide-react";

// Minimal ambient types for the Web Speech API — not in default TS lib.
interface SpeechRecognitionResultLike {
  0: { transcript: string };
  isFinal: boolean;
}
interface SpeechRecognitionEventLike extends Event {
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

type State = "idle" | "listening" | "unsupported" | "denied";

export default function VoiceMode({
  onBack,
  onConfirm,
}: {
  onBack: () => void;
  onConfirm: (query: string, confidence: number) => void;
}) {
  const [state, setState] = useState<State>("idle");
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const SpeechRecognitionCtor =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setState("unsupported");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let combined = "";
      for (let i = 0; i < event.results.length; i++) {
        combined += event.results[i][0].transcript;
      }
      setTranscript(combined);
    };
    recognition.onerror = () => setState("denied");
    recognition.onend = () => setState((s) => (s === "listening" ? "idle" : s));

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, []);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (state === "listening") {
      recognition.stop();
      setState("idle");
    } else {
      setTranscript("");
      try {
        recognition.start();
        setState("listening");
      } catch {
        setState("denied");
      }
    }
  };

  const submit = () => {
    const trimmed = transcript.trim();
    if (!trimmed) return;
    onConfirm(trimmed, 0.9);
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
        <span className="text-[12px] text-ink/45 font-medium">Voice mode</span>
      </div>

      <div className="px-5 pt-2">
        <h1 className="font-display font-semibold text-[20px] text-ink">Speak your question</h1>
        <p className="text-ink/55 text-[13px] mt-1">Tap the microphone and speak clearly.</p>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {state === "listening" ? "Listening." : state === "unsupported" ? "Voice input not supported in this browser." : ""}
      </p>

      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
        {state === "unsupported" ? (
          <div className="flex flex-col items-center gap-2 text-center text-ink/60">
            <AlertTriangle className="text-beacon-600" size={28} />
            <p className="text-[13px]">
              Voice input isn't supported in this browser. Try Chrome, or use Text mode instead.
            </p>
          </div>
        ) : state === "denied" ? (
          <div className="flex flex-col items-center gap-2 text-center text-ink/60">
            <AlertTriangle className="text-beacon-600" size={28} />
            <p className="text-[13px]">Microphone access was denied. Allow it in your browser settings and try again.</p>
          </div>
        ) : (
          <>
            <button
              onClick={toggleListening}
              aria-pressed={state === "listening"}
              aria-label={state === "listening" ? "Stop listening" : "Start listening"}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal-700
                ${state === "listening" ? "bg-beacon-400 text-white animate-pulse" : "bg-signal-700 text-white hover:bg-signal-900"}`}
            >
              {state === "listening" ? <MicOff size={32} /> : <Mic size={32} />}
            </button>
            <p className="text-[12px] text-ink/45">{state === "listening" ? "Listening… tap to stop" : "Tap to speak"}</p>

            <div className="w-full min-h-[64px] rounded-2xl border border-ink/10 bg-white px-4 py-3 text-[14px] text-ink/80">
              {transcript || <span className="text-ink/35">Your words will appear here…</span>}
            </div>
          </>
        )}
      </div>

      <div className="px-5 py-6">
        <button
          onClick={submit}
          disabled={!transcript.trim()}
          className={`w-full rounded-xl py-3.5 font-display font-semibold text-[15px] transition
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-700
            ${transcript.trim()
              ? "bg-signal-700 text-white hover:bg-signal-900 active:scale-[0.99]"
              : "bg-ink/10 text-ink/35 cursor-not-allowed"}`}
        >
          Get information
        </button>
      </div>
    </div>
  );
}
