import { useState } from "react";
import Home, { type Mode } from "./screens/Home";
import SignMode from "./screens/SignMode";
import VoiceMode from "./screens/VoiceMode";
import DocumentMode from "./screens/DocumentMode";
import TextMode from "./screens/TextMode";
import Result from "./screens/Result";
import type { InputType } from "./lib/api";

type Screen =
  | { name: "home" }
  | { name: Exclude<Mode, never> } // sign | voice | document | text (input screens)
  | { name: "result"; inputType: InputType; query: string; confidence: number };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });

  const handleSelect = (mode: Mode) => setScreen({ name: mode });

  const goToResult = (inputType: InputType) => (query: string, confidence: number) =>
    setScreen({ name: "result", inputType, query, confidence });

  return (
    <div className="min-h-screen w-full flex justify-center bg-ink/[0.03]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-signal-700 focus:text-white focus:px-3 focus:py-2 focus:rounded-lg focus:text-sm"
      >
        Skip to content
      </a>
      <main id="main" className="w-full max-w-[420px] min-h-screen bg-paper shadow-sm flex flex-col">
        {screen.name === "home" && <Home onSelect={handleSelect} />}

        {screen.name === "sign" && (
          <SignMode onBack={() => setScreen({ name: "home" })} onConfirm={goToResult("sign")} />
        )}
        {screen.name === "voice" && (
          <VoiceMode onBack={() => setScreen({ name: "home" })} onConfirm={goToResult("voice")} />
        )}
        {screen.name === "document" && (
          <DocumentMode onBack={() => setScreen({ name: "home" })} onConfirm={goToResult("document")} />
        )}
        {screen.name === "text" && (
          <TextMode onBack={() => setScreen({ name: "home" })} onConfirm={goToResult("text")} />
        )}

        {screen.name === "result" && (
          <Result
            inputType={screen.inputType}
            query={screen.query}
            confidence={screen.confidence}
            onBack={() => setScreen({ name: screen.inputType })}
            onNewQuery={() => setScreen({ name: "home" })}
          />
        )}
      </main>
    </div>
  );
}
