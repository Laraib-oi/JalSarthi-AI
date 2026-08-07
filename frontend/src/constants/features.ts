import type { FeatureItem } from "@/types";

/**
 * Source of truth for the six capability cards.
 * Order here is render order — keep the most citizen-facing capabilities
 * first, operator/analytics tooling last.
 *
 * NOTE: `icon` is a plain string key (`FeatureIconName`), not a Lucide
 * component reference. This file is imported by a Server Component
 * (`FeaturesSection`), so everything exported from here must stay
 * serializable — no functions/components. The string key is resolved to
 * an actual icon component inside `FeatureCard.tsx` on the client.
 */
export const FEATURES: FeatureItem[] = [
  {
    id: "ai-assistant",
    icon: "ai-assistant",
    title: "AI Assistant",
    description:
      "A conversational guide that answers water-related questions in plain language, in the citizen's own words.",
    status: "upcoming",
  },
  {
    id: "government-knowledge",
    icon: "government-knowledge",
    title: "Government Knowledge",
    description:
      "Verified schemes, policies, and Jal Shakti guidelines, kept current and sourced directly from official documentation.",
    status: "upcoming",
  },
  {
    id: "complaint-generator",
    icon: "complaint-generator",
    title: "Complaint Generator",
    description:
      "Turns a citizen's description of a water issue into a properly formatted complaint, ready for submission.",
    status: "upcoming",
  },
  {
    id: "voice-assistant",
    icon: "voice-assistant",
    title: "Voice Assistant",
    description:
      "Speak your query in your preferred language — built for citizens who are more comfortable talking than typing.",
    status: "upcoming",
  },
  {
    id: "officer-copilot",
    icon: "officer-copilot",
    title: "Officer Copilot",
    description:
      "A companion for field and desk officers to triage complaints, draft responses, and track resolution status.",
    status: "upcoming",
  },
  {
    id: "analytics-dashboard",
    icon: "analytics-dashboard",
    title: "Analytics Dashboard",
    description:
      "District and state-level visibility into complaint volumes, scheme reach, and response times.",
    status: "upcoming",
  },
];
