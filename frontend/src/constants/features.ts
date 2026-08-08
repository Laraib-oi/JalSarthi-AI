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
      "A conversational guide for general water-related questions in plain language.",
    status: "upcoming",
  },
  {
    id: "government-knowledge",
    icon: "government-knowledge",
    title: "Government Knowledge",
    description:
      "A planned knowledge layer for source-backed answers from official documentation.",
    status: "upcoming",
  },
  {
    id: "complaint-generator",
    icon: "complaint-generator",
    title: "Complaint Generator",
    description:
      "A planned tool for preparing a structured complaint from a citizen's description.",
    status: "upcoming",
  },
  {
    id: "voice-assistant",
    icon: "voice-assistant",
    title: "Voice Assistant",
    description:
      "A planned voice interaction option for citizens who prefer speaking to typing.",
    status: "upcoming",
  },
  {
    id: "officer-copilot",
    icon: "officer-copilot",
    title: "Officer Copilot",
    description:
      "A planned companion for field and desk officers to manage service workflows.",
    status: "upcoming",
  },
  {
    id: "analytics-dashboard",
    icon: "analytics-dashboard",
    title: "Analytics Dashboard",
    description:
      "A planned dashboard for district and state-level service insights.",
    status: "upcoming",
  },
];
