import "./MatchRing.css";

// The signature visual motif of SmartPick: a radial HUD-style ring
// representing the AI confidence score for a recommended product.
export default function MatchRing({ value = 0, size = 56 }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  let colorVar = "var(--accent-cyan)";
  if (value < 80) colorVar = "var(--accent-blue)";
  if (value < 65) colorVar = "var(--accent-warning)";

  return (
    <div className="match-ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size}>
        <circle cx="24" cy="24" r={radius} className="match-ring-track" />
        <circle
          cx="24"
          cy="24"
          r={radius}
          className="match-ring-progress"
          style={{
            stroke: colorVar,
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <span className="match-ring-label">{value}%</span>
    </div>
  );
}
