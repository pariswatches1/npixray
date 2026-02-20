"use client";

interface CircularProgressProps {
  value: number; // 0-1
  label: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgress({
  value,
  label,
  sublabel,
  size = 120,
  strokeWidth = 8,
  color = "#2F5EA8",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedValue = Math.max(0, Math.min(1, value));
  const offset = circumference - clampedValue * circumference;
  const displayPct = (clampedValue * 100).toFixed(1);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E9EEF6"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold font-mono">{displayPct}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold">{label}</p>
        {sublabel && (
          <p className="text-xs text-[var(--text-secondary)]">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
