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
  capabilities: {
    heading: string;
    description: string;
    items: { title: string; description: string }[];
  };
  howItWorks: {
    heading: string;
    description: string;
    steps: { title: string; description: string }[];
  };
  benefits: {
    heading: string;
    description: string;
    groups: { title: string; benefits: string[] }[];
  };
  statistics: { heading: string; description: string; labels: string[] };
  features: {
    heading: string;
    description: string;
    comingSoon: string;
    availableInPrototype: string;
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
    officialSource: string;
    viewSource: string;
    limitedInformation: string;
    officialInformation: {
      eyebrow: string;
      title: string;
      description: string;
      searchLabel: string;
      placeholder: string;
      searchButton: string;
      loading: string;
      resultLabel: string;
      lastVerified: string;
      suggestions: string[];
    };
    planner: {
      eyebrow: string;
      title: string;
      description: string;
      question: string;
      resetHint: string;
      resultLabel: string;
      loading: string;
      household: { label: string; description: string };
      rainwater: { label: string; description: string };
    };
    complaintDraft: {
      eyebrow: string;
      title: string;
      description: string;
      privacyNotice: string;
      chooseIssue: string;
      noWaterSupply: string;
      waterLeakage: string;
      waterQualityConcern: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      descriptionHelp: string;
      locationLabel: string;
      locationPlaceholder: string;
      dateLabel: string;
      datePlaceholder: string;
      createDraft: string;
      required: string;
      detailsEntered: string;
      resultLabel: string;
      reviewBeforeCopy: string;
      loading: string;
      copyDraft: string;
      copiedDraft: string;
    };
    potholeReport: {
      entry: {
        eyebrow: string;
        title: string;
        description: string;
        open: string;
      };
      eyebrow: string;
      title: string;
      description: string;
      targetCondition: string;
      futureWorkflow: string;
      steps: { title: string; description: string }[];
      imageSelection: {
        eyebrow: string;
        title: string;
        description: string;
        inputLabel: string;
        inputHelp: string;
        ready: string;
        notAnalyzed: string;
        previewAlt: string;
        filename: string;
        size: string;
        replace: string;
        remove: string;
        errorUnsupported: string;
        errorTooLarge: string;
        privacyNotice: string;
        privacyNoticeAnalyzing: string;
        privacyNoticeAfterAnalysis: string;
        analyze: string;
      };
      analysis: {
        loading: string;
        resultHeading: string;
        eligible: string;
        eligibleDescription: string;
        notEligible: string;
        notEligibleDescription: string;
        insufficientEvidence: string;
        insufficientEvidenceDescription: string;
        error: string;
        confidence: string;
        severity: string;
        description: string;
        potholeVisible: string;
        standingWaterVisible: string;
        visible: string;
        notVisible: string;
        severityLow: string;
        severityMedium: string;
        severityHigh: string;
        tryAnotherImage: string;
        retry: string;
        continueToLocation: string;
        locationComingNext: string;
      };
      location: {
        heading: string;
        explanation: string;
        privacyNotice: string;
        privacyNoticeForAddressLookup: string;
        request: string;
        requesting: string;
        captured: string;
        latitude: string;
        longitude: string;
        accuracy: string;
        accuracyApproximate: string;
        accuracyUnavailable: string;
        permissionDenied: string;
        unavailable: string;
        timeout: string;
        unsupported: string;
        retry: string;
        continueToMap: string;
        mapComingNext: string;
        useCurrentLocation: string;
        enterManually: string;
        manualHeading: string;
        manualDescription: string;
        manualLatitudePlaceholder: string;
        manualLongitudePlaceholder: string;
        manualArea: string;
        manualAreaPlaceholder: string;
        showOnMap: string;
        manualLocationFound: string;
        manualEdit: string;
        manualLatitudeInvalid: string;
        manualLongitudeInvalid: string;
        manualAreaRequired: string;
        manualAreaTooLong: string;
        manualPrivacyNotice: string;
      };
      map: {
        heading: string;
        instructions: string;
        mapLabel: string;
        markerLabel: string;
        loading: string;
        unavailable: string;
        retry: string;
        selectedLatitude: string;
        selectedLongitude: string;
        originalGpsAccuracy: string;
        manuallyAdjusted: string;
        manuallyAdjustedManual: string;
        confirmLocation: string;
        confirmed: string;
        confirmedCoordinates: string;
        continueToAddress: string;
        addressComingNext: string;
        manualInstructions: string;
        userProvidedArea: string;
      };
      address: {
        heading: string;
        instructions: string;
        continueToAddress: string;
        finding: string;
        found: string;
        addressLabel: string;
        unavailable: string;
        noAddressFound: string;
        retry: string;
        privacyNotice: string;
        temporaryNotice: string;
        attribution: string;
        continueToReport: string;
        reportComingNext: string;
      };
      reportPreview: {
        eyebrow: string;
        heading: string;
        description: string;
        statusLabel: string;
        readyForReview: string;
        notSubmitted: string;
        evidence: string;
        issue: string;
        issueType: string;
        aiObservation: string;
        location: string;
        confirmedCoordinates: string;
        mapSummary: string;
        locationSummary: string;
        privacyHeading: string;
        privacyNotice: string;
        editLocation: string;
        editImage: string;
        continue: string;
        submissionUnavailable: string;
        userProvidedArea: string;
        reverseGeocodedAddress: string;
        areaMayNotMatch: string;
      };
      availableNow: string;
      comingNext: string;
      notSubmitted: string;
      backToAssistant: string;
      cancel: string;
    };
  };
};

