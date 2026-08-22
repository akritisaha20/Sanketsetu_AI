type HandMarkProps = {
  className?: string;
  animated?: boolean;
};

// A stylised 12-point node graph standing in for the product's real
// 21-point MediaPipe hand skeleton. Used as the wordmark glyph, a section
// divider, and (animated) as the live detection overlay in Sign Mode.
const NODES: [number, number][] = [
  [20, 70], [16, 52], [14, 34], [12, 18],
  [34, 62], [36, 40], [38, 22],
  [50, 66], [52, 44], [54, 26],
  [66, 72], [70, 50],
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3],
  [0, 4], [4, 5], [5, 6],
  [0, 7], [7, 8], [8, 9],
  [0, 10], [10, 11],
];

export default function HandMark({ className = "", animated = false }: HandMarkProps) {
  return (
    <svg viewBox="0 0 84 84" className={className} fill="none" aria-hidden="true">
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a][0]}
          y1={NODES[a][1]}
          x2={NODES[b][0]}
          y2={NODES[b][1]}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.55"
        />
      ))}
      {NODES.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === 0 ? 3.4 : 2.4}
          fill="currentColor"
        >
          {animated && (
            <animate
              attributeName="r"
              values={`${i === 0 ? 3.4 : 2.4};${i === 0 ? 4.2 : 3.2};${i === 0 ? 3.4 : 2.4}`}
              dur="1.8s"
              begin={`${i * 0.09}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
      ))}
    </svg>
  );
}
