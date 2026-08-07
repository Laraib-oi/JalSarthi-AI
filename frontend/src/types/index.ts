/** A single entry in the primary site navigation. */
export interface NavLink {
  label: string;
  href: string;
}

/**
 * Serializable identifiers for the icons used on Feature cards.
 *
 * We intentionally store a string key here instead of a Lucide component
 * reference. `FEATURES` (in `src/constants/features.ts`) is imported by a
 * Server Component (`FeaturesSection`) and passed as a prop into a Client
 * Component (`FeatureCard`). React Server Components can only serialize
 * plain data across that boundary — component/function references are not
 * serializable. The actual icon components are resolved from this key
 * inside `FeatureCard.tsx`, entirely on the client side.
 */
export type FeatureIconName =
  | "ai-assistant"
  | "government-knowledge"
  | "complaint-generator"
  | "voice-assistant"
  | "officer-copilot"
  | "analytics-dashboard";

/** One of the six capability cards shown in the Features section. */
export interface FeatureItem {
  id: string;
  icon: FeatureIconName;
  title: string;
  description: string;
  /** Marks capabilities that are on the roadmap but not live in this build. */
  status?: "live" | "upcoming";
}

/** A grouped set of links rendered as a footer column. */
export interface FooterLinkGroup {
  heading: string;
  links: NavLink[];
}
