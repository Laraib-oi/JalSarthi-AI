import type { FeatureIconName } from "@/types";

export type Language = "en" | "hi";

type Translation = {
  accessibility: { skipToContent: string };
  navbar: {
    government: string;
    skipToContent: string;
    switchLanguage: string;
    home: string;
    capabilities: string;
    howItWorks: string;
    benefits: string;
    about: string;
    ministry: string;
    officialAssistant: string;
    talkToAssistant: string;
    openMenu: string;
    closeMenu: string;
    primaryNavigation: string;
  };
  hero: {
    eyebrow: string;
    headingStart: string;
    headingAccent: string;
    description: string;
    askAssistant: string;
    exploreServices: string;
    trustBadges: string[];
    assistantName: string;
    demoQuestion: string;
    demoResponse: string;
  };
  capabilities: { heading: string; description: string; items: { title: string; description: string }[] };
  howItWorks: { heading: string; description: string; steps: { title: string; description: string }[] };
  benefits: { heading: string; description: string; groups: { title: string; benefits: string[] }[] };
  statistics: { heading: string; description: string; labels: string[] };
  features: {
    heading: string;
    description: string;
    comingSoon: string;
    items: Record<FeatureIconName, { title: string; description: string }>;
  };
  cta: { heading: string; description: string; button: string };
  footer: {
    ministry: string;
    portal: string;
    description: string;
    quickLinks: string;
    services: string;
    howItWorks: string;
    impact: string;
    assistant: string;
    aboutPrototype: string;
    prototypeNotice: string;
    repository: string;
  };
  assistant: {
    status: string;
    statusItems: { label: string; value: string }[];
    welcome: string;
    welcomeDescription: string;
    quickServicesLabel: string;
    quickServices: string[];
    conversationArea: string;
    emptyTitle: string;
    emptyDescription: string;
    tryAsking: string;
    suggestions: string[];
    attachFile: string;
    voiceInput: string;
    sendMessage: string;
    askLabel: string;
    placeholder: string;
    chatNotice: string;
    loading: string;
    error: string;
    unavailable: string;
    source: string;
    viewSource: string;
    limitedInformation: string;
  };
};