export const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    accessibility: { skipToContent: "Skip to main content" },
    navbar: {
      government: "Inspired by the Ministry of Jal Shakti domain",
      skipToContent: "Skip to content",
      switchLanguage: "Switch language",
      home: "Home",
      capabilities: "Capabilities",
      howItWorks: "How It Works",
      benefits: "Benefits",
      about: "About",
      ministry: "Ministry of Jal Shakti domain-inspired",
      officialAssistant: "Jal Shakti-Inspired AI Assistant",
      talkToAssistant: "Talk to JalSarthi",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      primaryNavigation: "Primary",
    },
    hero: {
      eyebrow: "Ministry of Jal Shakti domain-inspired",
      headingStart: "Empowering Every Citizen with",
      headingAccent: "Intelligent Water Governance",
      description:
        "JalSarthi AI offers a simple place to explore water-related questions in plain language, with source-backed information when relevant verified knowledge is available.",
      askAssistant: "Ask JalSarthi AI",
      exploreServices: "Explore Services",
      trustBadges: [
        "Ministry of Jal Shakti domain-inspired",
        "AI-Powered • Citizen-First",
      ],
      assistantName: "JalSarthi AI Assistant",
      demoQuestion: "What are some practical ways to conserve water at home?",
      demoResponse:
        "I can share general water-conservation ideas and explain when you should check with a relevant local authority for official information.",
    },
    capabilities: {
      heading: "What JalSarthi AI Can Do",
      description:
        "A focused set of AI-assisted capabilities built around real citizen needs in water governance.",
      items: [
        {
          title: "General Water Information",
          description:
            "Plain-language explanations of everyday water topics and conservation practices.",
        },
        {
          title: "AI Water Assistant",
          description:
            "Conversational assistance for general water-related questions in plain language.",
        },
        {
          title: "Guided Next Steps",
          description:
            "Helps citizens identify when to contact the appropriate official or local authority.",
        },
        {
          title: "Voice Assistant",
          description:
            "Planned future voice interaction for accessibility, including low-literacy and regional-language users.",
        },
        {
          title: "Document Search",
          description:
            "Source-backed information is shown when relevant verified knowledge is available.",
        },
        {
          title: "Water Conservation Advisor",
          description:
            "Practical, localized advice on water conservation and sustainable usage for households and communities.",
        },
      ],
    },
    howItWorks: {
      heading: "How JalSarthi Works",
      description:
        "A transparent flow from a citizen query to a response, with clear limits when relevant verified knowledge is unavailable.",
      steps: [
        { title: "Citizen", description: "Asks a question in their own words by text." },
        {
          title: "AI",
          description:
            "JalSarthi AI interprets the query and prepares a general response.",
        },
        {
          title: "Knowledge Layer",
          description:
            "Retrieves relevant verified knowledge and shows supporting sources when available.",
        },
        {
          title: "Clear Response",
          description:
            "Delivers a concise answer and points to an authority when verification is needed.",
        },
      ],
    },
    benefits: {
      heading: "Built for Everyone Involved",
      description: "Designed to create value across citizens, officers and the Ministry.",
      groups: [
        {
          title: "Citizens",
          benefits: [
            "Simple, jargon-free answers to water scheme queries",
            "Faster, guided complaint drafting",
            "24/7 availability in multiple languages",
          ],
        },
        {
          title: "Government Officers",
          benefits: [
            "Reduced repetitive query load",
            "Structured, pre-drafted complaint summaries",
            "Faster access to relevant circulars and guidelines",
          ],
        },
        {
          title: "Ministry",
          benefits: [
            "Consistent, standardized citizen communication",
            "Better visibility into common citizen concerns",
            "Scalable first point of contact for water governance",
          ],
        },
      ],
    },
    statistics: {
      heading: "Illustrative Impact Metrics",
      description: "Demonstration figures only — not live production data.",
      labels: [
        "Simulated Citizen Queries Handled",
        "Government Schemes Indexed",
        "Languages Planned for Support",
        "AI Availability",
      ],
    },
    features: {
      heading: "Transforming Water Governance Through AI",
      description:
        "Each capability is designed around a real interaction a citizen or officer already has with water governance today — made faster and clearer.",
      comingSoon: "Coming soon",
      availableInPrototype: "Available now",
      items: {
        "ai-assistant": {
          title: "AI Assistant",
          description:
            "A conversational guide that answers water-related questions in plain language, in the citizen's own words.",
        },
        "government-knowledge": {
          title: "Government Knowledge",
          description:
            "Source-backed answers from relevant verified knowledge, with supporting sources when available.",
        },
        "complaint-generator": {
          title: "Complaint Generator",
          description:
            "Turns a citizen's description of a water issue into a structured complaint draft that is not submitted.",
        },
        "voice-assistant": {
          title: "Voice Assistant",
          description:
            "A planned future option for citizens who are more comfortable speaking than typing.",
        },
        "officer-copilot": {
          title: "Officer Copilot",
          description:
            "A companion for field and desk officers to triage complaints, draft responses, and track resolution status.",
        },
        "analytics-dashboard": {
          title: "Analytics Dashboard",
          description:
            "District and state-level visibility into complaint volumes, scheme reach, and response times.",
        },
      },
    },
    cta: {
      heading: "Built for every citizen who needs a clear answer on water",
      description:
        "JalSarthi AI is inspired by the Ministry of Jal Shakti domain and helps people find clear, source-backed water information.",
      button: "Start Chat with JalSarthi AI",
    },
    footer: {
      ministry: "Ministry of Jal Shakti domain-inspired",
      portal: "AI Water Information Assistant",
      description:
        "JalSarthi AI is an intelligent citizen assistance platform designed to simplify access to water-related government services, schemes, information, and grievance support.",
      quickLinks: "Quick Links",
      services: "Services",
      howItWorks: "How It Works",
      impact: "Impact",
      assistant: "AI Assistant",
      aboutPrototype: "About This Prototype",
      prototypeNotice:
        "This prototype has been developed for Hackathon solely for demonstration purposes. It is not an official Government of India service.",
      repository: "View Project Repository",
    },
    assistant: {
      status: "Status",
      statusItems: [
        { label: "AI chat", value: "Available when configured" },
        { label: "Conversation", value: "This session only" },
        {
          label: "Knowledge retrieval",
          value: "Verified source-backed information available",
        },
        { label: "Voice input", value: "Not enabled" },
      ],
      welcome: "Welcome to JalSarthi AI",
      welcomeDescription:
        "Ask water-related questions in natural language, or choose guided water-conservation help below. When available verified information matches your question, JalSarthi shows the supporting official source.",
      quickServicesLabel: "Quick prompts",
      quickServices: [
        "Water conservation tips",
        "Rainwater harvesting",
        "Water quality basics",
        "Water-saving at home",
        "Community awareness",
        "General water question",
      ],
      conversationArea: "Conversation area",
      emptyTitle: "Your conversation starts here",
      emptyDescription:
        "Choose a suggested question or use the guided planner. Answers are limited to information available in JalSarthi's knowledge base; matching answers show their official source.",
      tryAsking: "Try asking",
      suggestions: [
        "How can I reduce water use at home?",
        "What is rainwater harvesting?",
        "What are common causes of water wastage?",
        "How can a community conserve water?",
        "What are basic water-quality precautions?",
        "Why is water conservation important?",
      ],
      attachFile: "Attach a file",
      voiceInput: "Voice input",
      sendMessage: "Send message",
      askLabel: "Ask JalSarthi AI",
      placeholder:
        "Ask about water, conservation, Jal Jeevan Mission, or water quality...",
      chatNotice:
        "Answers are limited to the information currently available in JalSarthi's knowledge base. Source cards appear only when verified information supports an answer.",
      loading: "JalSarthi AI is preparing a response…",
      error: "JalSarthi AI could not respond. Please try again.",
      unavailable:
        "AI chat is not configured yet. Please try again after the service is configured.",
      source: "Source",
      officialSource: "Official source",
      viewSource: "View source",
      limitedInformation: "Information is limited to the relevant source context.",
      officialInformation: {
        eyebrow: "Official information",
        title: "Find verified official sources",
        description:
          "Search JalSarthi's static catalogue of previously verified official resources. This is not live web search.",
        searchLabel: "Search verified official sources",
        placeholder: "For example, Jal Jeevan Mission",
        searchButton: "Find sources",
        loading: "Finding verified official sources…",
        resultLabel: "Verified official sources",
        lastVerified: "Last verified",
        suggestions: [
          "Jal Jeevan Mission",
          "Water conservation",
          "Rainwater harvesting",
          "Water quality monitoring",
        ],
      },
      planner: {
        eyebrow: "Guided assistance",
        title: "Water-conservation planner",
        description:
          "Choose a guided option to receive source-backed water-conservation information in this chat.",
        question: "What would you like help with?",
        resetHint: "Choose another topic at any time to start again.",
        resultLabel: "Guided water-conservation result",
        loading: "Preparing guided information from available verified sources…",
        household: {
          label: "Saving water at home",
          description: "Guided household water-conservation information.",
        },
        rainwater: {
          label: "Rainwater harvesting",
          description: "Guided rainwater-harvesting and recharge context.",
        },
      },
      complaintDraft: {
        eyebrow: "Draft assistance",
        title: "Prepare a water-issue complaint draft",
        description:
          "Create a session-only draft you can copy and submit yourself through an appropriate official channel. It is not submitted by JalSarthi AI.",
        privacyNotice:
          "Draft only — not submitted or stored. Do not include phone numbers, identity details, or health information.",
        chooseIssue: "Choose the issue type",
        noWaterSupply: "No water supply",
        waterLeakage: "Water leakage",
        waterQualityConcern: "Drinking-water quality concern",
        descriptionLabel: "Brief description of the issue",
        descriptionPlaceholder:
          "Describe the water-related issue without personal or health details.",
        descriptionHelp:
          "Only the information needed for this draft is used. Avoid contact, identity, financial, and health details.",
        locationLabel: "Village/area/locality (optional)",
        locationPlaceholder: "Citizen-provided location description",
        dateLabel: "Date or duration (optional)",
        datePlaceholder: "For example, since yesterday",
        createDraft: "Prepare complaint draft",
        required:
          "Choose an issue type and enter a brief description to prepare a draft.",
        detailsEntered: "Complaint details entered",
        resultLabel: "Complaint draft — not submitted",
        reviewBeforeCopy: "Draft generated. Review the details below before copying it.",
        loading: "Preparing your complaint draft…",
        copyDraft: "Copy draft",
        copiedDraft: "Draft copied locally — still not submitted",
      },
      potholeReport: {
        entry: {
          eyebrow: "Guided reporting",
          title: "Report water-accumulating pothole",
          description:
            "Prepare a session-only report for a visible pothole containing standing water.",
          open: "Open pothole report",
        },
        eyebrow: "Guided reporting",
        title: "Report Water-Accumulating Pothole",
        description:
          "This guided flow is only for a visible road pothole containing visible standing or accumulated water. It is not for general road damage or dry potholes.",
        targetCondition:
          "The selected image is analyzed to determine whether a visible pothole contains visible standing water.",
        futureWorkflow: "Workflow",
        steps: [
          {
            title: "Select or capture an image",
            description: "Add an image showing the road condition.",
          },
          {
            title: "AI checks the condition",
            description:
              "The check looks for both a visible pothole and visible standing water.",
          },
          {
            title: "Confirm location",
            description:
              "You will be able to review the location before preparing a report.",
          },
          {
            title: "Review report",
            description: "Review the prepared details. This flow ends at NOT SUBMITTED.",
          },
        ],
        imageSelection: {
          eyebrow: "Step 1 — image selection",
          title: "Select or capture an image",
          description:
            "Use a clear image where both the pothole and standing water are visible.",
          inputLabel: "Choose a JPEG, PNG, or WebP image",
          inputHelp:
            "Maximum file size: 8 MB. This client-side check is only for your convenience; the image will be validated again before analysis.",
          ready: "Ready for analysis",
          notAnalyzed: "The image has not been analyzed.",
          previewAlt: "Preview of the selected image",
          filename: "Filename",
          size: "File size",
          replace: "Replace image",
          remove: "Remove image",
          errorUnsupported: "Choose a JPEG, PNG, or WebP image.",
          errorTooLarge: "Choose an image no larger than 8 MB.",
          privacyNotice:
            "Until you select Analyze image, the selected image remains in this browser session. JalSarthi does not store it.",
          privacyNoticeAnalyzing:
            "The selected image is being sent to the JalSarthi AI service for analysis. JalSarthi does not store it.",
          privacyNoticeAfterAnalysis:
            "The selected image was sent to the JalSarthi AI service for analysis. JalSarthi does not store it.",
          analyze: "Analyze image",
        },
        analysis: {
          loading: "Analyzing image…",
          resultHeading: "Analysis result",
          eligible: "Water-accumulating pothole detected.",
          eligibleDescription:
            "Both a visible pothole and standing water were identified in this image.",
          notEligible:
            "This image does not provide sufficient evidence of a water-accumulating pothole.",
          notEligibleDescription:
            "The image did not meet the required water-accumulating pothole criteria.",
          insufficientEvidence: "More evidence is needed. Please try a clearer image.",
          insufficientEvidenceDescription:
            "The image does not provide enough visual evidence to make this determination.",
          error: "We couldn't analyze this image right now. Please try again.",
          confidence: "Confidence",
          severity: "Severity",
          description: "AI description",
          potholeVisible: "Pothole visible",
          standingWaterVisible: "Standing water visible",
          visible: "Yes",
          notVisible: "No",
          severityLow: "Low",
          severityMedium: "Medium",
          severityHigh: "High",
          tryAnotherImage: "Try another image",
          retry: "Retry analysis",
          continueToLocation: "Continue to location",
          locationComingNext:
            "Location confirmation is the next step and is not available yet.",
        },
        location: {
          heading: "Location",
          explanation:
            "JalSarthi needs the pothole's location. Use your current location or enter it manually.",
          privacyNotice:
            "Your location is kept only in this browser session and is not permanently stored. When the map is shown, your browser requests OpenStreetMap map tiles for that area.",
          privacyNoticeForAddressLookup:
            "Your confirmed coordinates are sent through JalSarthi's server to OpenStreetMap's address lookup service to retrieve a readable address. JalSarthi does not permanently store them.",
          request: "Continue to location",
          requesting: "Requesting your current location…",
          captured: "GPS location captured",
          latitude: "Latitude",
          longitude: "Longitude",
          accuracy: "Accuracy",
          accuracyApproximate: "Approximately {accuracy} m",
          accuracyUnavailable: "Unavailable",
          permissionDenied:
            "Location permission was denied. Allow location access in your browser settings and try again.",
          unavailable: "Your current location is unavailable. Please try again.",
          timeout: "Location request timed out. Please try again.",
          unsupported: "Location is not available in this browser.",
          retry: "Try again",
          continueToMap: "Continue to map",
          mapComingNext:
            "Map and location confirmation are the next steps and are not available yet.",
          useCurrentLocation: "Use my current location",
          enterManually: "Enter location manually",
          manualHeading: "Enter location manually",
          manualDescription:
            "Enter coordinates and an area or locality, then review the exact point on the map.",
          manualLatitudePlaceholder: "28.6139",
          manualLongitudePlaceholder: "77.2090",
          manualArea: "Area / locality",
          manualAreaPlaceholder: "New Delhi",
          showOnMap: "Show location on map",
          manualLocationFound: "Location found on map",
          manualEdit: "Edit manual location",
          manualLatitudeInvalid: "Enter a valid latitude between -90 and 90.",
          manualLongitudeInvalid: "Enter a valid longitude between -180 and 180.",
          manualAreaRequired: "Enter an area or locality.",
          manualAreaTooLong: "Enter an area or locality of 160 characters or fewer.",
          manualPrivacyNotice:
            "Your entered coordinates and area stay temporary in this browser session. Coordinates are not sent for address lookup until you confirm the map location.",
        },
        map: {
          heading: "Confirm your location",
          instructions:
            "The map starts at your GPS location. Move the marker if the location needs adjustment, then confirm it.",
          mapLabel: "Interactive map for confirming the pothole location",
          markerLabel: "Draggable selected location marker",
          loading: "Loading map…",
          unavailable:
            "The map could not load. Your captured coordinates are still available. Please try again.",
          retry: "Retry map",
          selectedLatitude: "Selected latitude",
          selectedLongitude: "Selected longitude",
          originalGpsAccuracy: "Original GPS accuracy",
          manuallyAdjusted:
            "Adjusted location: manually selected by you. The original GPS accuracy does not apply to this adjusted location.",
          manuallyAdjustedManual:
            "Adjusted location: manually selected by you. Confirm the updated coordinates before finding the address.",
          confirmLocation: "Confirm this location",
          confirmed: "Location confirmed",
          confirmedCoordinates: "Location selected: {latitude}, {longitude}",
          continueToAddress: "Continue to address",
          addressComingNext: "Address lookup is the next step and is not available yet.",
          manualInstructions:
            "The map starts at the coordinates you entered. Move the marker if needed, then confirm the location.",
          userProvidedArea: "User-provided area",
        },
        address: {
          heading: "Find the address",
          instructions: "Use the confirmed location to find a readable address.",
          continueToAddress: "Find address",
          finding: "Finding the address…",
          found: "Location found",
          addressLabel: "Address",
          unavailable: "We couldn't find an address for this location right now.",
          noAddressFound: "No usable address was found for this location.",
          retry: "Try again",
          privacyNotice:
            "Your confirmed location is sent to OpenStreetMap's address lookup service to retrieve a readable address. It is not sent to the Ministry.",
          temporaryNotice:
            "JalSarthi does not permanently store your location or address.",
          attribution: "Address data © OpenStreetMap contributors",
          continueToReport: "Continue to report",
          reportComingNext: "Report preview is the next step and is not available yet.",
        },
        reportPreview: {
          eyebrow: "Step 4 — report preview",
          heading: "Review your report",
          description:
            "Review the information assembled from your selected evidence, completed AI analysis, and confirmed location.",
          statusLabel: "Status",
          readyForReview: "Ready for review",
          notSubmitted: "NOT SUBMITTED",
          evidence: "Evidence",
          issue: "Issue",
          issueType: "Water-accumulating pothole",
          aiObservation: "AI observation",
          location: "Location",
          confirmedCoordinates: "Confirmed coordinates",
          mapSummary: "Map/location summary",
          locationSummary:
            "The location was confirmed on the map before this preview was opened.",
          privacyHeading: "Privacy",
          privacyNotice:
            "This image, analysis, confirmed coordinates, and address are temporary for this browser session. The confirmed coordinates were sent through the JalSarthi server to OpenStreetMap's Nominatim service to find the address. No report has been submitted, no government service has received it, and JalSarthi does not permanently store this information.",
          editLocation: "Back to location",
          editImage: "Back to image",
          continue: "Submission unavailable",
          submissionUnavailable:
            "This flow ends here. It will not send this report anywhere.",
          userProvidedArea: "User-provided area",
          reverseGeocodedAddress: "Reverse-geocoded address",
          areaMayNotMatch:
            "The entered area may not match the selected coordinates. Please verify the location.",
        },
        availableNow: "Available now",
        comingNext: "Coming next",
        notSubmitted: "This flow does not submit a report.",
        backToAssistant: "Back to assistant",
        cancel: "Cancel",
      },
    },
  },
  hi: {
    accessibility: { skipToContent: "मुख्य सामग्री पर जाएँ" },
    navbar: {
      government: "जल शक्ति मंत्रालय के क्षेत्र से प्रेरित",
      skipToContent: "मुख्य सामग्री पर जाएँ",
      switchLanguage: "भाषा बदलें",
      home: "होम",
      capabilities: "क्षमताएँ",
      howItWorks: "कार्यप्रणाली",
      benefits: "लाभ",
      about: "परिचय",
      ministry: "जल शक्ति मंत्रालय क्षेत्र-प्रेरित",
      officialAssistant: "जल शक्ति-प्रेरित एआई सहायक",
      talkToAssistant: "जलसारथी से बात करें",
      openMenu: "मेनू खोलें",
      closeMenu: "मेनू बंद करें",
      primaryNavigation: "मुख्य नेविगेशन",
    },
    hero: {
      eyebrow: "जल शक्ति मंत्रालय के क्षेत्र से प्रेरित",
      headingStart: "हर नागरिक को सशक्त बनाना",
      headingAccent: "बुद्धिमान जल शासन के साथ",
      description:
        "जलसारथी एआई सरल भाषा में जल-संबंधी प्रश्नों को समझने का स्थान प्रदान करता है और प्रासंगिक सत्यापित ज्ञान उपलब्ध होने पर स्रोत-आधारित जानकारी देता है।",
      askAssistant: "जलसारथी एआई से पूछें",
      exploreServices: "सेवाएँ देखें",
      trustBadges: ["जल शक्ति मंत्रालय क्षेत्र-प्रेरित", "एआई-संचालित • नागरिक-केंद्रित"],
      assistantName: "जलसारथी एआई सहायक",
      demoQuestion: "घर पर पानी बचाने के व्यावहारिक तरीके क्या हैं?",
      demoResponse:
        "मैं पानी बचाने के सामान्य उपाय साझा कर सकता हूँ और बता सकता हूँ कि आधिकारिक जानकारी के लिए स्थानीय प्राधिकरण से कब संपर्क करना चाहिए।",
    },
    capabilities: {
      heading: "जलसारथी एआई क्या कर सकता है",
      description:
        "जल शासन में नागरिकों की वास्तविक आवश्यकताओं पर आधारित एआई-सहायित क्षमताओं का एक केंद्रित समूह।",
      items: [
        {
          title: "सामान्य जल जानकारी",
          description:
            "रोज़मर्रा के जल विषयों और संरक्षण उपायों की सरल भाषा में व्याख्या।",
        },
        {
          title: "एआई जल सहायक",
          description:
            "सामान्य जल-संबंधी प्रश्नों के लिए सरल भाषा में संवादात्मक सहायता।",
        },
        {
          title: "अगले कदम",
          description:
            "नागरिकों को यह समझने में मदद कि उचित आधिकारिक या स्थानीय प्राधिकरण से कब संपर्क करना चाहिए।",
        },
        {
          title: "वॉयस सहायक",
          description:
            "कम साक्षरता और क्षेत्रीय भाषा उपयोगकर्ताओं सहित सुलभता के लिए नियोजित भविष्य का वॉइस-आधारित संवाद।",
        },
        {
          title: "दस्तावेज़ खोज",
          description:
            "प्रासंगिक सत्यापित ज्ञान उपलब्ध होने पर स्रोत-आधारित जानकारी दिखाई जाती है।",
        },
        {
          title: "जल संरक्षण सलाहकार",
          description:
            "घरों और समुदायों के लिए जल संरक्षण और सतत उपयोग पर व्यावहारिक, स्थानीयकृत सलाह।",
        },
      ],
    },
    howItWorks: {
      heading: "जलसारथी कैसे काम करता है",
      description:
        "नागरिक के प्रश्न से उत्तर तक एक पारदर्शी प्रक्रिया, जिसमें प्रासंगिक सत्यापित ज्ञान उपलब्ध न होने पर सीमाएँ स्पष्ट रहती हैं।",
      steps: [
        {
          title: "नागरिक",
          description: "अपने शब्दों में टेक्स्ट द्वारा प्रश्न पूछता है।",
        },
        {
          title: "एआई",
          description: "जलसारथी एआई प्रश्न को समझता है और सामान्य उत्तर तैयार करता है।",
        },
        {
          title: "ज्ञान परत",
          description:
            "प्रासंगिक सत्यापित ज्ञान खोजता है और उपलब्ध होने पर सहायक स्रोत दिखाता है।",
        },
        {
          title: "स्पष्ट उत्तर",
          description:
            "संक्षिप्त उत्तर देता है और सत्यापन आवश्यक होने पर प्राधिकरण की ओर संकेत करता है।",
        },
      ],
    },
    benefits: {
      heading: "सभी हितधारकों के लिए निर्मित",
      description:
        "नागरिकों, अधिकारियों और मंत्रालय के लिए उपयोगी मूल्य बनाने हेतु डिज़ाइन किया गया।",
      groups: [
        {
          title: "नागरिक",
          benefits: [
            "जल योजनाओं के प्रश्नों के सरल, स्पष्ट उत्तर",
            "तेज़, निर्देशित शिकायत प्रारूपण",
            "कई भाषाओं में 24/7 उपलब्धता",
          ],
        },
        {
          title: "सरकारी अधिकारी",
          benefits: [
            "दोहराए जाने वाले प्रश्नों का कम बोझ",
            "संरचित, पहले से तैयार शिकायत सारांश",
            "प्रासंगिक परिपत्रों और दिशा-निर्देशों तक तेज़ पहुँच",
          ],
        },
        {
          title: "मंत्रालय",
          benefits: [
            "सुसंगत, मानकीकृत नागरिक संचार",
            "सामान्य नागरिक चिंताओं की बेहतर जानकारी",
            "जल शासन के लिए संपर्क का विस्तृत पहला बिंदु",
          ],
        },
      ],
    },
    statistics: {
      heading: "उदाहरणात्मक प्रभाव आँकड़े",
      description: "केवल प्रदर्शन के लिए उदाहरणात्मक आँकड़े — लाइव उत्पादन डेटा नहीं।",
      labels: [
        "संभाले गए अनुकरणीय नागरिक प्रश्न",
        "अनुक्रमित सरकारी योजनाएँ",
        "समर्थन के लिए नियोजित भाषाएँ",
        "एआई उपलब्धता",
      ],
    },
    features: {
      heading: "एआई के माध्यम से जल शासन में बदलाव",
      description:
        "हर क्षमता जल शासन में नागरिक या अधिकारी की वास्तविक बातचीत को तेज़ और स्पष्ट बनाने के लिए डिज़ाइन की गई है।",
      comingSoon: "जल्द आ रहा है",
      availableInPrototype: "अब उपलब्ध",
      items: {
        "ai-assistant": {
          title: "एआई सहायक",
          description:
            "नागरिक के अपने शब्दों में जल-संबंधी प्रश्नों का सरल भाषा में उत्तर देने वाला संवादात्मक मार्गदर्शक।",
        },
        "government-knowledge": {
          title: "सरकारी ज्ञान",
          description:
            "प्रासंगिक सत्यापित ज्ञान से स्रोत-आधारित उत्तर और उपलब्ध होने पर सहायक स्रोत।",
        },
        "complaint-generator": {
          title: "शिकायत जनरेटर",
          description:
            "नागरिक के जल समस्या विवरण को एक संरचित शिकायत प्रारूप में बदलता है, जिसे जमा नहीं किया जाता।",
        },
        "voice-assistant": {
          title: "वॉयस सहायक",
          description:
            "टाइप करने की बजाय बोलने में सहज नागरिकों के लिए एक नियोजित भविष्य विकल्प।",
        },
        "officer-copilot": {
          title: "अधिकारी सहायक",
          description:
            "मैदानी और डेस्क अधिकारियों के लिए शिकायतों की जाँच, उत्तर तैयार करने और समाधान स्थिति देखने का साथी।",
        },
        "analytics-dashboard": {
          title: "एनालिटिक्स डैशबोर्ड",
          description:
            "शिकायत मात्रा, योजना पहुँच और प्रतिक्रिया समय की जिला व राज्य-स्तरीय जानकारी।",
        },
      },
    },
    cta: {
      heading: "जल संबंधी स्पष्ट उत्तर चाहने वाले हर नागरिक के लिए निर्मित",
      description:
        "जलसारथी एआई जल शक्ति मंत्रालय क्षेत्र से प्रेरित है और लोगों को स्पष्ट, स्रोत-आधारित जल जानकारी पाने में मदद करता है।",
      button: "जलसारथी एआई के साथ चैट शुरू करें",
    },
    footer: {
      ministry: "जल शक्ति मंत्रालय क्षेत्र-प्रेरित",
      portal: "एआई जल सूचना सहायक",
      description:
        "जलसारथी एआई एक बुद्धिमान नागरिक सहायता मंच है, जिसे जल-संबंधी सरकारी सेवाओं, योजनाओं, जानकारी और शिकायत सहायता तक पहुँच सरल बनाने के लिए डिज़ाइन किया गया है।",
      quickLinks: "त्वरित लिंक",
      services: "सेवाएँ",
      howItWorks: "कार्यप्रणाली",
      impact: "प्रभाव",
      assistant: "एआई सहायक",
      aboutPrototype: "इस प्रोटोटाइप के बारे में",
      prototypeNotice:
        "यह प्रोटोटाइप केवल प्रदर्शन उद्देश्यों के लिए हैकाथॉन हेतु विकसित किया गया है। यह भारत सरकार की आधिकारिक सेवा नहीं है।",
      repository: "प्रोजेक्ट रिपॉजिटरी देखें",
    },
    assistant: {
      status: "स्थिति",
      statusItems: [
        { label: "एआई चैट", value: "कॉन्फ़िगर होने पर उपलब्ध" },
        { label: "बातचीत", value: "केवल इस सत्र में" },
        { label: "ज्ञान खोज", value: "सत्यापित स्रोत-आधारित जानकारी उपलब्ध" },
        { label: "वॉयस इनपुट", value: "सक्षम नहीं" },
      ],
      welcome: "जलसारथी एआई में आपका स्वागत है",
      welcomeDescription:
        "प्राकृतिक भाषा में जल-संबंधी प्रश्न पूछें या नीचे दिए गए निर्देशित जल-संरक्षण विकल्प को चुनें। जब उपलब्ध सत्यापित जानकारी आपके प्रश्न से मेल खाती है, जलसारथी सहायक आधिकारिक स्रोत दिखाता है।",
      quickServicesLabel: "त्वरित प्रश्न",
      quickServices: [
        "जल संरक्षण सुझाव",
        "वर्षा जल संचयन",
        "जल गुणवत्ता की मूल बातें",
        "घर में पानी बचाना",
        "सामुदायिक जागरूकता",
        "सामान्य जल प्रश्न",
      ],
      conversationArea: "बातचीत क्षेत्र",
      emptyTitle: "आपकी बातचीत यहाँ से शुरू होती है",
      emptyDescription:
        "सुझाया गया प्रश्न चुनें या निर्देशित योजनाकार का उपयोग करें। उत्तर जलसारथी के ज्ञान-भंडार में उपलब्ध जानकारी तक सीमित हैं; मेल खाने वाले उत्तरों के साथ आधिकारिक स्रोत दिखाया जाता है।",
      tryAsking: "पूछकर देखें",
      suggestions: [
        "मैं घर पर पानी का उपयोग कैसे कम कर सकता हूँ?",
        "वर्षा जल संचयन क्या है?",
        "पानी की बर्बादी के सामान्य कारण क्या हैं?",
        "समुदाय पानी का संरक्षण कैसे कर सकता है?",
        "जल गुणवत्ता से जुड़ी बुनियादी सावधानियाँ क्या हैं?",
        "जल संरक्षण क्यों महत्वपूर्ण है?",
      ],
      attachFile: "फ़ाइल संलग्न करें",
      voiceInput: "वॉइस इनपुट",
      sendMessage: "संदेश भेजें",
      askLabel: "जलसारथी एआई से पूछें",
      placeholder: "जल, जल संरक्षण, जल जीवन मिशन या जल गुणवत्ता के बारे में पूछें...",
      chatNotice:
        "उत्तर जलसारथी के ज्ञान-भंडार में वर्तमान में उपलब्ध जानकारी तक सीमित हैं। सत्यापित जानकारी उपलब्ध होने पर ही स्रोत कार्ड दिखते हैं।",
      loading: "जलसारथी एआई उत्तर तैयार कर रहा है…",
      error: "जलसारथी एआई उत्तर नहीं दे सका। कृपया फिर से प्रयास करें।",
      unavailable:
        "एआई चैट अभी कॉन्फ़िगर नहीं है। सेवा कॉन्फ़िगर होने के बाद फिर से प्रयास करें।",
      source: "स्रोत",
      officialSource: "आधिकारिक स्रोत",
      viewSource: "स्रोत देखें",
      limitedInformation: "जानकारी संबंधित स्रोत के संदर्भ तक सीमित है।",
      officialInformation: {
        eyebrow: "आधिकारिक जानकारी",
        title: "सत्यापित आधिकारिक स्रोत खोजें",
        description:
          "जलसारथी के पहले से सत्यापित आधिकारिक संसाधनों के स्थिर कैटलॉग में खोजें। यह लाइव वेब खोज नहीं है।",
        searchLabel: "सत्यापित आधिकारिक स्रोत खोजें",
        placeholder: "उदाहरण: जल जीवन मिशन",
        searchButton: "स्रोत खोजें",
        loading: "सत्यापित आधिकारिक स्रोत खोजे जा रहे हैं…",
        resultLabel: "सत्यापित आधिकारिक स्रोत",
        lastVerified: "अंतिम सत्यापन",
        suggestions: [
          "जल जीवन मिशन",
          "जल संरक्षण",
          "वर्षा जल संचयन",
          "जल गुणवत्ता निगरानी",
        ],
      },
      planner: {
        eyebrow: "निर्देशित सहायता",
        title: "जल संरक्षण योजनाकार",
        description:
          "इस चैट में स्रोत-आधारित जल-संरक्षण जानकारी पाने के लिए निर्देशित विकल्प चुनें।",
        question: "आपको किस विषय में सहायता चाहिए?",
        resetHint: "फिर से शुरू करने के लिए कभी भी दूसरा विषय चुनें।",
        resultLabel: "निर्देशित जल-संरक्षण परिणाम",
        loading: "उपलब्ध सत्यापित स्रोतों से निर्देशित जानकारी तैयार की जा रही है…",
        household: {
          label: "घर में पानी बचाना",
          description: "घरेलू जल संरक्षण की निर्देशित जानकारी।",
        },
        rainwater: {
          label: "वर्षा जल संचयन",
          description: "वर्षा जल संचयन और भूजल पुनर्भरण का निर्देशित संदर्भ।",
        },
      },
      complaintDraft: {
        eyebrow: "प्रारूप सहायता",
        title: "जल-संबंधी समस्या का शिकायत प्रारूप तैयार करें",
        description:
          "एक सत्र-केवल प्रारूप तैयार करें जिसे आप कॉपी करके उपयुक्त आधिकारिक माध्यम से स्वयं जमा कर सकते हैं। जलसारथी एआई इसे जमा नहीं करता।",
        privacyNotice:
          "केवल प्रारूप — इसे जमा या संग्रहीत नहीं किया जाता। फोन नंबर, पहचान संबंधी जानकारी या स्वास्थ्य जानकारी शामिल न करें।",
        chooseIssue: "समस्या का प्रकार चुनें",
        noWaterSupply: "जल आपूर्ति नहीं",
        waterLeakage: "पानी का रिसाव",
        waterQualityConcern: "पेयजल गुणवत्ता संबंधी चिंता",
        descriptionLabel: "समस्या का संक्षिप्त विवरण",
        descriptionPlaceholder:
          "व्यक्तिगत या स्वास्थ्य संबंधी जानकारी के बिना जल-संबंधी समस्या का वर्णन करें।",
        descriptionHelp:
          "इस प्रारूप के लिए केवल आवश्यक जानकारी का उपयोग किया जाता है। संपर्क, पहचान, वित्तीय और स्वास्थ्य संबंधी जानकारी न दें।",
        locationLabel: "गाँव/क्षेत्र/स्थानीयता (वैकल्पिक)",
        locationPlaceholder: "नागरिक द्वारा प्रदान किया गया स्थान विवरण",
        dateLabel: "तिथि या अवधि (वैकल्पिक)",
        datePlaceholder: "उदाहरण: कल से",
        createDraft: "शिकायत प्रारूप तैयार करें",
        required:
          "प्रारूप तैयार करने के लिए समस्या का प्रकार चुनें और संक्षिप्त विवरण दर्ज करें।",
        detailsEntered: "शिकायत विवरण दर्ज किया गया",
        resultLabel: "शिकायत प्रारूप — जमा नहीं किया गया",
        reviewBeforeCopy:
          "शिकायत प्रारूप तैयार है। कॉपी करने से पहले नीचे दिए गए विवरण की समीक्षा करें।",
        loading: "आपका शिकायत प्रारूप तैयार किया जा रहा है…",
        copyDraft: "प्रारूप कॉपी करें",
        copiedDraft: "प्रारूप स्थानीय रूप से कॉपी किया गया — फिर भी जमा नहीं किया गया",
      },
      potholeReport: {
        entry: {
          eyebrow: "निर्देशित रिपोर्टिंग",
          title: "पानी भरे गड्ढे की रिपोर्ट करें",
          description:
            "दिखाई देने वाले गड्ढे में खड़े पानी के लिए सत्र-केवल रिपोर्ट तैयार करें।",
          open: "गड्ढा रिपोर्ट खोलें",
        },
        eyebrow: "निर्देशित रिपोर्टिंग",
        title: "पानी भरे गड्ढे की रिपोर्ट करें",
        description:
          "यह निर्देशित प्रवाह केवल ऐसे सड़क गड्ढे के लिए है जिसमें दिखाई देने वाला खड़ा या जमा हुआ पानी हो। यह सामान्य सड़क क्षति या सूखे गड्ढों के लिए नहीं है।",
        targetCondition:
          "चुने गए चित्र का विश्लेषण यह जानने के लिए किया जाता है कि दिखाई देने वाले गड्ढे में खड़ा पानी है या नहीं।",
        futureWorkflow: "प्रक्रिया",
        steps: [
          {
            title: "चित्र चुनें या कैप्चर करें",
            description: "सड़क की स्थिति दिखाने वाला चित्र जोड़ें।",
          },
          {
            title: "एआई स्थिति की जाँच करेगा",
            description:
              "जाँच में दिखाई देने वाले गड्ढे और खड़े पानी, दोनों को देखा जाता है।",
          },
          {
            title: "स्थान की पुष्टि करें",
            description: "रिपोर्ट तैयार करने से पहले आप स्थान की समीक्षा कर सकेंगे।",
          },
          {
            title: "रिपोर्ट की समीक्षा करें",
            description:
              "तैयार विवरणों की समीक्षा करें। यह प्रवाह ‘जमा नहीं किया गया’ पर समाप्त होता है।",
          },
        ],
        imageSelection: {
          eyebrow: "चरण 1 — चित्र चयन",
          title: "चित्र चुनें या कैप्चर करें",
          description:
            "ऐसा स्पष्ट चित्र उपयोग करें जिसमें गड्ढा और खड़ा पानी, दोनों दिखाई दें।",
          inputLabel: "JPEG, PNG या WebP चित्र चुनें",
          inputHelp:
            "अधिकतम फ़ाइल आकार: 8 MB। यह क्लाइंट-साइड जाँच केवल आपकी सुविधा के लिए है; विश्लेषण से पहले चित्र फिर से सत्यापित किया जाएगा।",
          ready: "विश्लेषण के लिए तैयार",
          notAnalyzed: "चित्र का विश्लेषण नहीं किया गया है।",
          previewAlt: "चुने गए चित्र का पूर्वावलोकन",
          filename: "फ़ाइल नाम",
          size: "फ़ाइल आकार",
          replace: "चित्र बदलें",
          remove: "चित्र हटाएँ",
          errorUnsupported: "JPEG, PNG या WebP चित्र चुनें।",
          errorTooLarge: "8 MB से बड़ी नहीं होने वाली चित्र फ़ाइल चुनें।",
          privacyNotice:
            "‘चित्र का विश्लेषण करें’ चुनने तक चुना गया चित्र इसी ब्राउज़र सत्र में रहता है। जलसारथी इसे संग्रहीत नहीं करता।",
          privacyNoticeAnalyzing:
            "चुना गया चित्र विश्लेषण के लिए जलसारथी एआई सेवा को भेजा जा रहा है। जलसारथी इसे संग्रहीत नहीं करता।",
          privacyNoticeAfterAnalysis:
            "चुना गया चित्र विश्लेषण के लिए जलसारथी एआई सेवा को भेजा गया था। जलसारथी इसे संग्रहीत नहीं करता।",
          analyze: "चित्र का विश्लेषण करें",
        },
        analysis: {
          loading: "चित्र का विश्लेषण किया जा रहा है…",
          resultHeading: "विश्लेषण का परिणाम",
          eligible: "पानी भरा गड्ढा पाया गया।",
          eligibleDescription:
            "इस चित्र में दिखाई देने वाला गड्ढा और उसमें खड़ा पानी, दोनों पहचाने गए।",
          notEligible: "इस चित्र में पानी भरे गड्ढे के पर्याप्त साक्ष्य नहीं हैं।",
          notEligibleDescription:
            "चित्र पानी भरे गड्ढे के आवश्यक मानदंडों को पूरा नहीं करता।",
          insufficientEvidence:
            "अधिक साक्ष्य की आवश्यकता है। कृपया अधिक स्पष्ट चित्र आज़माएँ।",
          insufficientEvidenceDescription:
            "यह निर्णय लेने के लिए चित्र में पर्याप्त दृश्य साक्ष्य नहीं हैं।",
          error: "अभी इस चित्र का विश्लेषण नहीं किया जा सका। कृपया फिर से प्रयास करें।",
          confidence: "विश्वास स्तर",
          severity: "गंभीरता",
          description: "एआई विवरण",
          potholeVisible: "गड्ढा दिखाई दे रहा है",
          standingWaterVisible: "खड़ा पानी दिखाई दे रहा है",
          visible: "हाँ",
          notVisible: "नहीं",
          severityLow: "कम",
          severityMedium: "मध्यम",
          severityHigh: "अधिक",
          tryAnotherImage: "दूसरा चित्र आज़माएँ",
          retry: "विश्लेषण फिर से करें",
          continueToLocation: "स्थान पर आगे बढ़ें",
          locationComingNext: "स्थान की पुष्टि अगला चरण है और अभी उपलब्ध नहीं है।",
        },
        location: {
          heading: "स्थान",
          explanation:
            "पानी भरा गड्ढा कहाँ मिला था, यह पहचानने के लिए जलसारथी को उसका स्थान चाहिए। अपना वर्तमान स्थान उपयोग करें या इसे मैन्युअल रूप से दर्ज करें।",
          privacyNotice:
            "आपका स्थान केवल इसी ब्राउज़र सत्र में रखा जाता है और स्थायी रूप से संग्रहीत नहीं किया जाता। मानचित्र दिखने पर आपका ब्राउज़र उस क्षेत्र के लिए OpenStreetMap मानचित्र टाइलों का अनुरोध करता है।",
          privacyNoticeForAddressLookup:
            "पढ़ने योग्य पता पाने के लिए आपके पुष्टि किए गए निर्देशांक जलसारथी सर्वर के माध्यम से OpenStreetMap की पता-खोज सेवा को भेजे जाते हैं। जलसारथी इन्हें स्थायी रूप से संग्रहीत नहीं करता।",
          request: "स्थान पर आगे बढ़ें",
          requesting: "आपका वर्तमान स्थान लिया जा रहा है…",
          captured: "जीपीएस स्थान प्राप्त हो गया",
          latitude: "अक्षांश",
          longitude: "देशांतर",
          accuracy: "सटीकता",
          accuracyApproximate: "लगभग {accuracy} मीटर",
          accuracyUnavailable: "उपलब्ध नहीं है",
          permissionDenied:
            "स्थान की अनुमति नहीं दी गई। अपने ब्राउज़र की सेटिंग में स्थान अनुमति दें और फिर से प्रयास करें।",
          unavailable: "आपका वर्तमान स्थान उपलब्ध नहीं है। कृपया फिर से प्रयास करें।",
          timeout: "स्थान अनुरोध का समय समाप्त हो गया। कृपया फिर से प्रयास करें।",
          unsupported: "इस ब्राउज़र में स्थान उपलब्ध नहीं है।",
          retry: "फिर से प्रयास करें",
          continueToMap: "मानचित्र पर आगे बढ़ें",
          mapComingNext:
            "मानचित्र और स्थान की पुष्टि अगले चरण हैं और अभी उपलब्ध नहीं हैं।",
          useCurrentLocation: "मेरा वर्तमान स्थान उपयोग करें",
          enterManually: "स्थान मैन्युअल रूप से दर्ज करें",
          manualHeading: "स्थान मैन्युअल रूप से दर्ज करें",
          manualDescription:
            "निर्देशांक और क्षेत्र या स्थानीयता दर्ज करें, फिर मानचित्र पर सटीक बिंदु की समीक्षा करें।",
          manualLatitudePlaceholder: "28.6139",
          manualLongitudePlaceholder: "77.2090",
          manualArea: "क्षेत्र / स्थानीयता",
          manualAreaPlaceholder: "नई दिल्ली",
          showOnMap: "मानचित्र पर स्थान दिखाएँ",
          manualLocationFound: "मानचित्र पर स्थान मिल गया",
          manualEdit: "मैन्युअल स्थान संपादित करें",
          manualLatitudeInvalid: "-90 और 90 के बीच एक मान्य अक्षांश दर्ज करें।",
          manualLongitudeInvalid: "-180 और 180 के बीच एक मान्य देशांतर दर्ज करें।",
          manualAreaRequired: "एक क्षेत्र या स्थानीयता दर्ज करें।",
          manualAreaTooLong: "160 या उससे कम वर्णों का क्षेत्र या स्थानीयता दर्ज करें।",
          manualPrivacyNotice:
            "आपके दर्ज किए गए निर्देशांक और क्षेत्र केवल इस ब्राउज़र सत्र में अस्थायी रहते हैं। मानचित्र स्थान की पुष्टि करने तक पता खोज के लिए निर्देशांक नहीं भेजे जाते।",
        },
        map: {
          heading: "अपने स्थान की पुष्टि करें",
          instructions:
            "मानचित्र आपके जीपीएस स्थान से शुरू होता है। यदि स्थान में सुधार चाहिए तो मार्कर को खिसकाएँ और फिर इसकी पुष्टि करें।",
          mapLabel: "गड्ढे के स्थान की पुष्टि के लिए इंटरैक्टिव मानचित्र",
          markerLabel: "खींचकर बदला जा सकने वाला चुना हुआ स्थान मार्कर",
          loading: "मानचित्र लोड हो रहा है…",
          unavailable:
            "मानचित्र लोड नहीं हो सका। आपके प्राप्त निर्देशांक अभी भी उपलब्ध हैं। कृपया फिर से प्रयास करें।",
          retry: "मानचित्र फिर से लोड करें",
          selectedLatitude: "चुना गया अक्षांश",
          selectedLongitude: "चुना गया देशांतर",
          originalGpsAccuracy: "मूल जीपीएस सटीकता",
          manuallyAdjusted:
            "समायोजित स्थान: आपने स्वयं चुना है। मूल जीपीएस सटीकता इस समायोजित स्थान पर लागू नहीं होती।",
          manuallyAdjustedManual:
            "समायोजित स्थान: आपने स्वयं चुना है। पता खोजने से पहले अपडेट किए गए निर्देशांकों की पुष्टि करें।",
          confirmLocation: "इस स्थान की पुष्टि करें",
          confirmed: "स्थान की पुष्टि हो गई",
          confirmedCoordinates: "चुना गया स्थान: {latitude}, {longitude}",
          continueToAddress: "पते पर आगे बढ़ें",
          addressComingNext: "पता खोज अगला चरण है और अभी उपलब्ध नहीं है।",
          manualInstructions:
            "मानचित्र आपके दर्ज किए गए निर्देशांकों से शुरू होता है। आवश्यकता होने पर मार्कर खिसकाएँ, फिर स्थान की पुष्टि करें।",
          userProvidedArea: "उपयोगकर्ता द्वारा दिया गया क्षेत्र",
        },
        address: {
          heading: "पता खोजें",
          instructions: "पढ़ने योग्य पता खोजने के लिए पुष्टि किए गए स्थान का उपयोग करें।",
          continueToAddress: "पता खोजें",
          finding: "पता खोजा जा रहा है…",
          found: "स्थान मिल गया",
          addressLabel: "पता",
          unavailable: "अभी इस स्थान का पता नहीं मिल सका।",
          noAddressFound: "इस स्थान के लिए उपयोगी पता नहीं मिला।",
          retry: "फिर से प्रयास करें",
          privacyNotice:
            "पढ़ने योग्य पता पाने के लिए आपका पुष्टि किया गया स्थान OpenStreetMap की पता-खोज सेवा को भेजा जाता है। इसे मंत्रालय को नहीं भेजा जाता।",
          temporaryNotice:
            "जलसारथी आपके स्थान या पते को स्थायी रूप से संग्रहीत नहीं करता।",
          attribution: "पता डेटा © OpenStreetMap योगदानकर्ता",
          continueToReport: "रिपोर्ट पर आगे बढ़ें",
          reportComingNext: "रिपोर्ट पूर्वावलोकन अगला चरण है और अभी उपलब्ध नहीं है।",
        },
        reportPreview: {
          eyebrow: "चरण 4 — रिपोर्ट पूर्वावलोकन",
          heading: "अपनी रिपोर्ट की समीक्षा करें",
          description:
            "अपने चुने गए साक्ष्य, पूर्ण एआई विश्लेषण और पुष्टि किए गए स्थान से तैयार जानकारी की समीक्षा करें।",
          statusLabel: "स्थिति",
          readyForReview: "समीक्षा के लिए तैयार",
          notSubmitted: "जमा नहीं किया गया",
          evidence: "साक्ष्य",
          issue: "समस्या",
          issueType: "पानी जमा करने वाला गड्ढा",
          aiObservation: "एआई अवलोकन",
          location: "स्थान",
          confirmedCoordinates: "पुष्टि किए गए निर्देशांक",
          mapSummary: "मानचित्र/स्थान सारांश",
          locationSummary:
            "इस पूर्वावलोकन को खोलने से पहले मानचित्र पर स्थान की पुष्टि की गई थी।",
          privacyHeading: "गोपनीयता",
          privacyNotice:
            "यह चित्र, विश्लेषण, पुष्टि किए गए निर्देशांक और पता इसी ब्राउज़र सत्र के लिए अस्थायी हैं। पता खोजने के लिए पुष्टि किए गए निर्देशांक जलसारथी सर्वर के माध्यम से OpenStreetMap की Nominatim सेवा को भेजे गए थे। कोई रिपोर्ट जमा नहीं की गई है, किसी सरकारी सेवा को यह नहीं मिला है और जलसारथी इस जानकारी को स्थायी रूप से संग्रहीत नहीं करता।",
          editLocation: "स्थान पर वापस जाएँ",
          editImage: "चित्र पर वापस जाएँ",
          continue: "जमा करना उपलब्ध नहीं है",
          submissionUnavailable:
            "यह प्रवाह यहीं समाप्त होता है। यह रिपोर्ट कहीं नहीं भेजी जाएगी।",
          userProvidedArea: "उपयोगकर्ता द्वारा दिया गया क्षेत्र",
          reverseGeocodedAddress: "रिवर्स-जियोकोड किया गया पता",
          areaMayNotMatch:
            "दर्ज किया गया क्षेत्र चुने गए निर्देशांकों से मेल नहीं खा सकता है। कृपया स्थान सत्यापित करें।",
        },
        availableNow: "अब उपलब्ध है",
        comingNext: "आगे उपलब्ध होगा",
        notSubmitted: "यह प्रवाह कोई रिपोर्ट जमा नहीं करता।",
        backToAssistant: "सहायक पर वापस जाएँ",
        cancel: "रद्द करें",
      },
    },
  },
};
