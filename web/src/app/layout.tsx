import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { BackToTop } from "@/components/BackToTop";
import { HeadingLinkCopy } from "@/components/HeadingLinkCopy";
import "./globals.css";

const GA_ID = "G-PVBHQB19LG";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const SITE_URL = "https://ai-pm-playbook.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "AI PM Playbook · Ship AI features you can put your name on",
    template: "%s · AI PM Playbook",
  },
  description:
    "The templates, evals, and launch gates AI PMs use to turn working demos into production calls they own.",
  applicationName: "AI PM Playbook",
  authors: [{ name: "Zaid Azmi" }],
  creator: "Zaid Azmi",
  keywords: [
    "AI product management",
    "AI PM",
    "LLM product",
    "AI evals",
    "launch gate",
    "AI PRD",
    "agentic products",
    "AI roadmap",
    "AI playbook",
  ],
  openGraph: {
    title: "AI PM Playbook",
    description:
      "Ship AI features you can put your name on. 10 templates, 12 guides, 3 worked case studies.",
    type: "website",
    url: SITE_URL,
    siteName: "AI PM Playbook",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI PM Playbook",
    description:
      "Ship AI features you can put your name on. Templates, evals, and launch gates for AI PMs.",
  },
  alternates: {
    canonical: "/",
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}
        <HeadingLinkCopy />
        <BackToTop />
        <Analytics />
        <GoogleAnalytics gaId={GA_ID} />
      </body>
    </html>
  );
}
