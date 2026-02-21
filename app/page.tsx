"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Outfit, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./homepage-animations.css";

// ── Fonts ──
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// ── Types ──
interface CounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
}

interface FloatingOrbProps {
  size: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  dur: number;
}

interface PulseRingProps {
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
}

interface GridCell3DProps {
  row: number;
  col: number;
  delay: number;
}

interface GapItem {
  icon: string;
  amt: string;
  sub: string;
  title: string;
  desc: string;
  color: string;
  angle: number;
}

interface PlatformItem {
  icon: string;
  title: string;
  desc: string;
  tag: string;
  tagColor: string;
  stats: string;
}

interface RoadmapItem {
  phase: string;
  title: string;
  tier: string;
  tierColor: string;
  days: string;
  icon: string;
  impact: string;
  impactColor: string;
  desc: string;
  features: string[];
  status: string;
  statusColor: string;
}

interface PricingTier {
  name: string;
  price: string;
  period: string;
  desc: string;
  color: string;
  features: string[];
  cta: string;
  ctaBg: string;
  ctaColor: string;
  popular: boolean;
}

// ── Animated counter ──
function Counter({ end, prefix = "", suffix = "", duration = 2000, delay = 0 }: CounterProps) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => {
      const s = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - s) / duration, 1);
        setVal(Math.floor((1 - Math.pow(1 - p, 3)) * end));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [started, end, duration, delay]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── 3D Floating DNA Helix ──
