"use client";

import { FeatureCard } from "@/components/shared/FeatureCard";
import { FEATURES } from "@/constants/features";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section id="features" className="relative bg-surface-raised py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-caption font-semibold uppercase tracking-wide text-primary-600">
          </span>
          <h2 className="mt-3 font-heading text-display-sm text-ink">
            {t.features.heading}
          </h2>
          <p className="mt-4 text-body-lg text-ink-muted">
            {t.features.description}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={{ ...feature, ...t.features.items[feature.icon] }}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
