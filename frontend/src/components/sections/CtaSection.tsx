"use client";

import { ArrowRight } from "lucide-react";

import { WaveDivider } from "@/components/shared/WaveDivider";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function CtaSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative overflow-hidden bg-gradient-primary">
      <WaveDivider className="absolute inset-x-0 -top-4 text-white/25" flip />

      <div className="container flex flex-col items-center gap-6 py-20 text-center md:py-24">
        <h2 className="max-w-xl font-heading text-display-sm text-white">
          {t.cta.heading}
        </h2>
        <p className="max-w-lg text-body-lg text-white/85">
          {t.cta.description}
        </p>
        <Button asChild variant="outline" size="lg" className="mt-2">
          <a href="/assistant">
            {t.cta.button}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  );
}
