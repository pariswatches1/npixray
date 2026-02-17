"use client";

import { useState } from "react";
import { Twitter, Linkedin, Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  twitterText: string;
  linkedinText: string;
  url: string;
}

export function ShareButtons({
  twitterText,
  linkedinText,
  url,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [linkedinCopied, setLinkedinCopied] = useState(false);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLinkedinPost = async () => {
    await navigator.clipboard.writeText(linkedinText);
    setLinkedinCopied(true);
    setTimeout(() => setLinkedinCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-400 border border-dark-50/80 hover:border-gold/30 text-sm font-medium transition-colors"
        >
          <Twitter className="h-4 w-4" />
          Share on X
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-400 border border-dark-50/80 hover:border-gold/30 text-sm font-medium transition-colors"
        >
          <Linkedin className="h-4 w-4" />
          Share on LinkedIn
        </a>
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-400 border border-dark-50/80 hover:border-gold/30 text-sm font-medium transition-colors"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>

      {/* LinkedIn pre-written post */}
      <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gold uppercase tracking-wider">
            Ready-to-post LinkedIn content
          </p>
          <button
            onClick={copyLinkedinPost}
            className="text-xs px-3 py-1 rounded-md bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
          >
            {linkedinCopied ? "Copied!" : "Copy Post"}
          </button>
        </div>
        <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">
          {linkedinText}
        </p>
      </div>
    </div>
  );
}
