import type { Metadata } from "next";
import { CoachChat } from "@/components/coach/chat";

export const metadata: Metadata = {
  title: "AI Revenue Coach — Free Medicare Billing Expert | NPIxray",
  description:
    "Ask our AI Revenue Coach anything about Medicare billing, E&M coding, CCM, RPM, AWV, and revenue optimization. Personalized advice backed by real CMS data from 1.175M+ providers.",
  keywords: [
    "AI Medicare billing coach",
    "Medicare revenue optimization",
    "CCM billing advice",
    "RPM billing guide",
    "E&M coding help",
    "Medicare billing consultant",
    "AI healthcare billing",
    "revenue cycle management AI",
  ],
  openGraph: {
    title: "AI Revenue Coach — Free Medicare Billing Expert",
    description:
      "Ask our AI anything about Medicare billing and revenue optimization. Personalized advice backed by real CMS data.",
    url: "https://npixray.com/coach",
  },
  alternates: { canonical: "https://npixray.com/coach" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "NPIxray AI Revenue Coach",
  description:
    "AI-powered Medicare billing consultant that provides personalized revenue optimization advice backed by real CMS data from 1.175M+ providers.",
  url: "https://npixray.com/coach",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "3 free messages per session, unlimited with email",
  },
};

export default function CoachPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl">
        <CoachChat />
      </div>
    </>
  );
}
