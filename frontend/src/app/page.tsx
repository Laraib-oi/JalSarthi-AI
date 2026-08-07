import Capabilities from "@/components/sections/Capabilities";
import { CtaSection } from "@/components/sections/CtaSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import StakeholderBenefits from "@/components/sections/StakeholderBenefits";
import Statistics from "@/components/sections/Statistics";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <HowItWorks />
      <StakeholderBenefits />
      <Statistics />
      <FeaturesSection />
      <CtaSection />
    </>
  );
}
