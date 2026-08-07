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
    nextMilestone: string;
    attachFile: string;
    voiceInput: string;
    sendMessage: string;
    askLabel: string;
    placeholder: string;
    prototypeNotice: string;
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
      description: "JalSarthi AI helps citizens discover government water schemes, access official information, draft complaints, search public resources, and receive reliable guidance powered by the Ministry of Jal Shakti knowledge base.",
      askAssistant: "Ask JalSarthi AI",
      exploreServices: "Explore Services",
      trustBadges: ["Ministry of Jal Shakti", "AI-Powered • Citizen-First"],
      assistantName: "JalSarthi AI Assistant",
      demoQuestion: "How do I apply for the Jal Jeevan Mission scheme in my district?",
      demoResponse: "I can help you with eligibility, required documents, application steps, and the nearest implementing authority for your district.",
    },
    capabilities: {
      heading: "What JalSarthi AI Can Do",
      description: "A focused set of AI-assisted capabilities built around real citizen needs in water governance.",
      items: [
        { title: "Scheme Guidance", description: "Step-by-step guidance on eligibility, documentation and application process for water-related government schemes." },
        { title: "AI Water Assistant", description: "Conversational assistant that answers citizen queries on water supply, quality and governance in plain language." },
        { title: "Complaint Drafting", description: "Helps citizens draft clear, formal complaints for water-related grievances, ready to submit to the right authority." },
        { title: "Voice Assistant", description: "Voice-based interaction designed for accessibility, including low-literacy and regional-language users." },
        { title: "Official Document Search", description: "Quickly locate relevant circulars, guidelines and notifications from the Ministry's knowledge base." },
        { title: "Water Conservation Advisor", description: "Practical, localized advice on water conservation and sustainable usage for households and communities." },
      ],
    },
    howItWorks: {
      heading: "How JalSarthi Works",
      description: "A transparent flow from citizen query to a verified, ministry-grounded response.",
      steps: [
        { title: "Citizen", description: "Asks a question in their own words, by text or voice." },
        { title: "AI", description: "JalSarthi AI interprets the query and identifies the right context." },
        { title: "Ministry Knowledge", description: "Cross-checks against Ministry schemes, documents and guidelines." },
        { title: "Verified Response", description: "Delivers a clear, grounded answer citizens can act on." },
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
        "government-knowledge": { title: "Government Knowledge", description: "Verified schemes, policies, and Jal Shakti guidelines, kept current and sourced directly from official documentation." },
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
      statusItems: [{ label: "AI Response Engine", value: "Coming Soon" }, { label: "Knowledge Base", value: "Ready" }, { label: "Government Schemes", value: "Loaded" }, { label: "Voice Assistant", value: "Coming Soon" }],
      welcome: "Welcome to JalSarthi AI", welcomeDescription: "JalSarthi AI is your intelligent Government assistant that helps citizens discover schemes, resolve water-related queries, draft complaints, and access verified Ministry information through natural conversation.",
      quickServicesLabel: "Quick services", quickServices: ["Scheme Search", "Complaint Draft", "Water Saving Tips", "Policies", "Emergency Contacts", "FAQ"],
      conversationArea: "Conversation area", emptyTitle: "Your conversation starts here", emptyDescription: "JalSarthi AI can assist citizens with government water schemes, policies, complaint drafting and official guidance.",
      tryAsking: "Try asking", suggestions: ["How do I apply for Jal Jeevan Mission?", "Find rainwater harvesting guidelines.", "Draft a complaint about water supply.", "Explain Atal Bhujal Yojana.", "Water conservation tips.", "Check eligibility for PMKSY."],
      nextMilestone: "Available in next milestone", attachFile: "Attach a file", voiceInput: "Voice input", sendMessage: "Send message", askLabel: "Ask JalSarthi AI", placeholder: "Ask about water schemes, complaints, policies, conservation or government services...", prototypeNotice: "Chat functionality will be enabled in a future milestone.",
    },
  },
  hi: {
    accessibility: { skipToContent: "मुख्य सामग्री पर जाएँ" },
    navbar: {
      government: "भारत सरकार · जल शक्ति मंत्रालय", skipToContent: "मुख्य सामग्री पर जाएँ", switchLanguage: "भाषा बदलें", home: "होम", capabilities: "क्षमताएँ", howItWorks: "कार्यप्रणाली", benefits: "लाभ", about: "परिचय", ministry: "जल शक्ति मंत्रालय", officialAssistant: "आधिकारिक एआई सहायक", talkToAssistant: "जलसारथी से बात करें", openMenu: "मेनू खोलें", closeMenu: "मेनू बंद करें", primaryNavigation: "मुख्य नेविगेशन",
    },
    hero: {
      eyebrow: "भारत सरकार • जल शक्ति मंत्रालय", headingStart: "हर नागरिक को सशक्त बनाना", headingAccent: "बुद्धिमान जल शासन के साथ", description: "जलसारथी एआई नागरिकों को सरकारी जल योजनाएँ खोजने, आधिकारिक जानकारी पाने, शिकायतें लिखने, सार्वजनिक संसाधन खोजने और जल शक्ति मंत्रालय के ज्ञान आधार से विश्वसनीय मार्गदर्शन पाने में सहायता करता है।", askAssistant: "जलसारथी एआई से पूछें", exploreServices: "सेवाएँ देखें", trustBadges: ["जल शक्ति मंत्रालय", "एआई-संचालित • नागरिक-केंद्रित"], assistantName: "जलसारथी एआई सहायक", demoQuestion: "मैं अपने जिले में जल जीवन मिशन योजना के लिए कैसे आवेदन करूँ?", demoResponse: "मैं पात्रता, आवश्यक दस्तावेज़, आवेदन के चरण और आपके जिले की निकटतम कार्यान्वयन प्राधिकरण की जानकारी में सहायता कर सकता हूँ।",
    },
    capabilities: {
      heading: "जलसारथी एआई क्या कर सकता है", description: "जल शासन में नागरिकों की वास्तविक आवश्यकताओं पर आधारित एआई-सहायित क्षमताओं का एक केंद्रित समूह।",
      items: [
        { title: "योजना मार्गदर्शन", description: "जल-संबंधी सरकारी योजनाओं की पात्रता, दस्तावेज़ों और आवेदन प्रक्रिया पर चरण-दर-चरण मार्गदर्शन।" },
        { title: "एआई जल सहायक", description: "सरल भाषा में जल आपूर्ति, गुणवत्ता और शासन संबंधी नागरिक प्रश्नों का उत्तर देने वाला संवादात्मक सहायक।" },
        { title: "शिकायत प्रारूपण", description: "नागरिकों को जल-संबंधी समस्याओं के लिए स्पष्ट, औपचारिक शिकायतें तैयार करने में सहायता।" },
        { title: "वॉयस सहायक", description: "कम साक्षरता और क्षेत्रीय भाषा उपयोगकर्ताओं सहित सुलभता के लिए बनाया गया वॉइस-आधारित संवाद।" },
        { title: "आधिकारिक दस्तावेज़ खोज", description: "मंत्रालय के ज्ञान आधार से प्रासंगिक परिपत्र, दिशा-निर्देश और अधिसूचनाएँ तुरंत खोजें।" },
        { title: "जल संरक्षण सलाहकार", description: "घरों और समुदायों के लिए जल संरक्षण और सतत उपयोग पर व्यावहारिक, स्थानीयकृत सलाह।" },
      ],
    },
    howItWorks: {
      heading: "जलसारथी कैसे काम करता है", description: "नागरिक के प्रश्न से सत्यापित, मंत्रालय-आधारित उत्तर तक एक पारदर्शी प्रक्रिया।",
      steps: [
        { title: "नागरिक", description: "अपने शब्दों में, टेक्स्ट या वॉइस द्वारा प्रश्न पूछता है।" },
        { title: "एआई", description: "जलसारथी एआई प्रश्न को समझता है और सही संदर्भ पहचानता है।" },
        { title: "मंत्रालय ज्ञान", description: "मंत्रालय की योजनाओं, दस्तावेज़ों और दिशा-निर्देशों से जाँच करता है।" },
        { title: "सत्यापित उत्तर", description: "नागरिकों के लिए स्पष्ट और उपयोगी उत्तर प्रदान करता है।" },
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
        "government-knowledge": { title: "सरकारी ज्ञान", description: "आधिकारिक दस्तावेज़ों से प्राप्त और अद्यतन योजनाएँ, नीतियाँ तथा जल शक्ति दिशा-निर्देश।" },
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
      status: "स्थिति", statusItems: [{ label: "एआई उत्तर इंजन", value: "जल्द आ रहा है" }, { label: "ज्ञान आधार", value: "तैयार" }, { label: "सरकारी योजनाएँ", value: "लोड की गईं" }, { label: "वॉयस सहायक", value: "जल्द आ रहा है" }], welcome: "जलसारथी एआई में आपका स्वागत है", welcomeDescription: "जलसारथी एआई आपका बुद्धिमान सरकारी सहायक है, जो नागरिकों को योजनाएँ खोजने, जल-संबंधी प्रश्नों का समाधान करने, शिकायतें तैयार करने और प्राकृतिक संवाद के माध्यम से सत्यापित मंत्रालय जानकारी तक पहुँचने में मदद करता है।", quickServicesLabel: "त्वरित सेवाएँ", quickServices: ["योजना खोज", "शिकायत प्रारूप", "जल बचत सुझाव", "नीतियाँ", "आपातकालीन संपर्क", "सामान्य प्रश्न"], conversationArea: "बातचीत क्षेत्र", emptyTitle: "आपकी बातचीत यहाँ से शुरू होती है", emptyDescription: "जलसारथी एआई नागरिकों को सरकारी जल योजनाओं, नीतियों, शिकायत प्रारूपण और आधिकारिक मार्गदर्शन में सहायता कर सकता है।", tryAsking: "पूछकर देखें", suggestions: ["जल जीवन मिशन के लिए कैसे आवेदन करूँ?", "वर्षा जल संचयन दिशानिर्देश खोजें।", "जल आपूर्ति की शिकायत तैयार करें।", "अटल भूजल योजना समझाएँ।", "जल संरक्षण के सुझाव।", "पीएमकेएसवाई की पात्रता जाँचें।"], nextMilestone: "अगले चरण में उपलब्ध", attachFile: "फ़ाइल संलग्न करें", voiceInput: "वॉइस इनपुट", sendMessage: "संदेश भेजें", askLabel: "जलसारथी एआई से पूछें", placeholder: "जल योजनाओं, शिकायतों, नीतियों, संरक्षण या सरकारी सेवाओं के बारे में पूछें...", prototypeNotice: "चैट सुविधा भविष्य के चरण में उपलब्ध होगी।",
    },
  },
};
