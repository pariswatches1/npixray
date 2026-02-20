"use client";

import { useState } from "react";
import { Share2, Copy, Check, ExternalLink } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  twitterText: string;
  linkedinText: string;
  title: string;
}

export function ShareButtons({ url, twitterText, linkedinText, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [linkedinCopied, setLinkedinCopied] = useState(false);

  const fullUrl = `https://npixray.com${url}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(fullUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyLinkedinPost = async () => {
    const postText = `${linkedinText}\n\n${fullUrl}`;
    try {
      await navigator.clipboard.writeText(postText);
      setLinkedinCopied(true);
      setTimeout(() => setLinkedinCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-4">
      {/* Share button row */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
          <Share2 className="h-4 w-4" />
          Share:
        </span>

        {/* Twitter / X */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 py-2 text-sm font-medium hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] transition-all"
          aria-label="Share on X (Twitter)"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="hidden sm:inline">Post</span>
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 py-2 text-sm font-medium hover:border-blue-500/30 hover:text-blue-400 transition-all"
          aria-label="Share on LinkedIn"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span className="hidden sm:inline">Share</span>
        </a>

        {/* Facebook */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 py-2 text-sm font-medium hover:border-blue-600/30 hover:text-blue-500 transition-all"
          aria-label="Share on Facebook"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="hidden sm:inline">Share</span>
        </a>

        {/* Copy Link */}
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 py-2 text-sm font-medium hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] transition-all"
          aria-label="Copy link"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Copy Link</span>
            </>
          )}
        </button>
      </div>

      {/* LinkedIn pre-written post */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            One-Click LinkedIn Post
          </p>
          <button
            onClick={copyLinkedinPost}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-all"
          >
            {linkedinCopied ? (
              <>
                <Check className="h-3 w-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy Post
              </>
            )}
          </button>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
          {linkedinText}
        </p>
        <p className="text-sm text-blue-400 mt-2">{fullUrl}</p>
      </div>
    </div>
  );
}
