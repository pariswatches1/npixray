"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface TrackPageViewProps {
  event: string;
  label?: string;
  value?: number;
}

/**
 * Lightweight client component that fires a GA4 event on mount.
 * Drop into any server component page to track page views.
 *
 * Usage:
 *   <TrackPageView event="pricing_viewed" />
 *   <TrackPageView event="guide_viewed" label="ccm-billing-99490" />
 */
export function TrackPageView({ event, label, value }: TrackPageViewProps) {
  useEffect(() => {
    trackEvent({ action: event, category: "pageview", label, value });
  }, [event, label, value]);

  return null;
}
