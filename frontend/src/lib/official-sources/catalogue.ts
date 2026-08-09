import "server-only";

import type { Language } from "@/constants/translations";

export type OfficialSourceCategory =
  | "jal-jeevan-mission"
  | "water-conservation"
  | "rainwater-harvesting"
  | "water-quality-monitoring";

export type OfficialSourceCatalogueEntry = {
  id: string;
  title: string;
  description: string;
  url: string;
  publisher: string;
  language: Language;
  category: OfficialSourceCategory;
  status: "verified" | "approved";
  lastVerifiedAt: string;
  keywords: string[];
};

/**
 * Static, human-verified official resources. This is not a search index and
 * is intentionally separate from knowledge documents and AI grounding.
 */
export const OFFICIAL_SOURCE_CATALOGUE: readonly OfficialSourceCatalogueEntry[] = [
  {
    id: "jjm-overview-en",
    title: "Jal Jeevan Mission",
    description: "Official overview of Jal Jeevan Mission and its source-sustainability measures.",
    url: "https://jaljeevanmission.gov.in/",
    publisher: "National Jal Jeevan Mission, Department of Drinking Water and Sanitation, Ministry of Jal Shakti",
    language: "en",
    category: "jal-jeevan-mission",
    status: "verified",
    lastVerifiedAt: "2026-08-08",
    keywords: ["jal jeevan mission", "jjm", "rural water supply"],
  },
  {
    id: "jjm-overview-hi",
    title: "जल जीवन मिशन: सामान्य जानकारी",
    description: "जल जीवन मिशन और स्रोत स्थिरता उपायों की आधिकारिक सामान्य जानकारी।",
    url: "https://jaljeevanmission.gov.in/",
    publisher: "National Jal Jeevan Mission, Department of Drinking Water and Sanitation, Ministry of Jal Shakti",
    language: "hi",
    category: "jal-jeevan-mission",
    status: "verified",
    lastVerifiedAt: "2026-08-08",
    keywords: ["जल जीवन मिशन", "जेजेएम", "ग्रामीण जल आपूर्ति"],
  },
  {
    id: "water-conservation-en",
    title: "Implementation of National Water Mission",
    description: "Official information on water conservation and related National Water Mission activities.",
    url: "https://www.jalshakti-dowr.gov.in/offerings/schemes-and-services/details/implementation-of-national-water-mission-wNwETNtQWa",
    publisher: "Department of Water Resources, River Development and Ganga Rejuvenation, Ministry of Jal Shakti",
    language: "en",
    category: "water-conservation",
    status: "verified",
    lastVerifiedAt: "2026-08-08",
    keywords: ["water conservation", "save water", "national water mission"],
  },
  {
    id: "water-conservation-hi",
    title: "राष्ट्रीय जल मिशन का कार्यान्वयन",
    description: "जल संरक्षण और राष्ट्रीय जल मिशन की संबंधित गतिविधियों की आधिकारिक जानकारी।",
    url: "https://www.jalshakti-dowr.gov.in/offerings/schemes-and-services/details/implementation-of-national-water-mission-wNwETNtQWa",
    publisher: "Department of Water Resources, River Development and Ganga Rejuvenation, Ministry of Jal Shakti",
    language: "hi",
    category: "water-conservation",
    status: "verified",
    lastVerifiedAt: "2026-08-08",
    keywords: ["जल संरक्षण", "पानी बचाना", "राष्ट्रीय जल मिशन"],
  },
  {
    id: "rainwater-harvesting-en",
    title: "Information, Education and Communication",
    description: "Official awareness information covering rainwater harvesting and groundwater recharge.",
    url: "https://www.jalshakti-dowr.gov.in/offerings/schemes-and-services/details/information-education-and-communication-QO5ATNtQWa",
    publisher: "Department of Water Resources, River Development and Ganga Rejuvenation, Ministry of Jal Shakti",
    language: "en",
    category: "rainwater-harvesting",
    status: "verified",
    lastVerifiedAt: "2026-08-08",
    keywords: ["rainwater harvesting", "rain water harvesting", "groundwater recharge"],
  },
  {
    id: "rainwater-harvesting-hi",
    title: "सूचना, शिक्षा और संचार",
    description: "वर्षा जल संचयन और भूजल पुनर्भरण से जुड़ी आधिकारिक जागरूकता जानकारी।",
    url: "https://www.jalshakti-dowr.gov.in/offerings/schemes-and-services/details/information-education-and-communication-QO5ATNtQWa",
    publisher: "Department of Water Resources, River Development and Ganga Rejuvenation, Ministry of Jal Shakti",
    language: "hi",
    category: "rainwater-harvesting",
    status: "verified",
    lastVerifiedAt: "2026-08-08",
    keywords: ["वर्षा जल संचयन", "बारिश का पानी", "भूजल पुनर्भरण"],
  },
  {
    id: "water-quality-monitoring-en",
    title: "Drinking Water Quality Monitoring & Surveillance Framework",
    description: "Official general information about rural drinking-water quality monitoring and surveillance.",
    url: "https://jaljeevanmission.gov.in/sites/default/files/manual_document/WQMS-Framework.pdf",
    publisher: "National Jal Jeevan Mission, Department of Drinking Water and Sanitation, Ministry of Jal Shakti",
    language: "en",
    category: "water-quality-monitoring",
    status: "verified",
    lastVerifiedAt: "2026-08-08",
    keywords: ["water quality monitoring", "water quality testing", "water surveillance"],
  },
  {
    id: "water-quality-monitoring-hi",
    title: "पेयजल गुणवत्ता निगरानी और सर्विलांस रूपरेखा",
    description: "ग्रामीण पेयजल गुणवत्ता निगरानी और सर्विलांस की आधिकारिक सामान्य जानकारी।",
    url: "https://jaljeevanmission.gov.in/sites/default/files/manual_document/WQMS-Framework.pdf",
    publisher: "National Jal Jeevan Mission, Department of Drinking Water and Sanitation, Ministry of Jal Shakti",
    language: "hi",
    category: "water-quality-monitoring",
    status: "verified",
    lastVerifiedAt: "2026-08-08",
    keywords: ["जल गुणवत्ता निगरानी", "जल गुणवत्ता परीक्षण", "जल सर्विलांस"],
  },
];
