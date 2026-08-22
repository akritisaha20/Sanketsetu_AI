import HandMark from "./HandMark";

export default function Header({ eyebrow }: { eyebrow?: string }) {
  return (
    <header className="flex items-center gap-3 px-5 pt-6 pb-4">
      <div className="w-9 h-9 rounded-full bg-signal-700 text-beacon-100 flex items-center justify-center shrink-0">
        <HandMark className="w-6 h-6" />
      </div>
      <div>
        <p className="font-display font-semibold tracking-tight text-ink text-[15px] leading-none">
          Sanket Setu <span className="text-signal-600">AI</span>
        </p>
        <p className="text-[11px] text-ink/50 mt-1">{eyebrow ?? "Intelligent Accessibility Orchestrator"}</p>
      </div>
    </header>
  );
}
