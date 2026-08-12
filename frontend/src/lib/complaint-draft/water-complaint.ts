import "server-only";

import type { Language } from "@/constants/translations";
import type { ComplaintDraftRequest, ComplaintDraftType } from "@/types/chat";

const MAX_DESCRIPTION_LENGTH = 1_000;
const MAX_OPTIONAL_FIELD_LENGTH = 250;
const HEALTH_TERMS = /health|hospital|doctor|illness|symptom|medical|patient|pregnan|स्वास्थ्य|अस्पताल|डॉक्टर|बीमारी|लक्षण|मरीज|चिकित्सा/iu;
const PHONE_NUMBER = /(?<!\d)(?:\+91[-\s]?)?[6-9]\d{9}(?!\d)/gu;
const AADHAAR_NUMBER = /(?<!\d)\d{4}[\s-]?\d{4}[\s-]?\d{4}(?!\d)/gu;
const EMAIL_ADDRESS = /\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/gu;

const COMPLAINT_TYPES = new Set<ComplaintDraftType>([
  "no_water_supply",
  "water_leakage",
  "water_quality_concern",
]);

const DRAFT_COPY: Record<ComplaintDraftType, Record<Language, { subject: string; issue: string }>> = {
  no_water_supply: {
    en: { subject: "Water supply issue", issue: "No water supply" },
    hi: { subject: "जलापूर्ति संबंधी समस्या", issue: "जल आपूर्ति नहीं" },
  },
  water_leakage: {
    en: { subject: "Water leakage issue", issue: "Water leakage" },
    hi: { subject: "पानी के रिसाव की समस्या", issue: "पानी का रिसाव" },
  },
  water_quality_concern: {
    en: { subject: "Drinking-water quality concern", issue: "Drinking-water quality concern" },
    hi: { subject: "पेयजल गुणवत्ता संबंधी चिंता", issue: "पेयजल गुणवत्ता संबंधी चिंता" },
  },
};

/**
 * Server-owned preparation shape for the current draft-only workflow. This is
 * intentionally not an official complaint or submission schema.
 */
