import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
