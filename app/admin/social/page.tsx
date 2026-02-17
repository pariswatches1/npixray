"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Lock,
  LogIn,
  Loader2,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Globe,
  MapPin,
  Stethoscope,
  RefreshCw,
  Hash,
} from "lucide-react";

interface SocialPost {
  id: string;
  category: "state" | "specialty" | "national";
  label: string;
  twitter: string;
  linkedin: string;
  twitterChars: number;
  linkedinChars: number;
}

type TabType = "national" | "states" | "specialties";

export default function AdminSocialPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [counts, setCounts] = useState({ national: 0, states: 0, specialties: 0 });
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("national");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/social");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const json = await res.json();
      setPosts(json.posts || []);
      setCounts(json.counts || { national: 0, states: 0, specialties: 0 });
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  // Try auto-auth on mount
  useEffect(() => {
    fetch("/api/admin/social")
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
          return res.json();
        }
        return null;
      })
      .then((json) => {
        if (json) {
          setPosts(json.posts || []);
          setCounts(json.counts || { national: 0, states: 0, specialties: 0 });
        }
      })
      .catch(() => {});
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setAuthError("Invalid password");
        return;
      }

      setAuthenticated(true);
      setPassword("");
      fetchPosts();
    } catch {
      setAuthError("Network error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPosts = useMemo(() => {
    if (activeTab === "national") return posts.filter((p) => p.category === "national");
    if (activeTab === "states") return posts.filter((p) => p.category === "state");
    return posts.filter((p) => p.category === "specialty");
  }, [posts, activeTab]);

  // ── Auth gate ──────────────────────────────────────────

  if (!authenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20 mb-4">
              <Lock className="h-7 w-7 text-gold" />
            </div>
            <h1 className="text-2xl font-bold">Social Content Generator</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Enter the admin password to generate social posts
            </p>
          </div>

          <form onSubmit={handleAuth}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full rounded-xl border border-dark-50 bg-dark-500 py-3.5 px-4 text-sm placeholder:text-[var(--text-secondary)]/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/30 outline-none transition-all mb-4"
              autoFocus
            />
            {authError && (
              <p className="text-xs text-red-400 mb-3">{authError}</p>
            )}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-semibold text-dark transition-all hover:bg-gold-300 disabled:opacity-50"
            >
              {authLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main content ───────────────────────────────────────

  const tabs: { key: TabType; label: string; icon: typeof Globe; count: number }[] = [
    { key: "national", label: "National", icon: Globe, count: counts.national },
    { key: "states", label: "States", icon: MapPin, count: counts.states },
    { key: "specialties", label: "Specialties", icon: Stethoscope, count: counts.specialties },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Social <span className="text-gold">Content Generator</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Ready-to-post content for Twitter and LinkedIn
          </p>
        </div>
        <button
          onClick={fetchPosts}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-dark-50 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-gold hover:border-gold/30 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
              <Globe className="h-4 w-4 text-gold" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">National</p>
          </div>
          <p className="text-3xl font-bold font-mono text-gold">{counts.national}</p>
        </div>
        <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
              <MapPin className="h-4 w-4 text-gold" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">State Posts</p>
          </div>
          <p className="text-3xl font-bold font-mono text-gold">{counts.states}</p>
        </div>
        <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
              <Stethoscope className="h-4 w-4 text-gold" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">Specialty Posts</p>
          </div>
          <p className="text-3xl font-bold font-mono text-gold">{counts.specialties}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-dark-50/50 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-gold text-dark"
                  : "bg-dark-500 border border-dark-50 text-[var(--text-secondary)] hover:border-gold/30"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                activeTab === tab.key
                  ? "bg-dark/20 text-dark"
                  : "bg-dark-400 text-[var(--text-secondary)]"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-12 text-center">
          <Hash className="h-12 w-12 text-[var(--text-secondary)]/30 mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">No data available.</p>
          <p className="text-sm text-[var(--text-secondary)]/60 mt-1">
            Make sure the CMS database is loaded with provider data.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-dark-50/80 bg-dark-400/50 overflow-hidden"
            >
              {/* Post header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-dark-50/50 bg-dark-500/30">
                {post.category === "national" && <Globe className="h-4 w-4 text-gold" />}
                {post.category === "state" && <MapPin className="h-4 w-4 text-gold" />}
                {post.category === "specialty" && <Stethoscope className="h-4 w-4 text-gold" />}
                <span className="font-semibold text-sm">{post.label}</span>
              </div>

              <div className="p-5 space-y-5">
                {/* Twitter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-sky-400" />
                      <span className="text-xs font-medium text-sky-400 uppercase tracking-wider">
                        Twitter / X
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono ${
                        post.twitterChars > 280 ? "text-red-400" : "text-[var(--text-secondary)]"
                      }`}>
                        {post.twitterChars}/280
                      </span>
                      <button
                        onClick={() => handleCopy(post.twitter, `${post.id}-twitter`)}
                        className="flex items-center gap-1.5 rounded-md border border-dark-50 px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-gold hover:border-gold/30 transition-all"
                      >
                        {copiedId === `${post.id}-twitter` ? (
                          <>
                            <Check className="h-3 w-3 text-green-400" />
                            <span className="text-green-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="bg-dark-500/50 rounded-lg p-3 border border-dark-50/30">
                    <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                      {post.twitter}
                    </p>
                  </div>
                </div>

                {/* LinkedIn */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-medium text-blue-500 uppercase tracking-wider">
                        LinkedIn
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[var(--text-secondary)]">
                        {post.linkedinChars} chars
                      </span>
                      <button
                        onClick={() => handleCopy(post.linkedin, `${post.id}-linkedin`)}
                        className="flex items-center gap-1.5 rounded-md border border-dark-50 px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-gold hover:border-gold/30 transition-all"
                      >
                        {copiedId === `${post.id}-linkedin` ? (
                          <>
                            <Check className="h-3 w-3 text-green-400" />
                            <span className="text-green-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="bg-dark-500/50 rounded-lg p-3 border border-dark-50/30">
                    <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                      {post.linkedin}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
