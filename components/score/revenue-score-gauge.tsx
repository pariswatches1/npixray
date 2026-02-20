"use client";

import { useEffect, useRef, useState } from "react";
import { getScoreTier } from "@/lib/revenue-score";

interface RevenueScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  percentile?: number;
  specialty?: string;
}

const SIZES = {
  sm: { box: 80, radius: 32, stroke: 6, fontSize: 20, labelSize: 8 },
  md: { box: 160, radius: 64, stroke: 10, fontSize: 40, labelSize: 12 },
  lg: { box: 240, radius: 96, stroke: 14, fontSize: 56, labelSize: 16 },
};

export function RevenueScoreGauge({
  score,
  size = "md",
  animate = true,
  percentile,
  specialty,
}: RevenueScoreGaugeProps) {
  const [displayed, setDisplayed] = useState(animate ? 0 : score);
  const frameRef = useRef<number>(0);
  const tier = getScoreTier(score);
  const dim = SIZES[size];

  const circumference = 2 * Math.PI * dim.radius;
  const arcFraction = 0.75; // 270-degree arc
  const arcLength = circumference * arcFraction;
  const filledLength = arcLength * (displayed / 100);
  const gapLength = arcLength - filledLength;

  useEffect(() => {
    if (!animate) {
      setDisplayed(score);
      return;
    }
    let start: number | null = null;
    const duration = 1200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [score, animate]);

  // Rotate so the arc starts at bottom-left (135 degrees from top)
  const rotation = 135;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dim.box, height: dim.box }}>
        <svg
          width={dim.box}
          height={dim.box}
          viewBox={`0 0 ${dim.box} ${dim.box}`}
          className="transform"
        >
          {/* Background arc */}
          <circle
            cx={dim.box / 2}
            cy={dim.box / 2}
            r={dim.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={dim.stroke}
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            strokeLinecap="round"
            className="text-[var(--text-secondary)]/30"
            transform={`rotate(${rotation} ${dim.box / 2} ${dim.box / 2})`}
          />
          {/* Filled arc */}
          <circle
            cx={dim.box / 2}
            cy={dim.box / 2}
            r={dim.radius}
            fill="none"
            stroke={tier.hexColor}
            strokeWidth={dim.stroke}
            strokeDasharray={`${filledLength} ${circumference - filledLength}`}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${dim.box / 2} ${dim.box / 2})`}
            style={{ transition: animate ? "none" : "stroke-dasharray 0.6s ease-out" }}
          />
        </svg>
        {/* Score number in center */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ paddingTop: size === "sm" ? 0 : dim.stroke }}
        >
          <span
            className="font-bold font-mono leading-none"
            style={{ fontSize: dim.fontSize, color: tier.hexColor }}
          >
            {displayed}
          </span>
          <span
            className="font-semibold uppercase tracking-wider mt-0.5"
            style={{ fontSize: dim.labelSize, color: tier.hexColor }}
          >
            {tier.label}
          </span>
        </div>
      </div>
      {/* Percentile / specialty info below */}
      {(percentile || specialty) && (
        <div className="text-center">
          {percentile && (
            <p className="text-xs text-[var(--text-secondary)]">
              Top <span className={`font-semibold ${tier.color}`}>{100 - percentile}%</span> of{" "}
              {specialty || "all"} providers
            </p>
          )}
        </div>
      )}
    </div>
  );
}
