import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "AI PM Playbook · A working system for PMs building production AI",
  description:
    "Practical artifacts, evals, launch gates, and operating rituals for product managers shipping LLM, agent, and copilot features.",
  openGraph: {
    title: "AI PM Playbook",
    description:
      "From vague AI demo to shippable product. 10 templates, 12 guides, 3 worked case studies.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI PM Playbook",
    description:
      "From vague AI demo to shippable product. Templates, guides, and case studies for AI PMs.",
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
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
