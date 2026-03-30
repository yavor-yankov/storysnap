import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StoryCatalog } from "@/components/landing/story-catalog";
import { Testimonials } from "@/components/landing/testimonials";
import { TrustSection } from "@/components/landing/trust-section";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <StoryCatalog />
      <TrustSection />
      <Testimonials />
      <CtaSection />
    </>
  );
}
