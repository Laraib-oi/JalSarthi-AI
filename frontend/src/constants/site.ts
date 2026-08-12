/**
 * Central brand + metadata constants.
 * Keeping these out of components means a rename or copy change never
 * requires touching JSX.
 */
export const SITE = {
  name: "JalSarthi",
  assistantName: "JalSarthi AI",
  ministry: "Ministry of Jal Shakti",
  country: "India",
  tagline: "Empowering Citizens Through Intelligent Water Governance",
  description:
    "JalSarthi AI is a Ministry of Jal Shakti domain-inspired assistant for water-related information and complaint-draft assistance.",
} as const;
