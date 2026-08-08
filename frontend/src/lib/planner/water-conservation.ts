import "server-only";

import type { Language } from "@/constants/translations";
import type { WaterConservationPlannerSelection } from "@/types/chat";

const PLANNER_SELECTIONS: Record<
  WaterConservationPlannerSelection,
  Record<Language, { query: string; prompt: string }>
> = {
  "household-water-conservation": {
    en: {
      query: "household water conservation",
      prompt: "I selected guided household water conservation.",
    },
    hi: {
      query: "घरेलू जल संरक्षण",
      prompt: "मैंने निर्देशित घरेलू जल संरक्षण चुना है।",
    },
  },
  "rainwater-harvesting": {
    en: {
      query: "rainwater harvesting",
      prompt: "I selected guided rainwater harvesting information.",
    },
    hi: {
      query: "वर्षा जल संचयन",
      prompt: "मैंने निर्देशित वर्षा जल संचयन जानकारी चुनी है।",
    },
  },
};

const PLANNER_RESPONSES: Record<WaterConservationPlannerSelection, Record<Language, string>> = {
  "household-water-conservation": {
    en: [
      "Water conservation and minimising wastage are central objectives of the National Water Mission. For a household, the available official information focuses on careful water use and avoiding unnecessary wastage.",
      "\nWhat you can do:\n• Use water carefully during everyday household use.\n• Look for and avoid situations where water is being used unnecessarily.\n• Treat water conservation as a shared citizen action, alongside efforts to augment and preserve water resources.\n• Support conservation-focused action in your household and community where appropriate.",
      "\nAvailable official context: The Mission promotes citizen and state action for water conservation, augmentation, and preservation.",
      "\nLimitation: This is general household guidance only. The verified information does not set local requirements, numerical targets, technical methods, or local implementation rules.",
    ].join(""),
    hi: [
      "राष्ट्रीय जल मिशन जल संरक्षण और पानी की बर्बादी कम करने को प्रमुख उद्देश्य मानता है। घर-परिवार के लिए उपलब्ध आधिकारिक जानकारी पानी के सावधानीपूर्ण उपयोग और अनावश्यक बर्बादी से बचने पर केंद्रित है।",
      "\nआप क्या कर सकते हैं:\n• रोज़मर्रा के घरेलू उपयोग में पानी का सावधानी से उपयोग करें।\n• उन स्थितियों को पहचानें और उनसे बचें जहाँ पानी का अनावश्यक उपयोग हो रहा हो।\n• जल संरक्षण को नागरिक कार्रवाई का साझा कार्य मानें तथा जल संवर्धन और संरक्षण के प्रयासों का समर्थन करें।\n• जहाँ उपयुक्त हो, घर और समुदाय में संरक्षण-केंद्रित कार्रवाई को समर्थन दें।",
      "\nउपलब्ध आधिकारिक संदर्भ: मिशन जल संरक्षण, संवर्धन और संरक्षण के लिए नागरिकों तथा राज्यों की कार्रवाई को बढ़ावा देता है।",
      "\nसीमा: यह केवल सामान्य घरेलू मार्गदर्शन है। सत्यापित जानकारी में स्थानीय आवश्यकताएँ, संख्यात्मक लक्ष्य, तकनीकी तरीके या स्थानीय कार्यान्वयन नियम नहीं हैं।",
    ].join(""),
  },
  "rainwater-harvesting": {
    en: [
      "In the available official information, rainwater harvesting and artificial recharge of groundwater are identified as water-resource measures. The Department promotes awareness of these measures to help meet present and future water needs.",
      "\nWhat you can do:\n• Learn about rainwater harvesting as a water-resource conservation measure.\n• Learn how artificial recharge of groundwater is connected to this broader conservation context.\n• Support awareness of water conservation, rainwater harvesting, and groundwater recharge among people around you.\n• Use official information as a starting point before considering any local implementation.",
      "\nAvailable official context: The Department's awareness objectives include the necessity of adopting measures for rainwater harvesting and artificial recharge of groundwater.",
      "\nLimitation: The verified information provides basic conservation context only. It does not provide site design, installation specifications, permissions, costs, or local implementation requirements.",
    ].join(""),
    hi: [
      "उपलब्ध आधिकारिक जानकारी में वर्षा जल संचयन और भूजल का कृत्रिम पुनर्भरण जल संसाधन उपायों के रूप में बताए गए हैं। विभाग वर्तमान और भविष्य की जल आवश्यकताओं में सहायता के लिए इन उपायों के प्रति जागरूकता को बढ़ावा देता है।",
      "\nआप क्या कर सकते हैं:\n• जल संसाधन संरक्षण के उपाय के रूप में वर्षा जल संचयन के बारे में जानकारी प्राप्त करें।\n• समझें कि भूजल का कृत्रिम पुनर्भरण इस व्यापक संरक्षण संदर्भ से कैसे जुड़ा है।\n• अपने आसपास जल संरक्षण, वर्षा जल संचयन और भूजल पुनर्भरण के प्रति जागरूकता को समर्थन दें।\n• स्थानीय कार्यान्वयन पर विचार करने से पहले आधिकारिक जानकारी को शुरुआती संदर्भ के रूप में उपयोग करें।",
      "\nउपलब्ध आधिकारिक संदर्भ: विभाग के जागरूकता उद्देश्यों में वर्षा जल संचयन और भूजल के कृत्रिम पुनर्भरण के उपाय अपनाने की आवश्यकता शामिल है।",
      "\nसीमा: सत्यापित जानकारी केवल संरक्षण का मूल संदर्भ देती है। इसमें स्थल का डिज़ाइन, स्थापना विनिर्देश, अनुमति, लागत या स्थानीय कार्यान्वयन आवश्यकताएँ नहीं हैं।",
    ].join(""),
  },
};

export function isWaterConservationPlannerSelection(
  value: unknown
): value is WaterConservationPlannerSelection {
  return value === "household-water-conservation" || value === "rainwater-harvesting";
}

/** Maps an approved selection to server-owned retrieval and provider input. */
export function getWaterConservationPlannerRequest(
  selection: WaterConservationPlannerSelection,
  language: Language
) {
  return PLANNER_SELECTIONS[selection][language];
}

/** Bounded bilingual guidance derived only from the corresponding verified document. */
export function getWaterConservationPlannerResponse(
  selection: WaterConservationPlannerSelection,
  language: Language
): string {
  return PLANNER_RESPONSES[selection][language];
}
