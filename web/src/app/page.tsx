import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Paths } from "@/components/Paths";
import { FeaturedTemplates } from "@/components/FeaturedTemplates";
import { Marquee } from "@/components/Marquee";
import { TheLoop } from "@/components/TheLoop";
import { Skills } from "@/components/Skills";
import { CaseStudies } from "@/components/CaseStudies";
import { Guides } from "@/components/Guides";
import { StopSection } from "@/components/StopSection";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { loadGuideBySlug } from "@/lib/content";

export default function Home() {
  // Reading times for the two hero teaching cards are computed from the
  // actual guide markdown so the chip on the card always matches the chip
  // on the linked article.
  const preflightMinutes =
    loadGuideBySlug("before-you-vibe-code")?.readingTime.minutes ?? 0;
  const autonomyMinutes =
    loadGuideBySlug("agentic-products")?.readingTime.minutes ?? 0;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* 1. Frame the problem + name the audience; teach in one card */}
        <Hero
          preflightMinutes={preflightMinutes}
          autonomyMinutes={autonomyMinutes}
        />

        {/* 2. Self-select where the PM is right now */}
        <Paths />

        {/* 3. Three artifacts to actually use today */}
        <FeaturedTemplates />

        {/* 4. Visual rhythm + a peek at the PM verbs */}
        <Marquee />

        {/* 5. The connected loop — replaces a flat 6-step list */}
        <TheLoop />

        {/* 6. Worked case studies as proof */}
        <CaseStudies />

        {/* 7. Skills inventory linking to artifacts */}
        <Skills />

        {/* 8. Phase-grouped guides for deeper reading */}
        <Guides />

        {/* 9. The "do not launch" callout */}
        <StopSection />

        {/* 10. Final CTA */}
        <CTA />
      </main>
      <Footer />
    </>
  );
}
