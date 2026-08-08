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
      "Water conservation means using water thoughtfully and reducing avoidable wastage in everyday life. It supports the National Water Mission's broader focus on conservation, efficient use, and a water-saving culture.",
      "\nWhat you can do:\n• Notice where water is being used unnecessarily during routine household activities, and avoid that wastage.\n• Check for leaks and have them repaired; leakage reduction is an important water-efficiency practice.\n• Prefer water-efficient fixtures or devices where appropriate for your household.\n• Where it is safe and suitable, consider whether water can be reused for another appropriate purpose instead of being discarded immediately.\n• Pay attention to household water use and encourage family members to use water carefully.\n• Share practical water-saving information with neighbours or community groups to help build awareness.",
      "\nWhy this matters: Reducing waste, improving efficiency, and building awareness are all part of demand-management and water-conservation efforts. Individual household choices can reinforce wider citizen action to conserve, augment, and preserve water resources.",
      "\nImportant note: This is general household guidance. It does not set numerical targets, prescribe particular products or reuse methods, or replace any local safety or implementation requirements.",
    ].join(""),
    hi: [
      "जल संरक्षण का अर्थ है रोज़मर्रा के जीवन में पानी का सोच-समझकर उपयोग करना और बचाई जा सकने वाली बर्बादी को कम करना। यह राष्ट्रीय जल मिशन के संरक्षण, दक्ष उपयोग और पानी बचाने की संस्कृति के व्यापक उद्देश्य से जुड़ा है।",
      "\nआप क्या कर सकते हैं:\n• रोज़मर्रा के घरेलू कामों में उन जगहों पर ध्यान दें जहाँ पानी अनावश्यक रूप से खर्च हो रहा हो और उस बर्बादी से बचें।\n• रिसाव की जाँच करें और उसकी मरम्मत कराएँ; रिसाव कम करना जल-दक्षता का महत्वपूर्ण उपाय है।\n• अपने घर के लिए उपयुक्त होने पर जल-दक्ष फिटिंग या उपकरणों को प्राथमिकता दें।\n• जहाँ सुरक्षित और उपयुक्त हो, देखें कि पानी को तुरंत फेंकने के बजाय किसी अन्य उचित काम में फिर से उपयोग किया जा सकता है या नहीं।\n• घर में पानी के उपयोग पर ध्यान दें और परिवार के सदस्यों को सावधानी से पानी इस्तेमाल करने के लिए प्रोत्साहित करें।\n• जागरूकता बढ़ाने के लिए पड़ोसियों या समुदाय समूहों के साथ पानी बचाने की व्यावहारिक जानकारी साझा करें।",
      "\nयह क्यों महत्वपूर्ण है: बर्बादी कम करना, दक्षता बढ़ाना और जागरूकता विकसित करना मांग-प्रबंधन और जल संरक्षण के प्रयासों का हिस्सा हैं। घर-परिवार के निर्णय जल संरक्षण, संवर्धन और संरक्षण के लिए व्यापक नागरिक कार्रवाई को मजबूत कर सकते हैं।",
      "\nमहत्वपूर्ण नोट: यह सामान्य घरेलू मार्गदर्शन है। इसमें संख्यात्मक लक्ष्य, किसी विशेष उत्पाद या पुन: उपयोग की विधि का निर्देश नहीं दिया गया है और यह स्थानीय सुरक्षा या कार्यान्वयन आवश्यकताओं का विकल्प नहीं है।",
    ].join(""),
  },
  "rainwater-harvesting": {
    en: [
      "Rainwater harvesting is a way to conserve rainfall where it falls. In the available official context, it includes broad approaches such as rooftop rainwater harvesting and can be linked to groundwater recharge, helping support water availability and groundwater sustainability.",
      "\nWhat you can do:\n• Learn about conserving rainfall where it falls as a water-conservation approach.\n• Explore rooftop rainwater harvesting as a broad option for collecting rainfall from a roof.\n• Understand that some rainwater-harvesting approaches may support groundwater recharge.\n• Treat recharge options such as pits, trenches, or wells as examples only—not a ready-made design for every property.\n• Discuss rainwater harvesting and groundwater recharge with your household, neighbourhood, or community to build awareness and participation.\n• Use official information as a starting point before considering any local implementation.",
      "\nWhy this matters: The Department identifies rainwater harvesting and artificial recharge of groundwater as water-resource measures. Conserving rainfall locally and strengthening awareness can support broader efforts to meet present and future water needs.",
      "\nImportant note: The right approach depends on local site, groundwater, and other conditions. This guidance does not provide a design, dimensions, permissions, costs, or a recommendation that a particular recharge structure is suitable for your property.",
    ].join(""),
    hi: [
      "वर्षा जल संचयन का अर्थ है जहाँ वर्षा होती है वहीं उसके पानी का संरक्षण करना। उपलब्ध आधिकारिक संदर्भ में छत से वर्षा जल संचयन जैसे व्यापक उपाय शामिल हैं और इसका संबंध भूजल पुनर्भरण से हो सकता है, जो जल उपलब्धता और भूजल की स्थिरता में सहायक है।",
      "\nआप क्या कर सकते हैं:\n• जल संरक्षण के उपाय के रूप में जहाँ वर्षा होती है वहीं वर्षा जल को संरक्षित करने के बारे में जानें।\n• छत से वर्षा जल संचयन को छत पर गिरने वाले वर्षा जल को एकत्र करने के व्यापक विकल्प के रूप में समझें।\n• समझें कि वर्षा जल संचयन के कुछ तरीके भूजल पुनर्भरण में सहायक हो सकते हैं।\n• गड्ढे, खाइयाँ या कुएँ जैसे पुनर्भरण विकल्पों को केवल उदाहरण के रूप में देखें—हर संपत्ति के लिए तैयार डिज़ाइन के रूप में नहीं।\n• जागरूकता और भागीदारी बढ़ाने के लिए घर, पड़ोस या समुदाय में वर्षा जल संचयन और भूजल पुनर्भरण पर चर्चा करें।\n• स्थानीय कार्यान्वयन पर विचार करने से पहले आधिकारिक जानकारी को शुरुआती संदर्भ के रूप में उपयोग करें।",
      "\nयह क्यों महत्वपूर्ण है: विभाग वर्षा जल संचयन और भूजल के कृत्रिम पुनर्भरण को जल संसाधन उपायों के रूप में पहचानता है। स्थानीय रूप से वर्षा जल का संरक्षण और जागरूकता बढ़ाना वर्तमान और भविष्य की जल आवश्यकताओं के व्यापक प्रयासों को समर्थन दे सकता है।",
      "\nमहत्वपूर्ण नोट: उपयुक्त तरीका स्थानीय स्थल, भूजल और अन्य परिस्थितियों पर निर्भर करता है। यह मार्गदर्शन डिज़ाइन, आयाम, अनुमति या लागत नहीं बताता और न ही किसी विशेष पुनर्भरण संरचना को आपकी संपत्ति के लिए उपयुक्त घोषित करता है।",
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
