import { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker, type HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { HAND_CONNECTIONS } from "../lib/handConnections";

type TrackingState = "loading-model" | "requesting-camera" | "tracking" | "error";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";

export function useHandLandmarker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<TrackingState>("loading-model");
  const [error, setError] = useState<string | null>(null);
  const [handPresent, setHandPresent] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      try {
        setState("loading-model");
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numHands: 1,
        });
        if (cancelled) return;
        landmarkerRef.current = landmarker;

        setState("requesting-camera");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();

        setState("tracking");
        loop();
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof DOMException && err.name === "NotAllowedError"
            ? "Camera access was denied. Allow camera permission and reload."
            : "Couldn't start the camera or load the hand-tracking model."
        );
        setState("error");
      }
    }

    function loop() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !canvas || !landmarker || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const result: HandLandmarkerResult = landmarker.detectForVideo(video, performance.now());
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const hand = result.landmarks[0];
        setHandPresent(!!hand);
        if (hand) {
          ctx.strokeStyle = "#1F7A5C";
          ctx.lineWidth = 3;
          for (const [a, b] of HAND_CONNECTIONS) {
            ctx.beginPath();
            ctx.moveTo(hand[a].x * canvas.width, hand[a].y * canvas.height);
            ctx.lineTo(hand[b].x * canvas.width, hand[b].y * canvas.height);
            ctx.stroke();
          }
          ctx.fillStyle = "#E8A33D";
          for (const point of hand) {
            ctx.beginPath();
            ctx.arc(point.x * canvas.width, point.y * canvas.height, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    setup();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      landmarkerRef.current?.close();
    };
  }, []);

  return { videoRef, canvasRef, state, error, handPresent };
}
