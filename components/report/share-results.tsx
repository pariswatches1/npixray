"use client";

import { useState } from "react";
import { Share2, Link2, Check, Twitter } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ShareResultsProps {
  npi: string;
  providerName: string;
  missedRevenue: number;
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function ShareResults({ npi, providerName, missedRevenue }: ShareResultsProps) {
  const [copied, setCopied] = useState(false);

  const url = `https://npixray.com/scan/${npi}`;
  const missed = missedRevenue >= 1000
    ? `$${Math.round(missedRevenue / 1000)}K`
    : `$${missedRevenue.toLocaleString()}`;

  const shareText = `${providerName} is missing ${missed}/yr in Medicare revenue. See the full analysis:`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent({ action: "share_clicked", category: "share", label: "copy_link" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitter = () => {
    trackEvent({ action: "share_clicked", category: "share", label: "twitter" });
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const handleLinkedIn = () => {
    trackEvent({ action: "share_clicked", category: "share", label: "linkedin" });
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  return (
    <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="h-4 w-4 text-[#2F5EA8]" />
        <h3 className="text-sm font-semibold">Share This Report</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            copied
              ? "bg-green-500/10 border border-green-500/30 text-green-400"
              : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8]"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              Copy Link
            </>
          )}
        </button>

        {/* Twitter/X */}
        <button
          onClick={handleTwitter}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] transition-all"
        >
          <Twitter className="h-4 w-4" />
          Twitter / X
        </button>

        {/* LinkedIn */}
        <button
          onClick={handleLinkedIn}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] transition-all"
        >
          <LinkedInIcon className="h-4 w-4" />
          LinkedIn
        </button>
      </div>
    </div>
  );
}