export const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    accessibility: { skipToContent: "Skip to main content" },
    navbar: {
      government: "Government of India · Ministry of Jal Shakti",
      skipToContent: "Skip to content",
      switchLanguage: "Switch language",
      home: "Home",
      capabilities: "Capabilities",
      howItWorks: "How It Works",
      benefits: "Benefits",
      about: "About",
      ministry: "Ministry of Jal Shakti",
      officialAssistant: "Official AI Assistant",
      talkToAssistant: "Talk to JalSarthi",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      primaryNavigation: "Primary",
    },
    hero: {
      eyebrow: "Government of India • Ministry of Jal Shakti",
      headingStart: "Empowering Every Citizen with",
      headingAccent: "Intelligent Water Governance",
      description: "JalSarthi AI offers a simple place to explore general water-related questions in plain language. Official-document retrieval and other assisted services are planned for a later stage.",
      askAssistant: "Ask JalSarthi AI",
      exploreServices: "Explore Services",
      trustBadges: ["Ministry of Jal Shakti", "AI-Powered • Citizen-First"],
      assistantName: "JalSarthi AI Assistant",
      demoQuestion: "What are some practical ways to conserve water at home?",
      demoResponse: "I can share general water-conservation ideas and explain when you should check with a relevant local authority for official information.",
    },
    capabilities: {
      heading: "What JalSarthi AI Can Do",
      description: "A focused set of AI-assisted capabilities built around real citizen needs in water governance.",
      items: [
        { title: "General Water Information", description: "Plain-language explanations of everyday water topics and conservation practices." },
        { title: "AI Water Assistant", description: "Conversational assistance for general water-related questions in plain language." },
        { title: "Guided Next Steps", description: "Helps citizens identify when to contact the appropriate official or local authority." },
        { title: "Voice Assistant", description: "Voice-based interaction designed for accessibility, including low-literacy and regional-language users." },
        { title: "Document Search", description: "Official-document retrieval is planned once the knowledge layer is available." },
        { title: "Water Conservation Advisor", description: "Practical, localized advice on water conservation and sustainable usage for households and communities." },
      ],
    },
    howItWorks: {
      heading: "How JalSarthi Works",
      description: "A transparent flow from a citizen query to a general AI response, with clear limits until a knowledge layer is added.",
      steps: [
        { title: "Citizen", description: "Asks a question in their own words, by text or voice." },
        { title: "AI", description: "JalSarthi AI interprets the query and prepares a general response." },
        { title: "Knowledge Layer", description: "Official-document retrieval is not enabled yet." },
        { title: "Clear Response", description: "Delivers a concise answer and points to an authority when verification is needed." },
      ],
    },
    benefits: {
      heading: "Built for Everyone Involved",
      description: "Designed to create value across citizens, officers and the Ministry.",
      groups: [
        { title: "Citizens", benefits: ["Simple, jargon-free answers to water scheme queries", "Faster, guided complaint drafting", "24/7 availability in multiple languages"] },
        { title: "Government Officers", benefits: ["Reduced repetitive query load", "Structured, pre-drafted complaint summaries", "Faster access to relevant circulars and guidelines"] },
        { title: "Ministry", benefits: ["Consistent, standardized citizen communication", "Better visibility into common citizen concerns", "Scalable first point of contact for water governance"] },
      ],
    },
    statistics: {
      heading: "Illustrative Impact Metrics",
      description: "Demonstration figures only — not live production data.",
      labels: ["Simulated Citizen Queries Handled", "Government Schemes Indexed", "Languages Planned for Support", "AI Availability"],
    },
    features: {
      heading: "Transforming Water Governance Through AI",
      description: "Each capability is designed around a real interaction a citizen or officer already has with water governance today — made faster and clearer.",
      comingSoon: "Coming soon",
      items: {
        "ai-assistant": { title: "AI Assistant", description: "A conversational guide that answers water-related questions in plain language, in the citizen's own words." },
        "government-knowledge": { title: "Government Knowledge", description: "A planned knowledge layer for source-backed answers from official documentation." },
        "complaint-generator": { title: "Complaint Generator", description: "Turns a citizen's description of a water issue into a properly formatted complaint, ready for submission." },
        "voice-assistant": { title: "Voice Assistant", description: "Speak your query in your preferred language — built for citizens who are more comfortable talking than typing." },
        "officer-copilot": { title: "Officer Copilot", description: "A companion for field and desk officers to triage complaints, draft responses, and track resolution status." },
        "analytics-dashboard": { title: "Analytics Dashboard", description: "District and state-level visibility into complaint volumes, scheme reach, and response times." },
      },
    },
    cta: { heading: "Built for every citizen who needs a clear answer on water", description: "JalSarthi AI is being developed as a public digital good under the Ministry of Jal Shakti — starting simple, and growing with the people who use it.", button: "Start Chat with JalSarthi AI" },
    footer: {
      ministry: "Ministry of Jal Shakti",
      portal: "AI-powered Citizen Assistance Portal",
      description: "JalSarthi AI is an intelligent citizen assistance platform designed to simplify access to water-related government services, schemes, information, and grievance support.",
      quickLinks: "Quick Links", services: "Services", howItWorks: "How It Works", impact: "Impact", assistant: "AI Assistant",
      aboutPrototype: "About This Prototype", prototypeNotice: "This prototype has been developed for Hackathon solely for demonstration purposes. It is not an official Government of India service.", repository: "View Project Repository",
    },
    assistant: {
      status: "Status",
      statusItems: [{ label: "AI chat", value: "Available when configured" }, { label: "Conversation", value: "This session only" }, { label: "Knowledge retrieval", value: "Not enabled" }, { label: "Voice input", value: "Not enabled" }],
      welcome: "Welcome to JalSarthi AI", welcomeDescription: "Ask general water-related questions in natural language. Official-document retrieval, scheme-specific guidance, complaint drafting, and voice support are not enabled yet.",
      quickServicesLabel: "Quick prompts", quickServices: ["Water conservation tips", "Rainwater harvesting", "Water quality basics", "Water-saving at home", "Community awareness", "General water question"],
      conversationArea: "Conversation area", emptyTitle: "Your conversation starts here", emptyDescription: "JalSarthi AI can provide general water-related information. It cannot yet verify official documents, local records, or scheme details.",
      tryAsking: "Try asking", suggestions: ["How can I reduce water use at home?", "What is rainwater harvesting?", "What are common causes of water wastage?", "How can a community conserve water?", "What are basic water-quality precautions?", "Why is water conservation important?"],
      attachFile: "Attach a file", voiceInput: "Voice input", sendMessage: "Send message", askLabel: "Ask JalSarthi AI", placeholder: "Ask a general question about water or conservation...", chatNotice: "AI responses are general information and do not use official documents or local records.", loading: "JalSarthi AI is preparing a response…", error: "JalSarthi AI could not respond. Please try again.", unavailable: "AI chat is not configured yet. Please try again after the service is configured.", source: "Source", viewSource: "View source", limitedInformation: "Information is limited to the relevant source context.",
    },
  },
  hi: {
    accessibility: { skipToContent: "मुख्य सामग्री पर जाएँ" },
    navbar: {
      government: "भारत सरकार · जल शक्ति मंत्रालय", skipToContent: "मुख्य सामग्री पर जाएँ", switchLanguage: "भाषा बदलें", home: "होम", capabilities: "क्षमताएँ", howItWorks: "कार्यप्रणाली", benefits: "लाभ", about: "परिचय", ministry: "जल शक्ति मंत्रालय", officialAssistant: "आधिकारिक एआई सहायक", talkToAssistant: "जलसारथी से बात करें", openMenu: "मेनू खोलें", closeMenu: "मेनू बंद करें", primaryNavigation: "मुख्य नेविगेशन",
    },
    hero: {
      eyebrow: "भारत सरकार • जल शक्ति मंत्रालय", headingStart: "हर नागरिक को सशक्त बनाना", headingAccent: "बुद्धिमान जल शासन के साथ", description: "जलसारथी एआई सरल भाषा में सामान्य जल-संबंधी प्रश्नों को समझने का स्थान प्रदान करता है। आधिकारिक दस्तावेज़ खोज और अन्य सहायक सेवाएँ बाद के चरण के लिए नियोजित हैं।", askAssistant: "जलसारथी एआई से पूछें", exploreServices: "सेवाएँ देखें", trustBadges: ["जल शक्ति मंत्रालय", "एआई-संचालित • नागरिक-केंद्रित"], assistantName: "जलसारथी एआई सहायक", demoQuestion: "घर पर पानी बचाने के व्यावहारिक तरीके क्या हैं?", demoResponse: "मैं पानी बचाने के सामान्य उपाय साझा कर सकता हूँ और बता सकता हूँ कि आधिकारिक जानकारी के लिए स्थानीय प्राधिकरण से कब संपर्क करना चाहिए।",
    },
    capabilities: {
      heading: "जलसारथी एआई क्या कर सकता है", description: "जल शासन में नागरिकों की वास्तविक आवश्यकताओं पर आधारित एआई-सहायित क्षमताओं का एक केंद्रित समूह।",
      items: [
        { title: "सामान्य जल जानकारी", description: "रोज़मर्रा के जल विषयों और संरक्षण उपायों की सरल भाषा में व्याख्या।" },
        { title: "एआई जल सहायक", description: "सामान्य जल-संबंधी प्रश्नों के लिए सरल भाषा में संवादात्मक सहायता।" },
        { title: "अगले कदम", description: "नागरिकों को यह समझने में मदद कि उचित आधिकारिक या स्थानीय प्राधिकरण से कब संपर्क करना चाहिए।" },
        { title: "वॉयस सहायक", description: "कम साक्षरता और क्षेत्रीय भाषा उपयोगकर्ताओं सहित सुलभता के लिए बनाया गया वॉइस-आधारित संवाद।" },
        { title: "दस्तावेज़ खोज", description: "ज्ञान परत उपलब्ध होने के बाद आधिकारिक दस्तावेज़ खोज की योजना है।" },
        { title: "जल संरक्षण सलाहकार", description: "घरों और समुदायों के लिए जल संरक्षण और सतत उपयोग पर व्यावहारिक, स्थानीयकृत सलाह।" },
      ],
    },
    howItWorks: {
      heading: "जलसारथी कैसे काम करता है", description: "नागरिक के प्रश्न से सामान्य एआई उत्तर तक एक पारदर्शी प्रक्रिया, जिसमें ज्ञान परत जुड़ने तक सीमाएँ स्पष्ट रहती हैं।",
      steps: [
        { title: "नागरिक", description: "अपने शब्दों में, टेक्स्ट या वॉइस द्वारा प्रश्न पूछता है।" },
        { title: "एआई", description: "जलसारथी एआई प्रश्न को समझता है और सामान्य उत्तर तैयार करता है।" },
        { title: "ज्ञान परत", description: "आधिकारिक दस्तावेज़ खोज अभी सक्षम नहीं है।" },
        { title: "स्पष्ट उत्तर", description: "संक्षिप्त उत्तर देता है और सत्यापन आवश्यक होने पर प्राधिकरण की ओर संकेत करता है।" },
      ],
    },
    benefits: {
      heading: "सभी हितधारकों के लिए निर्मित", description: "नागरिकों, अधिकारियों और मंत्रालय के लिए उपयोगी मूल्य बनाने हेतु डिज़ाइन किया गया।",
      groups: [
        { title: "नागरिक", benefits: ["जल योजनाओं के प्रश्नों के सरल, स्पष्ट उत्तर", "तेज़, निर्देशित शिकायत प्रारूपण", "कई भाषाओं में 24/7 उपलब्धता"] },
        { title: "सरकारी अधिकारी", benefits: ["दोहराए जाने वाले प्रश्नों का कम बोझ", "संरचित, पहले से तैयार शिकायत सारांश", "प्रासंगिक परिपत्रों और दिशा-निर्देशों तक तेज़ पहुँच"] },
        { title: "मंत्रालय", benefits: ["सुसंगत, मानकीकृत नागरिक संचार", "सामान्य नागरिक चिंताओं की बेहतर जानकारी", "जल शासन के लिए संपर्क का विस्तृत पहला बिंदु"] },
      ],
    },
    statistics: { heading: "उदाहरणात्मक प्रभाव आँकड़े", description: "केवल प्रदर्शन के लिए उदाहरणात्मक आँकड़े — लाइव उत्पादन डेटा नहीं।", labels: ["संभाले गए अनुकरणीय नागरिक प्रश्न", "अनुक्रमित सरकारी योजनाएँ", "समर्थन के लिए नियोजित भाषाएँ", "एआई उपलब्धता"] },
    features: {
      heading: "एआई के माध्यम से जल शासन में बदलाव", description: "हर क्षमता जल शासन में नागरिक या अधिकारी की वास्तविक बातचीत को तेज़ और स्पष्ट बनाने के लिए डिज़ाइन की गई है।", comingSoon: "जल्द आ रहा है",
      items: {
        "ai-assistant": { title: "एआई सहायक", description: "नागरिक के अपने शब्दों में जल-संबंधी प्रश्नों का सरल भाषा में उत्तर देने वाला संवादात्मक मार्गदर्शक।" },
        "government-knowledge": { title: "सरकारी ज्ञान", description: "आधिकारिक दस्तावेज़ों से स्रोत-आधारित उत्तरों के लिए नियोजित ज्ञान परत।" },
        "complaint-generator": { title: "शिकायत जनरेटर", description: "नागरिक के जल समस्या विवरण को जमा करने योग्य सही प्रारूप की शिकायत में बदलता है।" },
        "voice-assistant": { title: "वॉयस सहायक", description: "अपनी पसंदीदा भाषा में प्रश्न बोलें — उन नागरिकों के लिए जो टाइप करने की बजाय बोलने में सहज हैं।" },
        "officer-copilot": { title: "अधिकारी सहायक", description: "मैदानी और डेस्क अधिकारियों के लिए शिकायतों की जाँच, उत्तर तैयार करने और समाधान स्थिति देखने का साथी।" },
        "analytics-dashboard": { title: "एनालिटिक्स डैशबोर्ड", description: "शिकायत मात्रा, योजना पहुँच और प्रतिक्रिया समय की जिला व राज्य-स्तरीय जानकारी।" },
      },
    },
    cta: { heading: "जल संबंधी स्पष्ट उत्तर चाहने वाले हर नागरिक के लिए निर्मित", description: "जलसारथी एआई को जल शक्ति मंत्रालय के अंतर्गत एक सार्वजनिक डिजिटल सुविधा के रूप में विकसित किया जा रहा है — सरल शुरुआत के साथ, उपयोगकर्ताओं के साथ बढ़ते हुए।", button: "जलसारथी एआई के साथ चैट शुरू करें" },
    footer: {
      ministry: "जल शक्ति मंत्रालय", portal: "एआई-संचालित नागरिक सहायता पोर्टल", description: "जलसारथी एआई एक बुद्धिमान नागरिक सहायता मंच है, जिसे जल-संबंधी सरकारी सेवाओं, योजनाओं, जानकारी और शिकायत सहायता तक पहुँच सरल बनाने के लिए डिज़ाइन किया गया है।", quickLinks: "त्वरित लिंक", services: "सेवाएँ", howItWorks: "कार्यप्रणाली", impact: "प्रभाव", assistant: "एआई सहायक", aboutPrototype: "इस प्रोटोटाइप के बारे में", prototypeNotice: "यह प्रोटोटाइप केवल प्रदर्शन उद्देश्यों के लिए हैकाथॉन हेतु विकसित किया गया है। यह भारत सरकार की आधिकारिक सेवा नहीं है।", repository: "प्रोजेक्ट रिपॉजिटरी देखें",
    },
    assistant: {
      status: "स्थिति", statusItems: [{ label: "एआई चैट", value: "कॉन्फ़िगर होने पर उपलब्ध" }, { label: "बातचीत", value: "केवल इस सत्र में" }, { label: "ज्ञान खोज", value: "सक्षम नहीं" }, { label: "वॉयस इनपुट", value: "सक्षम नहीं" }], welcome: "जलसारथी एआई में आपका स्वागत है", welcomeDescription: "प्राकृतिक भाषा में सामान्य जल-संबंधी प्रश्न पूछें। आधिकारिक दस्तावेज़ खोज, योजना-विशिष्ट मार्गदर्शन, शिकायत प्रारूपण और वॉयस सहायता अभी सक्षम नहीं हैं।", quickServicesLabel: "त्वरित प्रश्न", quickServices: ["जल संरक्षण सुझाव", "वर्षा जल संचयन", "जल गुणवत्ता की मूल बातें", "घर में पानी बचाना", "सामुदायिक जागरूकता", "सामान्य जल प्रश्न"], conversationArea: "बातचीत क्षेत्र", emptyTitle: "आपकी बातचीत यहाँ से शुरू होती है", emptyDescription: "जलसारथी एआई सामान्य जल-संबंधी जानकारी दे सकता है। यह अभी आधिकारिक दस्तावेज़, स्थानीय रिकॉर्ड या योजना विवरण सत्यापित नहीं कर सकता।", tryAsking: "पूछकर देखें", suggestions: ["मैं घर पर पानी का उपयोग कैसे कम कर सकता हूँ?", "वर्षा जल संचयन क्या है?", "पानी की बर्बादी के सामान्य कारण क्या हैं?", "समुदाय पानी का संरक्षण कैसे कर सकता है?", "जल गुणवत्ता से जुड़ी बुनियादी सावधानियाँ क्या हैं?", "जल संरक्षण क्यों महत्वपूर्ण है?"], attachFile: "फ़ाइल संलग्न करें", voiceInput: "वॉइस इनपुट", sendMessage: "संदेश भेजें", askLabel: "जलसारथी एआई से पूछें", placeholder: "पानी या जल संरक्षण के बारे में सामान्य प्रश्न पूछें...", chatNotice: "एआई उत्तर सामान्य जानकारी हैं और इनमें आधिकारिक दस्तावेज़ या स्थानीय रिकॉर्ड का उपयोग नहीं होता।", loading: "जलसारथी एआई उत्तर तैयार कर रहा है…", error: "जलसारथी एआई उत्तर नहीं दे सका। कृपया फिर से प्रयास करें।", unavailable: "एआई चैट अभी कॉन्फ़िगर नहीं है। सेवा कॉन्फ़िगर होने के बाद फिर से प्रयास करें।", source: "स्रोत", viewSource: "स्रोत देखें", limitedInformation: "जानकारी संबंधित स्रोत के संदर्भ तक सीमित है।",
    },
  },
};
