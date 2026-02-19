"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Zap, BarChart3, Shield } from "lucide-react";
import { NpiInputForm } from "@/components/group/npi-input-form";

export default function GroupScanPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (npis: string[], practiceName: string) => {
    setSubmitting(true);
    const params = new URLSearchParams();
    params.set("npis", npis.join(","));
    if (practiceName) params.set("name", practiceName);
    router.push(`/group/results?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Scanner
        </Link>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/20 px-4 py-1.5 text-xs font-medium text-gold mb-4">
            <Users className="h-3.5 w-3.5" />
            GROUP PRACTICE SCAN
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            X-Ray Your Entire Practice
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
            Enter all provider NPIs to see your practice&apos;s total missed revenue,
            per-provider rankings, and program adoption gaps.
          </p>
        </div>

        {/* Input Card */}
        <div className="rounded-2xl bg-dark-800/30 border border-dark-50/20 p-6 sm:p-8 mb-8">
          <NpiInputForm onSubmit={handleSubmit} loading={submitting} />
        </div>

        {/* Value Props */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <ValueProp
            icon={<Zap className="h-5 w-5 text-gold" />}
            title="Practice-Wide View"
            desc="See total missed revenue across all providers in one dashboard"
          />
          <ValueProp
            icon={<BarChart3 className="h-5 w-5 text-emerald-400" />}
            title="Provider Rankings"
            desc="Identify top performers and biggest opportunities"
          />
          <ValueProp
            icon={<Shield className="h-5 w-5 text-blue-400" />}
            title="100% Free"
            desc="Uses public CMS data — no login required"
          />
        </div>
      </div>
    </div>
  );
}

function ValueProp({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-dark-800/20 border border-dark-50/10 p-4">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
