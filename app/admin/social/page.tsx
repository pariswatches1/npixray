"use client";

import { useState, useEffect } from "react";
import { Twitter, Linkedin, Copy, Check, Filter } from "lucide-react";
import { STATE_LIST, SPECIALTY_LIST, BENCHMARKS } from "@/lib/benchmark-data";
import { stateToSlug, specialtyToSlug } from "@/lib/db-queries";

interface Post {
  platform: "twitter" | "linkedin";
  category: "state" | "specialty" | "national";
  name: string;
  text: string;
}

export default function SocialPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "state" | "specialty" | "national">("all");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleLogin = async () => {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const copyText = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Social Content Generator
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Admin password"
            className="w-full p-3 rounded-lg bg-dark-400 border border-dark-50/80 mb-3"
          />
          {error && (
            <p className="text-red-400 text-sm mb-3">{error}</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-lg bg-gold text-dark font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Generate posts
  const posts: Post[] = [];

  // State posts
  STATE_LIST.forEach((s) => {
    const slug = stateToSlug(s.abbr);
    const url = `https://npixray.com/reports/states/${slug}`;

    posts.push({
      platform: "twitter",
      category: "state",
      name: s.name,
      text: `${s.name} Medicare providers are leaving significant revenue uncaptured. See the data-driven report card with real CMS data.\n\n${url}\n\n#MedicareBilling #HealthcareRevenue`,
    });

    posts.push({
      platform: "linkedin",
      category: "state",
      name: s.name,
      text: `New data: ${s.name} Medicare providers may be leaving significant revenue on the table.\n\nOur analysis of CMS public data reveals opportunities in E&M coding optimization and care management program adoption (CCM, RPM, BHI, AWV).\n\nFull report card with real data: ${url}\n\n#MedicareBilling #HealthcareRevenue #RevenueOptimization`,
    });
  });

  // Specialty posts
  SPECIALTY_LIST.forEach((sp) => {
    const slug = specialtyToSlug(sp);
    const url = `https://npixray.com/reports/specialties/${slug}`;
    const b = BENCHMARKS[sp];
    const avgGap = b ? `$${Math.round(b.avgTotalPayment * 0.18 / 1000)}K` : "$15K-35K";

    posts.push({
      platform: "twitter",
      category: "specialty",
      name: sp,
      text: `${sp} practices miss an avg of ~${avgGap}/year in billable Medicare revenue. Data from 1.175M providers.\n\n${url}\n\n#${sp.replace(/[\s\/]+/g, "")} #MedicareBilling`,
    });

    posts.push({
      platform: "linkedin",
      category: "specialty",
      name: sp,
      text: `Interesting data for ${sp} practices:\n\nAnalysis of ${b ? b.providerCount.toLocaleString() : "thousands of"} Medicare providers shows an estimated average revenue gap of ~${avgGap} per practice.\n\nThe biggest opportunities: care management programs and E&M coding optimization.\n\nFull report: ${url}\n\n#MedicareBilling #${sp.replace(/[\s\/]+/g, "")} #HealthcareRevenue`,
    });
  });

  // National posts
  const nationalUrl = "https://npixray.com/reports/national";
  posts.push(
    {
      platform: "twitter",
      category: "national",
      name: "National",
      text: `US Medicare providers are leaving billions in revenue uncaptured. State-by-state breakdown from 1.175M providers.\n\n${nationalUrl}\n\n#MedicareBilling #HealthcareRevenue`,
    },
    {
      platform: "linkedin",
      category: "national",
      name: "National",
      text: `New analysis: US Medicare providers leave billions uncaptured annually.\n\nKey findings from 1,175,281 providers:\n- CCM adoption: only ~4% of eligible providers\n- RPM adoption: ~2%\n- Average E&M undercoding gap: $15K-35K/provider\n\n50-state ranking + specialty analysis: ${nationalUrl}\n\n#MedicareBilling #HealthcareRevenue #CMS`,
    },
    {
      platform: "twitter",
      category: "national",
      name: "National - CCM Focus",
      text: `Only ~4% of Medicare providers bill CCM (99490). At $62/patient/month, that's massive uncaptured revenue.\n\nSee the full analysis: ${nationalUrl}`,
    },
    {
      platform: "linkedin",
      category: "national",
      name: "National - RPM Focus",
      text: `Remote Patient Monitoring (RPM) adoption among Medicare providers is still under 3%.\n\nWith 99457/99458 reimbursing $50-100/patient/month, practices with chronic care patients are missing significant revenue.\n\nData from 1.175M providers: ${nationalUrl}`,
    }
  );

  const filtered = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Social Content Generator</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        {posts.length} posts ready to copy ({STATE_LIST.length * 2} state +{" "}
        {SPECIALTY_LIST.length * 2} specialty + 4 national)
      </p>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="h-4 w-4 text-[var(--text-secondary)]" />
        {(["all", "state", "specialty", "national"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-gold/10 text-gold border border-gold/30"
                : "border border-dark-50/80 hover:border-gold/20"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="text-xs text-[var(--text-secondary)] ml-2">
          ({filtered.length} posts)
        </span>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {filtered.map((post, i) => (
          <div
            key={i}
            className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {post.platform === "twitter" ? (
                  <Twitter className="h-4 w-4 text-blue-400" />
                ) : (
                  <Linkedin className="h-4 w-4 text-blue-500" />
                )}
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  {post.name}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  ({post.text.length} chars)
                </span>
              </div>
              <button
                onClick={() => copyText(post.text, i)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gold/10 text-gold text-xs hover:bg-gold/20 transition-colors"
              >
                {copiedIdx === i ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copiedIdx === i ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">
              {post.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
