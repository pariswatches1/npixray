import { calculateGrade } from "@/lib/report-utils";

interface ReportGradeProps {
  captureRate: number;
  size?: "sm" | "md" | "lg";
}

export function ReportGrade({ captureRate, size = "lg" }: ReportGradeProps) {
  const { grade, color, bgColor, label } = calculateGrade(captureRate);

  const sizeClasses = {
    sm: "h-12 w-12 text-xl",
    md: "h-20 w-20 text-4xl",
    lg: "h-28 w-28 text-6xl",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full border-2 ${bgColor} flex items-center justify-center font-bold ${color}`}
      >
        {grade}
      </div>
      {size !== "sm" && (
        <div className="text-center">
          <p className={`text-sm font-semibold ${color}`}>{label}</p>
          <p className="text-xs text-[var(--text-secondary)]">
            Revenue Capture Score: {captureRate}%
          </p>
        </div>
      )}
    </div>
  );
}
