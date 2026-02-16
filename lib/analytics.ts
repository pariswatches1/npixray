// Google Analytics 4 event tracking utility

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type GAEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
};

/**
 * Send an event to Google Analytics 4.
 * No-ops gracefully if GA isn't loaded or the measurement ID isn't set.
 */
export function trackEvent({ action, category, label, value, ...rest }: GAEvent) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  });
}
