import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { SessionProvider } from "@/components/auth/session-provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "NPIxray — X-Ray Your Practice Revenue | AI Revenue Intelligence",
    template: "%s | NPIxray",
  },
  description:
    "Free AI-powered revenue analysis for medical practices. Enter any NPI number to instantly see missed revenue opportunities in coding, CCM, RPM, BHI, and AWV programs.",
  keywords: [
    "NPI lookup",
    "medical practice revenue",
    "Medicare billing analysis",
    "CPT code optimization",
    "CCM billing",
    "RPM revenue",
    "healthcare revenue intelligence",
    "medical coding analysis",
    "practice revenue optimization",
  ],
  authors: [{ name: "NPIxray" }],
  creator: "NPIxray",
  metadataBase: new URL("https://npixray.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://npixray.com",
    siteName: "NPIxray",
    title: "NPIxray — X-Ray Your Practice Revenue",
    description:
      "Free AI-powered revenue analysis for medical practices. See exactly how much revenue you're leaving on the table.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NPIxray Revenue Intelligence Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NPIxray — X-Ray Your Practice Revenue",
    description:
      "Free AI-powered revenue analysis for medical practices. See exactly how much revenue you're leaving on the table.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://npixray.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "2djzJ-Zk-sVzyGKo2xUIm9h0ZqekPeN1PEwD2HJKu3U",
  },
  other: {
    "ai-content-declaration": "This site provides llms.txt at /llms.txt and /llms-full.txt for AI systems",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "NPIxray",
      url: "https://npixray.com",
      description:
        "AI-powered revenue intelligence platform for medical practices. Uses free CMS public data to identify missed revenue opportunities.",
      logo: "https://npixray.com/og-image.png",
    },
    {
      "@type": "WebApplication",
      name: "NPIxray NPI Scanner",
      url: "https://npixray.com",
      applicationCategory: "HealthcareApplication",
      operatingSystem: "Web",
      description:
        "Free NPI scanner that analyzes Medicare billing data to find missed revenue from E&M coding gaps, CCM, RPM, BHI, and AWV programs.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free NPI scan with unlimited usage",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLMs.txt — AI-readable site description" />
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="LLMs-full.txt — Extended AI-readable site description" />
        <link rel="alternate" type="application/ld+json" href="/api/entity" title="Entity API — Machine-readable entity data" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SessionProvider>
          <GoogleAnalytics />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
