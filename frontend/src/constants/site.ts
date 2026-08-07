/**
 * Central brand + metadata constants.
 * Keeping these out of components means a rename or copy change never
 * requires touching JSX.
 */
export const SITE = {
  name: "JalSarthi",
  assistantName: "JalSarthi AI",
  ministry: "Ministry of Jal Shakti",
  country: "Government of India",
  tagline: "Empowering Citizens Through Intelligent Water Governance",
  description:
    "JalSarthi AI is an intelligent virtual assistant that helps citizens access water-related information, government schemes, complaint assistance and official guidance.",
  url: "https://jalsarthi.gov.in",
} as const;
