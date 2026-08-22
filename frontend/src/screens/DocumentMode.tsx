import { useRef, useState } from "react";
import { ChevronLeft, Upload, FileText, AlertTriangle } from "lucide-react";
import { createWorker } from "tesseract.js";

type State = "idle" | "scanning" | "done" | "error";

export default function DocumentMode({
  onBack,
  onConfirm,
}: {
  onBack: () => void;
  onConfirm: (query: string, confidence: number) => void;
}) {
  const [state, setState] = useState<State>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    setState("scanning");
    setProgress(0);
    setExtractedText("");

    try {
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
        },
      });
      const {
        data: { text },
      } = await worker.recognize(file);
      await worker.terminate();

      const cleaned = text.replace(/\s+/g, " ").trim();
      setExtractedText(cleaned);
      setState(cleaned ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const submit = () => {
    if (!extractedText) return;
    onConfirm(extractedText, 0.85);
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
        <span className="text-[12px] text-ink/45 font-medium">Document mode</span>
      </div>

      <div className="px-5 pt-2">
        <h1 className="font-display font-semibold text-[20px] text-ink">Scan a form or notice</h1>
        <p className="text-ink/55 text-[13px] mt-1">Upload a photo — we'll read the text for you.</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileChange}
        className="sr-only"
        id="doc-upload"
      />

      <div className="px-5 mt-4 flex-1">
        {!previewUrl ? (
          <label
            htmlFor="doc-upload"
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink/15 bg-white h-64 cursor-pointer hover:border-signal-700/40 transition focus-within:outline focus-within:outline-2 focus-within:outline-signal-700"
          >
            <Upload className="text-signal-700" size={28} aria-hidden="true" />
            <span className="text-[13px] text-ink/60 text-center px-6">
              Tap to take a photo or choose an image
            </span>
          </label>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-ink/10 bg-ink relative">
            <img src={previewUrl} alt="Uploaded document" className="w-full max-h-64 object-contain bg-white" />

            {state === "scanning" && (
              <div className="absolute inset-0 bg-ink/70 flex flex-col items-center justify-center gap-2 text-white">
                <FileText className="animate-pulse" size={24} />
                <p className="text-[12px] font-mono">Reading text… {progress}%</p>
              </div>
            )}
          </div>
        )}

        {state === "error" && (
          <div className="mt-3 flex items-center gap-2 text-[12px] text-beacon-600 bg-beacon-100 rounded-lg px-3 py-2">
            <AlertTriangle size={14} className="shrink-0" />
            Couldn't read any text from that image — try a clearer photo, or use Text mode instead.
          </div>
        )}

        {state === "done" && extractedText && (
          <div className="mt-3 rounded-2xl border border-ink/10 bg-white px-4 py-3">
            <p className="text-[11px] text-ink/45 uppercase tracking-wide mb-1.5">Extracted text</p>
            <p className="text-[13px] text-ink/75 leading-relaxed max-h-32 overflow-y-auto">{extractedText}</p>
          </div>
        )}

        {previewUrl && state !== "scanning" && (
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-3 text-[12px] text-signal-700 font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-700 rounded"
          >
            Choose a different photo
          </button>
        )}
      </div>

      <div className="px-5 py-6">
        <button
          onClick={submit}
          disabled={state !== "done" || !extractedText}
          className={`w-full rounded-xl py-3.5 font-display font-semibold text-[15px] transition
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-700
            ${state === "done" && extractedText
              ? "bg-signal-700 text-white hover:bg-signal-900 active:scale-[0.99]"
              : "bg-ink/10 text-ink/35 cursor-not-allowed"}`}
        >
          Get information
        </button>
      </div>
    </div>
  );
}
