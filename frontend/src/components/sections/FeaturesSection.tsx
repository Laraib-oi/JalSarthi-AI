import { WaveDivider } from "@/components/shared/WaveDivider";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { FEATURES } from "@/constants/features";

export function FeaturesSection() {
  return (
    <section id="features" className="relative bg-surface-raised py-20 md:py-28">
      {/* <WaveDivider className="absolute inset-x-0 -top-4" /> */}

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-caption font-semibold uppercase tracking-wide text-primary-600">
          </span>
          <h2 className="mt-3 font-heading text-display-sm text-ink">
            Transforming Water Governance Through AI
          </h2>
          <p className="mt-4 text-body-lg text-ink-muted">
            Each capability is designed around a real interaction a citizen or officer
            already has with water governance today — made faster and clearer.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