type CanonicalComplaintDraft = {
  issueType: ComplaintDraftType;
  description: string;
  locality?: string;
  dateOrDuration?: string;
  language: Language;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readRequiredText(value: unknown, maximumLength: number): string | undefined {
  return typeof value === "string" && value.trim() && value.length <= maximumLength
    ? value.trim()
    : undefined;
}

function readOptionalText(value: unknown): string | undefined {
  if (value === undefined || value === "") return undefined;
  return typeof value === "string" && value.trim() && value.length <= MAX_OPTIONAL_FIELD_LENGTH
    ? value.trim()
    : undefined;
}

export function parseComplaintDraftRequest(value: unknown): ComplaintDraftRequest | undefined {
  if (!isRecord(value)) return undefined;

  const allowedKeys = new Set(["type", "description", "location", "dateOrDuration"]);
  if (Object.keys(value).some((key) => !allowedKeys.has(key))) return undefined;

  const type = value.type;
  const description = readRequiredText(value.description, MAX_DESCRIPTION_LENGTH);
  const location = readOptionalText(value.location);
  const dateOrDuration = readOptionalText(value.dateOrDuration);

  if (typeof type !== "string" || !COMPLAINT_TYPES.has(type as ComplaintDraftType) || !description) {
    return undefined;
  }

  if ((value.location !== undefined && !location) || (value.dateOrDuration !== undefined && !dateOrDuration)) {
    return undefined;
  }

  return { type: type as ComplaintDraftType, description, ...(location ? { location } : {}), ...(dateOrDuration ? { dateOrDuration } : {}) };
}

function redactSensitiveText(value: string, language: Language): string {
  const withoutContactDetails = value
    .replace(EMAIL_ADDRESS, language === "en" ? "[personal contact omitted]" : "[व्यक्तिगत संपर्क हटाया गया]")
    .replace(PHONE_NUMBER, language === "en" ? "[personal contact omitted]" : "[व्यक्तिगत संपर्क हटाया गया]")
    .replace(AADHAAR_NUMBER, language === "en" ? "[identity detail omitted]" : "[पहचान संबंधी जानकारी हटाई गई]");

  const nonMedicalParts = withoutContactDetails
    .split(/(?<=[.!?।])\s+|\n+/u)
    .filter((part) => !HEALTH_TERMS.test(part));

  return nonMedicalParts.join(" ").trim() || (language === "en"
    ? "No additional non-sensitive details provided."
    : "कोई अतिरिक्त गैर-संवेदनशील विवरण उपलब्ध नहीं कराया गया है।");
}

function createCanonicalComplaintDraft(
  request: ComplaintDraftRequest,
  language: Language
): CanonicalComplaintDraft {
  return {
    issueType: request.type,
    description: redactSensitiveText(request.description, language),
    ...(request.location
      ? { locality: redactSensitiveText(request.location, language) }
      : {}),
    ...(request.dateOrDuration
      ? { dateOrDuration: redactSensitiveText(request.dateOrDuration, language) }
      : {}),
    language,
  };
}

/** Creates a draft only. It has no submission, routing, persistence, or provider behaviour. */
export function createComplaintDraft(request: ComplaintDraftRequest, language: Language): string {
  const draft = createCanonicalComplaintDraft(request, language);
  const copy = DRAFT_COPY[draft.issueType][draft.language];
  const description = draft.description;
  const location = draft.locality
    ? draft.locality
    : draft.language === "en"
      ? "Not provided"
      : "उपलब्ध नहीं कराया गया";
  const dateOrDuration = draft.dateOrDuration
    ? draft.dateOrDuration
    : draft.language === "en"
      ? "Not provided"
      : "उपलब्ध नहीं कराया गया";

  if (draft.language === "hi") {
    return [
      `शिकायत प्रारूप — जमा नहीं किया गया\n\nविषय: ${copy.subject}\n\nमहोदय/महोदया,\n\nमैं निम्न जल-संबंधी समस्या की सूचना देना चाहता/चाहती हूँ।\n\nप्रकार: ${copy.issue}\nस्थान: ${location}\nविवरण: ${description}\nतिथि/अवधि: ${dateOrDuration}`,
      draft.issueType === "water_quality_concern"
        ? "\n\nनागरिक ने पेयजल की गुणवत्ता को लेकर चिंता बताई है। यह पानी की सुरक्षा के बारे में कोई निष्कर्ष नहीं है।"
        : "",
      "\n\nकृपया बताई गई समस्या की समीक्षा कर उचित कार्रवाई करें।\n\nधन्यवाद।\n\nयह जलसारथी एआई द्वारा तैयार किया गया केवल एक शिकायत प्रारूप है। इसे किसी सरकारी प्राधिकरण को जमा नहीं किया गया है और जलसारथी एआई ने किसी सरकारी विभाग से संपर्क नहीं किया है। कोई शिकायत संदर्भ संख्या नहीं बनाई गई है और जलसारथी एआई वर्तमान में शिकायत ट्रैकिंग प्रदान नहीं करता। आप इसे कॉपी करके उपयुक्त आधिकारिक माध्यम से स्वयं जमा कर सकते हैं।",
    ].join("");
  }

  return [
    `Complaint draft — not submitted\n\nSubject: ${copy.subject}\n\nDear Sir/Madam,\n\nI would like to report the following water-related issue.\n\nIssue: ${copy.issue}\nLocation: ${location}\nDetails: ${description}\nDate/Duration: ${dateOrDuration}`,
    draft.issueType === "water_quality_concern"
      ? "\n\nThe citizen reports a concern regarding drinking-water quality. This is not a finding about the water's safety."
      : "",
    "\n\nI request that the concerned authority kindly review the reported issue and take appropriate action.\n\nThank you.\n\nThis is only a complaint draft prepared by JalSarthi AI. It has NOT been submitted to any government authority, and JalSarthi AI has not contacted any government department. No complaint reference number has been created, and JalSarthi AI does not currently provide complaint tracking. You can copy this draft and submit it yourself through an appropriate official channel.",
  ].join("");
}
