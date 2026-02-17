import type { GradeResult } from "@/lib/report-utils";

interface ReportGradeProps {
  grade: GradeResult;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
}

const sizeMap = {
  sm: {
    container: "h-16 w-16",
    letter: "text-3xl",
    badge: "text-[8px] px-2 py-0.5 -bottom-1.5",
    border: "border-2",
  },
  md: {
    container: "h-24 w-24",
    letter: "text-5xl",
    badge: "text-[10px] px-3 py-0.5 -bottom-2",
    border: "border-4",
  },
  lg: {
    container: "h-32 w-32",
    letter: "text-6xl",
    badge: "text-xs px-4 py-1 -bottom-2.5",
    border: "border-4",
  },
};

export function ReportGrade({
  grade,
  size = "md",
  showLabel = true,
  label,
}: ReportGradeProps) {
  const s = sizeMap[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex-shrink-0">
        <div
          className={`relative flex ${s.container} items-center justify-center rounded-full ${s.border} ${grade.borderColor} bg-dark-400`}
        >
          <span className={`${s.letter} font-bold ${grade.color}`}>
            {grade.grade}
          </span>
          {showLabel && (
            <span
              className={`absolute ${s.badge} left-1/2 -translate-x-1/2 rounded-full ${grade.bgColor} font-bold uppercase tracking-wider text-dark whitespace-nowrap`}
            >
              {grade.label}
            </span>
          )}
        </div>
      </div>
      {label && (
        <p className="text-sm text-[var(--text-secondary)] font-medium text-center">
          {label}
        </p>
      )}
    </div>
  );
}
