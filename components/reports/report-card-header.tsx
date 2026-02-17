import type { GradeResult } from "@/lib/report-utils";
import { ShareButtons } from "./share-buttons";
import { FileDown } from "lucide-react";

interface ReportCardHeaderProps {
  grade: GradeResult;
  entityName: string;
  subtitle?: string;
  year?: number;
  reportType: "state" | "specialty" | "city" | "national";
  reportId: string;
  shareUrl: string;
  twitterText: string;
  linkedinText: string;
}

export function ReportCardHeader({
  grade,
  entityName,
  subtitle,
  year = 2026,
  reportType,
  reportId,
  shareUrl,
  twitterText,
  linkedinText,
}: ReportCardHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Title row with grade badge */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        {/* Grade circle */}
        <div className="flex-shrink-0">
          <div
            className={`relative flex h-24 w-24 items-center justify-center rounded-full border-4 ${grade.borderColor} bg-dark-400`}
          >
            <span className={`text-5xl font-bold ${grade.color}`}>
              {grade.grade}
            </span>
            <span
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full ${grade.bgColor} px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-dark whitespace-nowrap`}
            >
              {grade.label}
            </span>
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="flex-1">
          <p className="text-xs font-medium text-gold uppercase tracking-widest mb-1">
            Medicare Revenue Report Card {year}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            {entityName}
          </h1>
          {subtitle && (
            <p className="text-lg text-[var(--text-secondary)] mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Download PDF button */}
        <div className="flex-shrink-0">
          <a
            href={`/api/reports/pdf?type=${reportType}&id=${encodeURIComponent(reportId)}`}
            className="inline-flex items-center gap-2 rounded-lg border border-dark-50/80 bg-dark-400/50 px-4 py-2.5 text-sm font-medium hover:border-gold/30 hover:text-gold transition-all"
          >
            <FileDown className="h-4 w-4" />
            Download PDF
          </a>
        </div>
      </div>

      {/* Share row */}
      <ShareButtons
        url={shareUrl}
        twitterText={twitterText}
        linkedinText={linkedinText}
        title={`${entityName} Medicare Revenue Report Card ${year}`}
      />
    </div>
  );
}