function DNAHelix() {
  const pairs = 14;
  return (
    <div
      style={{
        position: "absolute",
        right: "-2%",
        top: "8%",
        width: 120,
        height: 400,
        opacity: 0.12,
        animation: "helixSpin 20s linear infinite",
        transformStyle: "preserve-3d",
      }}
    >
      {[...Array(pairs)].map((_, i) => {
        const y = i * (400 / pairs);
        const angle = i * 25;
        const x1 = Math.cos((angle * Math.PI) / 180) * 40 + 60;
        const x2 = Math.cos(((angle + 180) * Math.PI) / 180) * 40 + 60;
        return (
          <div key={i} style={{ position: "absolute", top: y, left: 0, width: "100%", height: 2 }}>
            <div
              style={{
                position: "absolute",
                left: x1,
                top: 0,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00B4C5",
                boxShadow: "0 0 10px rgba(0,180,197,0.4)",
                transform: "translateX(-50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x2,
                top: 0,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#0891B2",
                boxShadow: "0 0 10px rgba(8,145,178,0.4)",
                transform: "translateX(-50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: Math.min(x1, x2),
                top: 3,
                width: Math.abs(x1 - x2),
                height: 1.5,
                background: "linear-gradient(90deg, rgba(0,180,197,0.3), rgba(8,145,178,0.3))",
                borderRadius: 2,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── Floating 3D Orb ──
function FloatingOrb({ size, x, y, color, delay: orbDelay, dur }: FloatingOrbProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${color}40, ${color}15 50%, transparent 70%)`,
        boxShadow: `inset -4px -4px 12px ${color}10, 0 0 40px ${color}08`,
        animation: `floatOrb ${dur}s ease-in-out infinite ${orbDelay}s`,
        filter: "blur(0.5px)",
      }}
    />
  );
}

// ── Pulse Ring ──
function PulseRing({ x, y, size, delay: ringDelay, color }: PulseRingProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1.5px solid ${color}`,
        animation: `pulseRing 4s ease-out infinite ${ringDelay}s`,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

// ── Scan Line for Search Box ──
function ScanLine() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
        borderRadius: "inherit",
        zIndex: 2,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg, transparent 0%, #00D4FF 20%, #00FFB2 50%, #00D4FF 80%, transparent 100%)",
          boxShadow:
            "0 0 24px 8px rgba(0,212,255,0.15), 0 0 60px 16px rgba(0,212,255,0.06)",
          animation: "scanDown 2.8s ease-in-out infinite",
          opacity: 0.85,
        }}
      />
    </div>
  );
}

// ── Glowing Grid Cell (for 3D grid) ──
function GridCell3D({ row, col, delay: cellDelay }: GridCell3DProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${col * 25}%`,
        top: `${row * 25}%`,
        width: "24%",
        height: "24%",
        border: "1px solid rgba(0,180,197,0.06)",
        borderRadius: 4,
        animation: `gridFlash 6s ease-in-out infinite ${cellDelay}s`,
      }}
    />
  );
}

// ── Main Homepage Component ──
export default function NPIxrayHome() {
  const router = useRouter();
  const [npi, setNpi] = useState("");
  const [scanning, setScanning] = useState(false);
  const [hCard, setHCard] = useState<number | null>(null);
  const [hTier, setHTier] = useState<number | null>(null);
  const [hFeat, setHFeat] = useState<number | null>(null);
  const [hStep, setHStep] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouse = useCallback((e: MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [handleMouse]);

  const handleScan = () => {
    if (npi.length === 10) {
      setScanning(true);
      setTimeout(() => {
        router.push(`/scan/${npi}`);
        setScanning(false);
      }, 2000);
    }
  };

  const scrollToScan = () => {
    document.getElementById("scan")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEmailSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setEmailSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          npi: "0000000000",
          providerName: "CMS-0057-F Early Access",
          specialty: "Multi-Payer Analytics",
          state: "",
          city: "",
          totalMissedRevenue: 0,
        }),
      });
      setEmailSubmitted(true);
    } catch {
      // Silently handle - email capture is non-critical
    } finally {
      setEmailSubmitting(false);
    }
  };

  const gaps: GapItem[] = [
    {
      icon: "\u{1F52C}",
      amt: "$15K\u2013$40K",
      sub: "avg. missed/year",
      title: "E&M Coding Gaps",
      desc: "Your 99213 should be a 99214. We show exactly where, backed by 1.2M+ provider benchmarks.",
      color: "#00B4C5",
      angle: -2,
    },
    {
      icon: "\u{1F489}",
      amt: "$66\u2013$144",
      sub: "per patient/month",
      title: "CCM Revenue (99490)",
      desc: "Patients with 2+ chronic conditions qualify. Most practices miss 60-80% of eligible patients.",
      color: "#0891B2",
      angle: 1,
    },
    {
      icon: "\u{1F4CA}",
      amt: "$118\u2013$174",
      sub: "per missed visit",
      title: "AWV Gap Analysis",
      desc: "Annual Wellness Visits are the #1 underbilled service. Each one you miss costs real money.",
      color: "#E11D48",
      angle: -1,
    },
    {
      icon: "\u{1F9E0}",
      amt: "$120+",
      sub: "per patient/month",
      title: "RPM Revenue",
      desc: "Remote Patient Monitoring for hypertension, diabetes, COPD. High margin, low effort.",
      color: "#D97706",
      angle: 2,
    },
    {
      icon: "\u{1F48A}",
      amt: "$48+",
      sub: "per patient/month",
      title: "BHI Opportunity",
      desc: "Behavioral Health Integration is the most underutilized Medicare program.",
      color: "#7C3AED",
      angle: -1.5,
    },
    {
      icon: "\u{1F3AF}",
      amt: "90-day",
      sub: "capture roadmap",
      title: "AI Action Plan",
      desc: "Prioritized by dollar impact and ease. Know exactly what to do Monday morning.",
      color: "#059669",
      angle: 1.5,
    },
  ];

  const platform: PlatformItem[] = [
    {
      icon: "\u26A1",
      title: "Real-Time Eligibility",
      desc: "Verify patient coverage in 1-3 seconds. Recursive Medicare Advantage identification catches what others miss.",
      tag: "PRO",
      tagColor: "#00B4C5",
      stats: "500 verifications/mo",
    },
    {
      icon: "\u{1F4CB}",
      title: "Claims Processing",
      desc: "Submit claims directly. AI-powered scrubbing catches errors before submission. 95%+ first-pass acceptance rate.",
      tag: "ENTERPRISE",
      tagColor: "#7C3AED",
      stats: "10-15% \u2192 2-5% rejection",
    },
    {
      icon: "\u{1F916}",
      title: "AI Coding Assistant",
      desc: "Claude-powered code review analyzes documentation and recommends the right E&M level before you bill.",
      tag: "ENTERPRISE",
      tagColor: "#7C3AED",
      stats: "96% coding accuracy",
    },
    {
      icon: "\u{1F4B0}",
      title: "Revenue Recovery",
      desc: "Track the full lifecycle: NPIxray identifies the gap \u2192 you submit the claim \u2192 we track the payment.",
      tag: "PRO",
      tagColor: "#00B4C5",
      stats: "Full loop tracking",
    },
    {
      icon: "\u{1F50D}",
      title: "Multi-Payer Analytics",
      desc: "Medicare is 20%. With CMS-0057-F in 2026, commercial payer data unlocks the other 80%.",
      tag: "COMING 2026",
      tagColor: "#D97706",
      stats: "$150K-$250K recovery",
    },
    {
      icon: "\u{1F4C8}",
      title: "Batch Verification",
      desc: "Upload a CSV of patients. Verify 100-500 at once. Get results in minutes with revenue alerts attached.",
      tag: "PRO",
      tagColor: "#00B4C5",
      stats: "Up to 500 patients",
    },
  ];

  const roadmap: RoadmapItem[] = [
    {
      phase: "Phase 1",
      title: "pVerify Eligibility",
      tier: "PRO",
      tierColor: "#00B4C5",
      days: "3-5 days",
      icon: "\u26A1",
      impact: "\u{1F525} Highest revenue impact",
      impactColor: "#E11D48",
      desc: "Real-time patient eligibility verification in 1-3 seconds. Recursive Medicare Advantage identification. 500 verifications/month included with Pro.",
      features: [
        "OAuth 2.0 token management",
        "Eligibility Summary + Detail endpoints",
        "24hr response caching",
        "Usage tracking & billing",
      ],
      status: "IN PROGRESS",
      statusColor: "#00B4C5",
    },
    {
      phase: "Phase 2",
      title: "DrChrono Claims",
      tier: "ENTERPRISE",
      tierColor: "#7C3AED",
      days: "4-5 days",
      icon: "\u{1F4CB}",
      impact: "\u{1F525} $499/mo justification",
      impactColor: "#D97706",
      desc: "Submit claims directly from NPIxray. AI-powered pre-submission scrubbing catches errors. Reduces rejection from 10-15% to under 5%.",
      features: [
        "Claim creation & submission",
        "Error scrubbing engine",
        "Status tracking & webhooks",
        "Denial management & appeals",
      ],
      status: "NEXT UP",
      statusColor: "#D97706",
    },
    {
      phase: "Phase 3",
      title: "AI Coding Assistant",
      tier: "ENTERPRISE",
      tierColor: "#7C3AED",
      days: "3-5 days",
      icon: "\u{1F916}",
      impact: "\u{1F9E0} Competitive moat",
      impactColor: "#7C3AED",
      desc: "Claude-powered E&M code review. Analyzes encounter documentation and recommends the correct coding level before you bill. 96% accuracy.",
      features: [
        "Encounter documentation analysis",
        "E&M level recommendation",
        "Documentation gap identification",
        "Bulk historical audit",
      ],
      status: "PLANNED",
      statusColor: "#9CA3AF",
    },
    {
      phase: "Phase 4",
      title: "Multi-Payer Analytics",
      tier: "ENTERPRISE",
      tierColor: "#7C3AED",
      days: "5-7 days",
      icon: "\u{1F50D}",
      impact: "\u{1F680} CMS-0057-F ready",
      impactColor: "#059669",
      desc: "When commercial payers open their data in January 2026, NPIxray will be ready. Identify underpayments across ALL payers, not just Medicare.",
      features: [
        "Commercial payer API integration",
        "Cross-payer revenue comparison",
        "Underpayment detection (3-5%)",
        "Recovery tracking",
      ],
      status: "2026",
      statusColor: "#059669",
    },
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      desc: "See what you're missing",
      color: "#6B7280",
      features: [
        "NPI revenue scan",
        "E&M coding benchmarks",
        "Specialty comparison",
        "1.2M+ provider database",
        "Care management alerts",
        "AI 90-day action plan",
      ],
      cta: "Start Free Scan",
      ctaBg: "#F3F4F6",
      ctaColor: "#374151",
      popular: false,
    },
    {
      name: "Pro",
      price: "$199",
      period: "/month",
      desc: "Capture the revenue you're finding",
      color: "#00B4C5",
      features: [
        "Everything in Free, plus:",
        "Real-time eligibility (500/mo)",
        "Patient cost estimation",
        "Batch verification (100 pts)",
        "Revenue opportunity alerts",
        "Enhanced analytics",
        "Priority support",
      ],
      cta: "Start 14-Day Free Trial",
      ctaBg: "linear-gradient(135deg, #00B4C5, #0891B2)",
      ctaColor: "white",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$499",
      period: "/month",
      desc: "Full revenue intelligence suite",
      color: "#7C3AED",
      features: [
        "Everything in Pro, plus:",
        "Unlimited verification",
        "Claims processing",
        "AI coding assistant",
        "Multi-payer analytics",
        "Revenue recovery tracking",
        "Denial management",
        "Dedicated account manager",
      ],
      cta: "Start Free Trial",
      ctaBg: "rgba(124,58,237,0.06)",
      ctaColor: "#7C3AED",
      popular: false,
    },
  ];

  return (
    <div
      className={`npixray-home ${outfit.variable} ${jetbrainsMono.variable}`}
      style={{
        minHeight: "100vh",
        background: "#F7F9FB",
        fontFamily: "var(--font-outfit), 'Outfit', -apple-system, sans-serif",
        color: "#1A1A2E",
        overflow: "hidden",
      }}
    >
      {/* LIVING BACKGROUND */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {/* Mouse-following glow */}
        <div
          style={{
            position: "absolute",
            left: `${mousePos.x}%`,
            top: `${mousePos.y}%`,
            width: 600,
            height: 600,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(0,180,197,0.035) 0%, transparent 60%)",
            transition: "left 0.8s ease, top 0.8s ease",
            borderRadius: "50%",
          }}
        />

        {/* Morphing blobs */}
        <div
          style={{
            position: "absolute",
            top: "-5%",
            right: "5%",
            width: 500,
            height: 500,
            background: "linear-gradient(135deg, rgba(0,180,197,0.06), rgba(0,212,255,0.03))",
            animation: "morphBlob 15s ease-in-out infinite",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "-5%",
            width: 400,
            height: 400,
            background: "linear-gradient(135deg, rgba(8,145,178,0.04), rgba(124,58,237,0.02))",
            animation: "morphBlob 18s ease-in-out infinite 3s",
            filter: "blur(50px)",
          }}
        />

        {/* Dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(0,180,197,0.045) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Floating orbs */}
        <FloatingOrb size={80} x={8} y={15} color="#00B4C5" delay={0} dur={8} />
        <FloatingOrb size={50} x={85} y={25} color="#0891B2" delay={1.5} dur={7} />
        <FloatingOrb size={35} x={70} y={65} color="#7C3AED" delay={3} dur={9} />
        <FloatingOrb size={60} x={15} y={70} color="#00D4FF" delay={2} dur={10} />
        <FloatingOrb size={25} x={92} y={80} color="#059669" delay={4} dur={6} />
        <FloatingOrb size={45} x={45} y={10} color="#00B4C5" delay={1} dur={11} />

        {/* Pulse rings */}
        <PulseRing x={20} y={30} size={200} delay={0} color="rgba(0,180,197,0.08)" />
        <PulseRing x={80} y={20} size={150} delay={2} color="rgba(8,145,178,0.06)" />
        <PulseRing x={50} y={75} size={180} delay={4} color="rgba(0,212,255,0.05)" />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* HERO */}
        <section
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "100px 40px 80px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* DNA helix decoration */}
          <DNAHelix />

          {/* Badge with shimmer */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 20px",
              borderRadius: 100,
              border: "1px solid rgba(0,180,197,0.15)",
              marginBottom: 32,
              background:
                "linear-gradient(90deg, rgba(0,180,197,0.03), rgba(0,212,255,0.06), rgba(0,180,197,0.03))",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s linear infinite, slideUp 0.6s ease",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#00B4C5",
                animation: "breathe 2s infinite",
                boxShadow: "0 0 8px rgba(0,180,197,0.4)",
              }}
            />
            <span
              style={{
                fontSize: 11.5,
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                color: "#00899A",
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              AI-POWERED REVENUE INTELLIGENCE &bull; $180B+ CMS DATA
            </span>
          </div>

          {/* Main headline */}
          <h1
            style={{
              fontSize: "clamp(42px, 6vw, 78px)",
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: "-0.045em",
              marginBottom: 22,
              animation: "slideUp 0.7s ease 0.1s both",
            }}
          >
            Your Practice Is
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #00B4C5 0%, #0891B2 30%, #00D4FF 60%, #00B4C5 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 4s linear infinite",
              }}
            >
              Bleeding Revenue
            </span>
          </h1>
          <p
            style={{
              fontSize: 19,
              color: "#6B7280",
              maxWidth: 560,
              margin: "0 auto 44px",
              lineHeight: 1.65,
              fontWeight: 400,
              animation: "slideUp 0.7s ease 0.2s both",
            }}
          >
            Enter your NPI. In <strong style={{ color: "#1A1A2E" }}>30 seconds</strong>, see every
            dollar you&apos;re leaving on the table &mdash; benchmarked against{" "}
            <strong style={{ color: "#1A1A2E" }}>1.2 million providers</strong>.
          </p>

          {/* SCAN BOX WITH SCAN LINE */}
          <div
            id="scan"
            style={{ maxWidth: 580, margin: "0 auto 56px", animation: "slideUp 0.7s ease 0.3s both" }}
          >
            <div
              style={{
                position: "relative",
                borderRadius: 18,
                overflow: "hidden",
                background: "rgba(255,255,255,0.95)",
                border: `2px solid ${
                  scanning
                    ? "#00D4FF"
                    : npi.length > 0
                    ? "rgba(0,180,197,0.3)"
                    : "rgba(0,0,0,0.06)"
                }`,
                boxShadow: scanning
                  ? "0 0 40px rgba(0,212,255,0.15), 0 0 80px rgba(0,212,255,0.05), 0 8px 32px rgba(0,180,197,0.12)"
                  : npi.length > 0
                  ? "0 8px 32px rgba(0,180,197,0.1), 0 0 0 4px rgba(0,180,197,0.04)"
                  : "0 8px 32px rgba(0,0,0,0.05)",
                transition: "all 0.4s ease",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* THE SCAN LINE - always visible */}
              <ScanLine />

              {/* Corner accents */}
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  left: 6,
                  width: 16,
                  height: 16,
                  borderTop: "2px solid rgba(0,180,197,0.25)",
                  borderLeft: "2px solid rgba(0,180,197,0.25)",
                  borderRadius: "4px 0 0 0",
                  zIndex: 3,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 16,
                  height: 16,
                  borderTop: "2px solid rgba(0,180,197,0.25)",
                  borderRight: "2px solid rgba(0,180,197,0.25)",
                  borderRadius: "0 4px 0 0",
                  zIndex: 3,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 6,
                  left: 6,
                  width: 16,
                  height: 16,
                  borderBottom: "2px solid rgba(0,180,197,0.25)",
                  borderLeft: "2px solid rgba(0,180,197,0.25)",
                  borderRadius: "0 0 0 4px",
                  zIndex: 3,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 6,
                  right: 6,
                  width: 16,
                  height: 16,
                  borderBottom: "2px solid rgba(0,180,197,0.25)",
                  borderRight: "2px solid rgba(0,180,197,0.25)",
                  borderRadius: "0 0 4px 0",
                  zIndex: 3,
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 6,
                  gap: 6,
                  position: "relative",
                  zIndex: 3,
                }}
              >
                <div style={{ paddingLeft: 16, display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontSize: 20,
                      animation: scanning ? "spin 1s linear infinite" : "none",
                      transition: "all 0.3s",
                    }}
                  >
                    {scanning ? "\u{1F504}" : "\u{1F52C}"}
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Enter 10-digit NPI number..."
                  value={npi}
                  onChange={(e) => setNpi(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  onKeyDown={(e) => e.key === "Enter" && handleScan()}
                  aria-label="NPI number input"
                  style={{
                    flex: 1,
                    padding: "18px 12px",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#1A1A2E",
                    fontSize: 18,
                    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                  }}
                />
                <button
                  onClick={handleScan}
                  disabled={npi.length !== 10 || scanning}
                  aria-label="Run X-Ray Scan"
                  style={{
                    padding: "16px 32px",
                    borderRadius: 12,
                    border: "none",
                    cursor: npi.length === 10 ? "pointer" : "default",
                    background:
                      npi.length === 10
                        ? "linear-gradient(135deg, #00B4C5, #0891B2)"
                        : "#E5E7EB",
                    color: npi.length === 10 ? "white" : "#9CA3AF",
                    fontSize: 15,
                    fontWeight: 700,
                    transition: "all 0.3s",
                    fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow:
                      npi.length === 10 ? "0 6px 24px rgba(0,180,197,0.3)" : "none",
                    transform: npi.length === 10 ? "scale(1)" : "scale(0.98)",
                  }}
                >
                  {scanning ? (
                    <>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          border: "2.5px solid rgba(255,255,255,0.3)",
                          borderTopColor: "white",
                          borderRadius: "50%",
                          animation: "spin 0.5s linear infinite",
                        }}
                      />
                      Scanning...
                    </>
                  ) : (
                    "Run X-Ray Scan"
                  )}
                </button>
              </div>

              {/* Scanning progress bar */}
              {scanning && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: 3,
                    background: "linear-gradient(90deg, #00B4C5, #00D4FF, #00FFB2)",
                    animation: "shimmer 1s linear infinite",
                    backgroundSize: "200% 100%",
                    width: "100%",
                    zIndex: 4,
                  }}
                />
              )}
            </div>

            {/* Trust badges */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 20,
                marginTop: 16,
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: "\u{1F512}", text: "No login required" },
                { icon: "\u{1F48E}", text: "Free forever" },
                { icon: "\u26A1", text: "30-second results" },
                { icon: "\u{1F3E5}", text: "HIPAA safe" },
              ].map((t) => (
                <span
                  key={t.text}
                  style={{
                    fontSize: 12,
                    color: "#9CA3AF",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.015)",
                  }}
                >
                  <span style={{ fontSize: 11 }}>{t.icon}</span> {t.text}
                </span>
              ))}
            </div>
          </div>

          {/* Animated stat orbs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 48,
              flexWrap: "wrap",
              animation: "slideUp 0.7s ease 0.5s both",
            }}
          >
            {[
              { n: 1200000, suffix: "+", label: "Providers Indexed", icon: "\u{1F3E5}" },
              { n: 180, prefix: "$", suffix: "B+", label: "Medicare Data", icon: "\u{1F4CA}" },
              { n: 15, suffix: "+", label: "Specialties", icon: "\u{1FA7A}" },
              { n: 50, suffix: "+", label: "States Covered", icon: "\u{1F5FA}\uFE0F" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  padding: "16px 20px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.04)",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.3s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,180,197,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    color: "#00899A",
                  }}
                >
                  <Counter end={s.n} prefix={s.prefix || ""} suffix={s.suffix} delay={i * 150} />
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#9CA3AF",
                    fontWeight: 500,
                    marginTop: 2,
                    letterSpacing: "0.04em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REVENUE GAPS */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 11.5,
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                color: "#00B4C5",
                letterSpacing: "0.14em",
                fontWeight: 600,
                padding: "5px 14px",
                borderRadius: 6,
                background: "rgba(0,180,197,0.06)",
                border: "1px solid rgba(0,180,197,0.1)",
              }}
            >
              REVENUE INTELLIGENCE
            </span>
            <h2
              style={{
                fontSize: "clamp(30px, 3.8vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginTop: 16,
                lineHeight: 1.15,
              }}
            >
              Six Revenue Gaps We Find
              <br />
              <span style={{ color: "#9CA3AF", fontSize: "0.6em", fontWeight: 500 }}>
                In Every Practice. Every Time. Exposed In Seconds.
              </span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 14,
            }}
          >
            {gaps.map((f, i) => (
              <div
                key={i}
                onMouseEnter={() => setHCard(i)}
                onMouseLeave={() => setHCard(null)}
                style={{
                  borderRadius: 18,
                  padding: 28,
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                  background:
                    hCard === i ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.7)",
                  border: `1px solid ${
                    hCard === i ? f.color + "30" : "rgba(0,0,0,0.04)"
                  }`,
                  boxShadow:
                    hCard === i
                      ? `0 12px 40px ${f.color}12, 0 4px 12px rgba(0,0,0,0.04)`
                      : "0 2px 8px rgba(0,0,0,0.02)",
                  transform:
                    hCard === i
                      ? `translateY(-6px) rotate(${f.angle * 0.3}deg)`
                      : "none",
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {/* Top glow bar on hover */}
                {hCard === i && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`,
                    }}
                  />
                )}

                {/* Subtle bg pattern */}
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: `${f.color}05`,
                    transition: "all 0.4s",
                    transform: hCard === i ? "scale(2.5)" : "scale(1)",
                  }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 28,
                        filter: hCard === i ? "none" : "grayscale(0.2)",
                      }}
                    >
                      {f.icon}
                    </span>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          fontFamily:
                            "var(--font-jetbrains), 'JetBrains Mono', monospace",
                          color: f.color,
                          transition: "all 0.3s",
                          transform: hCard === i ? "scale(1.05)" : "scale(1)",
                        }}
                      >
                        {f.amt}
                      </div>
                      <div
                        style={{
                          fontSize: 10.5,
                          color: "#9CA3AF",
                          fontFamily:
                            "var(--font-jetbrains), 'JetBrains Mono', monospace",
                        }}
                      >
                        {f.sub}
                      </div>
                    </div>
                  </div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 700, marginBottom: 7 }}>{f.title}</h3>
                  <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.55 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Big money callout */}
          <div
            style={{
              textAlign: "center",
              marginTop: 56,
              padding: "48px 40px",
              borderRadius: 24,
              position: "relative",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(0,180,197,0.03))",
              border: "1px solid rgba(0,180,197,0.12)",
              boxShadow: "0 8px 40px rgba(0,180,197,0.06)",
            }}
          >
            {/* 3D grid overlay */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.5, perspective: "600px" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: "rotateX(50deg)",
                  transformOrigin: "center center",
                }}
              >
                {[...Array(4)].map((_, r) =>
                  [...Array(4)].map((_, c) => (
                    <GridCell3D key={`${r}-${c}`} row={r} col={c} delay={(r + c) * 0.5} />
                  ))
                )}
              </div>
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  fontSize: "clamp(38px, 5vw, 60px)",
                  fontWeight: 900,
                  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  letterSpacing: "-0.03em",
                }}
              >
                <span style={{ color: "#E11D48" }}>$</span>50,000{" "}
                <span style={{ color: "#CBD5E1" }}>&ndash;</span> $250,000
              </div>
              <div style={{ fontSize: 17, color: "#6B7280", marginTop: 8 }}>
                average revenue missed per practice, per year
              </div>
              <button
                onClick={scrollToScan}
                style={{
                  marginTop: 24,
                  padding: "14px 36px",
                  borderRadius: 11,
                  border: "none",
                  background: "linear-gradient(135deg, #00B4C5, #0891B2)",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.3s",
                  fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                  boxShadow: "0 6px 24px rgba(0,180,197,0.25)",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.transform = "translateY(-3px) scale(1.02)";
                  (e.target as HTMLElement).style.boxShadow =
                    "0 10px 36px rgba(0,180,197,0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = "translateY(0) scale(1)";
                  (e.target as HTMLElement).style.boxShadow =
                    "0 6px 24px rgba(0,180,197,0.25)";
                }}
              >
                Find Out Your Number &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 11.5,
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                color: "#059669",
                letterSpacing: "0.14em",
                fontWeight: 600,
                padding: "5px 14px",
                borderRadius: 6,
                background: "rgba(5,150,105,0.06)",
                border: "1px solid rgba(5,150,105,0.1)",
              }}
            >
              HOW IT WORKS
            </span>
            <h2
              style={{
                fontSize: "clamp(30px, 3.8vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginTop: 16,
              }}
            >
              30 Seconds. Zero Risk.
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              gap: 20,
              maxWidth: 1000,
              margin: "0 auto",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              {
                num: "01",
                title: "Enter Your NPI",
                desc: "Type any 10-digit NPI or search by name. We pull live data from the NPPES Registry.",
                icon: "\u2328\uFE0F",
                color: "#00B4C5",
              },
              {
                num: "02",
                title: "AI Scans $180B+",
                desc: "Our engine benchmarks your billing against 1.2M+ providers in your specialty.",
                icon: "\u{1F9EC}",
                color: "#0891B2",
              },
              {
                num: "03",
                title: "See Every Gap",
                desc: "Interactive dashboard reveals exact dollars you're missing \u2014 with a 90-day capture plan.",
                icon: "\u{1F4A1}",
                color: "#059669",
              },
            ].map((s, i) => (
              <div
                key={i}
                onMouseEnter={() => setHStep(i)}
                onMouseLeave={() => setHStep(null)}
                style={{
                  flex: "1 1 280px",
                  textAlign: "center",
                  padding: "40px 28px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(0,0,0,0.04)",
                  boxShadow:
                    hStep === i
                      ? `0 16px 48px ${s.color}15`
                      : "0 4px 16px rgba(0,0,0,0.03)",
                  position: "relative",
                  backdropFilter: "blur(8px)",
                  transform: hStep === i ? "translateY(-8px)" : "none",
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                {/* Step number - large background */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 16,
                    fontSize: 52,
                    fontWeight: 900,
                    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    color: `${s.color}08`,
                  }}
                >
                  {s.num}
                </div>

                {/* Orbiting dot */}
                {hStep === i && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: s.color,
                      animation: "orbit 3s linear infinite",
                      boxShadow: `0 0 10px ${s.color}`,
                    }}
                  />
                )}

                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: `${s.color}08`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    margin: "0 auto 16px",
                    border: `1px solid ${s.color}15`,
                    transition: "all 0.3s",
                    transform: hStep === i ? "scale(1.1) rotate(5deg)" : "scale(1)",
                  }}
                >
                  {s.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>{s.desc}</p>

                {/* Connector arrow */}
                {i < 2 && (
                  <div
                    style={{
                      position: "absolute",
                      right: -14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 18,
                      color: "#CBD5E1",
                      fontWeight: 300,
                    }}
                  >
                    &rarr;
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* PLATFORM FEATURES */}
        <section
          id="platform"
          style={{
            background: "rgba(255,255,255,0.7)",
            borderTop: "1px solid rgba(0,0,0,0.04)",
            borderBottom: "1px solid rgba(0,0,0,0.04)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: 11.5,
                  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  color: "#7C3AED",
                  letterSpacing: "0.14em",
                  fontWeight: 600,
                  padding: "5px 14px",
                  borderRadius: 6,
                  background: "rgba(124,58,237,0.05)",
                  border: "1px solid rgba(124,58,237,0.1)",
                }}
              >
                THE PLATFORM
              </span>
              <h2
                style={{
                  fontSize: "clamp(30px, 3.8vw, 48px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginTop: 16,
                  lineHeight: 1.15,
                }}
              >
                From Finding Gaps to{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #00B4C5, #7C3AED)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Capturing Revenue
                </span>
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: "#6B7280",
                  marginTop: 12,
                  maxWidth: 520,
                  margin: "12px auto 0",
                }}
              >
                NPIxray doesn&apos;t just show you the money &mdash; it helps you collect it.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: 16,
              }}
            >
              {platform.map((f, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHFeat(i)}
                  onMouseLeave={() => setHFeat(null)}
                  style={{
                    borderRadius: 18,
                    padding: "26px 24px",
                    position: "relative",
                    overflow: "hidden",
                    background:
                      hFeat === i ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.7)",
                    border: `1px solid ${
                      hFeat === i ? `${f.tagColor}25` : "rgba(0,0,0,0.04)"
                    }`,
                    boxShadow:
                      hFeat === i
                        ? `0 12px 36px ${f.tagColor}10`
                        : "0 2px 8px rgba(0,0,0,0.02)",
                    transform: hFeat === i ? "translateY(-4px)" : "none",
                    transition: "all 0.35s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          fontSize: 24,
                          transition: "transform 0.3s",
                          transform:
                            hFeat === i ? "scale(1.2) rotate(5deg)" : "scale(1)",
                        }}
                      >
                        {f.icon}
                      </span>
                      <h3 style={{ fontSize: 16, fontWeight: 700 }}>{f.title}</h3>
                    </div>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontFamily:
                          "var(--font-jetbrains), 'JetBrains Mono', monospace",
                        fontWeight: 700,
                        color: f.tagColor,
                        background: `${f.tagColor}08`,
                        padding: "4px 10px",
                        borderRadius: 6,
                        letterSpacing: "0.06em",
                        border: `1px solid ${f.tagColor}15`,
                      }}
                    >
                      {f.tag}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: "#6B7280",
                      lineHeight: 1.55,
                      marginBottom: 12,
                    }}
                  >
                    {f.desc}
                  </p>
                  <div
                    style={{
                      fontSize: 12,
                      fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                      color: f.tagColor,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: f.tagColor,
                        boxShadow: `0 0 6px ${f.tagColor}40`,
                      }}
                    />
                    {f.stats}
                  </div>
                </div>
              ))}
            </div>

            {/* Integrations */}
            <div
              style={{
                textAlign: "center",
                marginTop: 48,
                padding: "28px 0",
                borderTop: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  color: "#9CA3AF",
                  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  letterSpacing: "0.1em",
                  marginBottom: 16,
                }}
              >
                POWERED BY
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 36,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {["CMS Medicare", "NPPES Registry", "pVerify", "Claude AI", "Stripe"].map(
                  (n) => (
                    <span
                      key={n}
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#CBD5E1",
                        letterSpacing: "-0.01em",
                        padding: "6px 14px",
                        borderRadius: 8,
                        background: "rgba(0,0,0,0.015)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = "#00B4C5";
                        (e.target as HTMLElement).style.background =
                          "rgba(0,180,197,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = "#CBD5E1";
                        (e.target as HTMLElement).style.background =
                          "rgba(0,0,0,0.015)";
                      }}
                    >
                      {n}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* INTEGRATION ROADMAP */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 40px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 11.5,
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                color: "#E11D48",
                letterSpacing: "0.14em",
                fontWeight: 600,
                padding: "5px 14px",
                borderRadius: 6,
                background: "rgba(225,29,72,0.05)",
                border: "1px solid rgba(225,29,72,0.1)",
              }}
            >
              INTEGRATION ROADMAP
            </span>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 42px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginTop: 16,
                lineHeight: 1.15,
              }}
            >
              What We&apos;re Building{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #00B4C5, #E11D48)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Right Now
              </span>
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#6B7280",
                marginTop: 10,
                maxWidth: 500,
                margin: "10px auto 0",
              }}
            >
              Real integrations. Real APIs. Shipping fast.
            </p>
          </div>

          <div style={{ position: "relative" }}>
            {/* Vertical timeline line */}
            <div
              style={{
                position: "absolute",
                left: 28,
                top: 0,
                bottom: 0,
                width: 3,
                background:
                  "linear-gradient(to bottom, #00B4C5, #7C3AED, #D97706, #059669)",
                borderRadius: 4,
                opacity: 0.15,
              }}
            />

            {roadmap.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 24,
                  marginBottom: 20,
                  position: "relative",
                }}
              >
                {/* Timeline node */}
                <div
                  style={{
                    width: 56,
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: 4,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      background: "rgba(255,255,255,0.9)",
                      border: `2px solid ${item.tierColor}30`,
                      boxShadow: `0 4px 16px ${item.tierColor}12`,
                      zIndex: 2,
                    }}
                  >
                    {item.icon}
                  </div>
                </div>

                {/* Card */}
                <div
                  style={{
                    flex: 1,
                    borderRadius: 18,
                    padding: "24px 28px",
                    position: "relative",
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.35s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.boxShadow = `0 8px 32px ${item.tierColor}10`;
                    e.currentTarget.style.borderColor = `${item.tierColor}25`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.03)";
                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)";
                  }}
                >
                  {/* Top row: phase, title, badges */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily:
                          "var(--font-jetbrains), 'JetBrains Mono', monospace",
                        fontWeight: 700,
                        color: "#9CA3AF",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {item.phase}
                    </span>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A2E" }}>
                      {item.title}
                    </h3>
                    <span
                      style={{
                        fontSize: 9,
                        fontFamily:
                          "var(--font-jetbrains), 'JetBrains Mono', monospace",
                        fontWeight: 700,
                        color: item.tierColor,
                        background: `${item.tierColor}08`,
                        padding: "3px 9px",
                        borderRadius: 5,
                        letterSpacing: "0.06em",
                        border: `1px solid ${item.tierColor}15`,
                      }}
                    >
                      {item.tier}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontFamily:
                          "var(--font-jetbrains), 'JetBrains Mono', monospace",
                        fontWeight: 700,
                        color: item.statusColor,
                        background: `${item.statusColor}08`,
                        padding: "3px 9px",
                        borderRadius: 5,
                        letterSpacing: "0.06em",
                        border: `1px solid ${item.statusColor}15`,
                        animation:
                          item.status === "IN PROGRESS"
                            ? "breathe 2s infinite"
                            : "none",
                      }}
                    >
                      {item.status}
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 12,
                        fontFamily:
                          "var(--font-jetbrains), 'JetBrains Mono', monospace",
                        color: "#9CA3AF",
                        fontWeight: 500,
                      }}
                    >
                      &#9201; {item.days}
                    </span>
                  </div>

                  {/* Impact badge */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 12px",
                      borderRadius: 8,
                      background: `${item.impactColor}06`,
                      border: `1px solid ${item.impactColor}12`,
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily:
                          "var(--font-jetbrains), 'JetBrains Mono', monospace",
                        fontWeight: 700,
                        color: item.impactColor,
                      }}
                    >
                      {item.impact}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 13.5,
                      color: "#6B7280",
                      lineHeight: 1.6,
                      marginBottom: 14,
                    }}
                  >
                    {item.desc}
                  </p>

                  {/* Feature pills */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {item.features.map((feat, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: 11,
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: "rgba(0,0,0,0.025)",
                          color: "#6B7280",
                          fontFamily:
                            "var(--font-jetbrains), 'JetBrains Mono', monospace",
                          fontWeight: 500,
                        }}
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 11.5,
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                color: "#D97706",
                letterSpacing: "0.14em",
                fontWeight: 600,
                padding: "5px 14px",
                borderRadius: 6,
                background: "rgba(217,119,6,0.05)",
                border: "1px solid rgba(217,119,6,0.1)",
              }}
            >
              PRICING
            </span>
            <h2
              style={{
                fontSize: "clamp(30px, 3.8vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginTop: 16,
              }}
            >
              Every Plan Pays For Itself
            </h2>
            <p style={{ fontSize: 16, color: "#6B7280", marginTop: 10 }}>
              Find one missed AWV ($174) and your Pro plan is covered.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              maxWidth: 1080,
              margin: "0 auto",
            }}
          >
            {pricingTiers.map((tier, i) => (
              <div
                key={i}
                onMouseEnter={() => setHTier(i)}
                onMouseLeave={() => setHTier(null)}
                style={{
                  borderRadius: 22,
                  padding: "34px 26px",
                  position: "relative",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.95)",
                  border: `${tier.popular ? "2px" : "1px"} solid ${
                    tier.popular ? "#00B4C5" : "rgba(0,0,0,0.06)"
                  }`,
                  boxShadow: tier.popular
                    ? "0 16px 56px rgba(0,180,197,0.12), 0 0 0 4px rgba(0,180,197,0.04)"
                    : hTier === i
                    ? "0 12px 40px rgba(0,0,0,0.06)"
                    : "0 4px 16px rgba(0,0,0,0.03)",
                  transform:
                    hTier === i
                      ? "translateY(-8px)"
                      : tier.popular
                      ? "translateY(-4px)"
                      : "none",
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {tier.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background:
                        "linear-gradient(90deg, #00B4C5, #00D4FF, #00B4C5)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 3s linear infinite",
                    }}
                  />
                )}
                {tier.popular && (
                  <div
                    style={{
                      display: "inline-flex",
                      padding: "3px 12px",
                      borderRadius: 6,
                      background: "rgba(0,180,197,0.06)",
                      marginBottom: 14,
                      border: "1px solid rgba(0,180,197,0.1)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily:
                          "var(--font-jetbrains), 'JetBrains Mono', monospace",
                        fontWeight: 700,
                        color: "#00899A",
                        letterSpacing: "0.06em",
                      }}
                    >
                      &#11088; MOST POPULAR
                    </span>
                  </div>
                )}
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: tier.color,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase" as const,
                    marginBottom: 4,
                  }}
                >
                  {tier.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 3,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 44,
                      fontWeight: 900,
                      fontFamily:
                        "var(--font-jetbrains), 'JetBrains Mono', monospace",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {tier.price}
                  </span>
                  <span style={{ fontSize: 14, color: "#9CA3AF" }}>{tier.period}</span>
                </div>
                <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 24 }}>
                  {tier.desc}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                    marginBottom: 28,
                  }}
                >
                  {tier.features.map((feat, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        color: feat.includes("plus:") ? "#374151" : "#6B7280",
                        fontWeight: feat.includes("plus:") ? 600 : 400,
                      }}
                    >
                      {!feat.includes("plus:") && (
                        <span
                          style={{ color: tier.color, fontSize: 11, flexShrink: 0 }}
                        >
                          &#10003;
                        </span>
                      )}
                      {feat.includes("plus:") ? (
                        <em style={{ fontSize: 12 }}>{feat}</em>
                      ) : (
                        feat
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (tier.name === "Free") {
                      scrollToScan();
                    } else {
                      router.push("/pricing");
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    borderRadius: 11,
                    border: tier.popular ? "none" : `1px solid ${tier.color}22`,
                    background: tier.ctaBg,
                    color: tier.ctaColor,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                    boxShadow: tier.popular
                      ? "0 6px 20px rgba(0,180,197,0.25)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.transform = "translateY(-2px)";
                    if (tier.popular)
                      (e.target as HTMLElement).style.boxShadow =
                        "0 10px 32px rgba(0,180,197,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.transform = "translateY(0)";
                    if (tier.popular)
                      (e.target as HTMLElement).style.boxShadow =
                        "0 6px 20px rgba(0,180,197,0.25)";
                  }}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CMS-0057-F */}
        <section style={{ maxWidth: 920, margin: "0 auto", padding: "40px 40px 80px" }}>
          <div
            style={{
              borderRadius: 24,
              padding: "48px 40px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(217,119,6,0.03))",
              border: "1px solid rgba(217,119,6,0.12)",
              boxShadow: "0 8px 40px rgba(217,119,6,0.05)",
            }}
          >
            {/* Animated border */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background:
                  "linear-gradient(90deg, transparent, #D97706, #E11D48, #D97706, transparent)",
                backgroundSize: "200% 100%",
                animation: "shimmer 4s linear infinite",
              }}
            />

            <span
              style={{
                fontSize: 11,
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                color: "#D97706",
                letterSpacing: "0.14em",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 6,
                background: "rgba(217,119,6,0.06)",
                border: "1px solid rgba(217,119,6,0.1)",
              }}
            >
              &#9888;&#65039; CMS-0057-F &mdash; JANUARY 2026
            </span>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginTop: 18,
                marginBottom: 12,
              }}
            >
              2026 Changes <span style={{ color: "#D97706" }}>Everything</span>
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#6B7280",
                maxWidth: 560,
                margin: "0 auto 28px",
                lineHeight: 1.65,
              }}
            >
              Medicare = 20% of healthcare spending. Starting January 2026, commercial payers{" "}
              <strong style={{ color: "#374151" }}>must share claims data via APIs</strong>.
              NPIxray is building multi-payer analytics now.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 44,
                marginBottom: 28,
                flexWrap: "wrap",
              }}
            >
              {[
                { n: "3-5%", l: "revenue leakage from underpayment" },
                { n: "$150K+", l: "annual recovery for $5M practices" },
                { n: "80%", l: "of spending now accessible" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      fontFamily:
                        "var(--font-jetbrains), 'JetBrains Mono', monospace",
                      color: "#D97706",
                    }}
                  >
                    {s.n}
                  </div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", maxWidth: 140 }}>
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {emailSubmitted ? (
                <div
                  style={{
                    padding: "13px 28px",
                    borderRadius: 10,
                    background: "rgba(5,150,105,0.06)",
                    border: "1px solid rgba(5,150,105,0.15)",
                    color: "#059669",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                  }}
                >
                  &#10003; You&apos;re on the list! We&apos;ll notify you when multi-payer analytics launches.
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="Your email for early access"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                    aria-label="Email for early access"
                    style={{
                      padding: "13px 18px",
                      borderRadius: 10,
                      border: "1px solid rgba(217,119,6,0.15)",
                      background: "white",
                      color: "#1A1A2E",
                      fontSize: 14,
                      width: 260,
                      outline: "none",
                      fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                    }}
                  />
                  <button
                    onClick={handleEmailSubmit}
                    disabled={emailSubmitting}
                    style={{
                      padding: "13px 28px",
                      borderRadius: 10,
                      border: "none",
                      background: "linear-gradient(135deg, #D97706, #B45309)",
                      color: "white",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                      boxShadow: "0 4px 16px rgba(217,119,6,0.2)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.transform = "translateY(0)")
                    }
                  >
                    {emailSubmitting ? "Submitting..." : "Get Early Access \u2192"}
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "60px 40px 100px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Pulse rings behind CTA */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              height: 400,
              pointerEvents: "none",
            }}
          >
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  inset: `${idx * 40}px`,
                  borderRadius: "50%",
                  border: "1px solid rgba(0,180,197,0.06)",
                  animation: `pulseRing 4s ease-out infinite ${idx * 1.2}s`,
                }}
              />
            ))}
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <h2
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                marginBottom: 18,
              }}
            >
              Every Day You Wait Is
              <br />
              <span style={{ color: "#E11D48" }}>Money You Lose</span>
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "#6B7280",
                maxWidth: 460,
                margin: "0 auto 32px",
              }}
            >
              The scan is free. The insights are real. The only cost is not looking.
            </p>
            <button
              onClick={scrollToScan}
              style={{
                padding: "18px 48px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #00B4C5, #0891B2)",
                color: "white",
                fontSize: 18,
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.3s",
                fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                boxShadow: "0 8px 40px rgba(0,180,197,0.3)",
                animation: "breathe 3s ease-in-out infinite",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform =
                  "translateY(-4px) scale(1.03)";
                (e.target as HTMLElement).style.boxShadow =
                  "0 14px 50px rgba(0,180,197,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = "translateY(0) scale(1)";
                (e.target as HTMLElement).style.boxShadow =
                  "0 8px 40px rgba(0,180,197,0.3)";
              }}
            >
              Scan My NPI Free &rarr;
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
