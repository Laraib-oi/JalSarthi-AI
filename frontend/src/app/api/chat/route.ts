import { NextResponse } from "next/server";

import type { Language } from "@/constants/translations";
import { getAiProvider } from "@/lib/ai/provider";
import {
  AiProviderError,
  type GroundingContext,
  type GroundingDocument,
  type GroundingSource,
} from "@/lib/ai/types";
import { retrieveKnowledge } from "@/lib/knowledge/retrieve";
import type { RetrievedDocument, RetrievalResult } from "@/lib/knowledge/types";
import { discoverOfficialSources } from "@/lib/official-sources/discover";
import {
  createComplaintDraft,
  parseComplaintDraftRequest,
} from "@/lib/complaint-draft/water-complaint";
import {
  getWaterConservationPlannerRequest,
  getWaterConservationPlannerResponse,
  isWaterConservationPlannerSelection,
} from "@/lib/planner/water-conservation";
import type {
  ChatApiResponse,
  ChatGroundingResponse,
  ChatGroundingSource,
  ChatOfficialSource,
  ChatRequestMessage,
  ChatRole,
} from "@/types/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_HISTORY_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_GROUNDING_DOCUMENTS = 3;
const MAX_GROUNDING_SECTIONS_PER_DOCUMENT = 2;
const MAX_GROUNDING_TEXT_LENGTH = 1_200;
const MAX_OFFICIAL_SOURCE_DISCOVERY_QUERY_LENGTH = 200;

const NONE_FALLBACK: Record<Language, string> = {
  en: "The information you requested is not currently available in JalSarthi's knowledge base.",
  hi: "आपके द्वारा पूछी गई जानकारी वर्तमान में जलसारथी के ज्ञान-भंडार में उपलब्ध नहीं है।",
};

type ChatBody = {
  language?: unknown;
  messages?: unknown;
  plannerSelection?: unknown;
  complaintDraft?: unknown;
  officialSourceDiscovery?: unknown;
};

function isChatBody(value: unknown): value is ChatBody {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const allowedKeys = new Set([
    "language",
    "messages",
    "plannerSelection",
    "complaintDraft",
    "officialSourceDiscovery",
  ]);
  return Object.keys(value).every((key) => allowedKeys.has(key));
}

function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "hi";
}

function isChatRole(value: unknown): value is ChatRole {
  return value === "user" || value === "assistant";
}

function parseMessages(value: unknown): ChatRequestMessage[] | undefined {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.length > MAX_HISTORY_MESSAGES
  ) {
    return undefined;
  }

  const messages: ChatRequestMessage[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") return undefined;

    const { role, content } = entry as { role?: unknown; content?: unknown };
    if (
      !isChatRole(role) ||
      typeof content !== "string" ||
      !content.trim() ||
      content.length > MAX_MESSAGE_LENGTH
    ) {
      return undefined;
    }

    messages.push({ role, content: content.trim() });
  }

  return messages.at(-1)?.role === "user" ? messages : undefined;
}

function parseOfficialSourceDiscoveryQuery(value: unknown): string | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;

  const discovery = value as Record<string, unknown>;
  if (Object.keys(discovery).length !== 1 || !("query" in discovery)) return undefined;

  const query = discovery.query;
  return typeof query === "string" && query.trim() && query.length <= MAX_OFFICIAL_SOURCE_DISCOVERY_QUERY_LENGTH
    ? query.trim()
    : undefined;
}

function boundText(value: string): string {
  return value.length > MAX_GROUNDING_TEXT_LENGTH
    ? `${value.slice(0, MAX_GROUNDING_TEXT_LENGTH)}…`
    : value;
}

function getTrustedSource(
  document: RetrievedDocument["document"]
): GroundingSource | undefined {
  if (
    (document.status !== "verified" && document.status !== "approved") ||
    typeof document.sourceName !== "string" ||
    typeof document.sourceUrl !== "string" ||
    !document.sourceUrl.startsWith("https://") ||
    typeof document.sourceType !== "string" ||
    typeof document.publisher !== "string" ||
    typeof document.lastVerifiedAt !== "string"
  ) {
    return undefined;
  }

  return {
    name: document.sourceName,
    url: document.sourceUrl,
    type: document.sourceType,
    publisher: document.publisher,
    lastVerifiedAt: document.lastVerifiedAt,
  };
}

function buildGroundingDocument({ document }: RetrievedDocument): GroundingDocument {
  const source = getTrustedSource(document);

  return {
    title: boundText(document.title),
    category: document.category,
    summary: boundText(document.summary),
    sections: document.sections
      .slice(0, MAX_GROUNDING_SECTIONS_PER_DOCUMENT)
      .map((section) => ({
        heading: boundText(section.heading),
        content: boundText(section.content),
      })),
    ...(source ? { source } : {}),
  };
}

function buildGroundingContext(
  status: GroundingContext["status"],
  documents: RetrievedDocument[]
): GroundingContext {
  return {
    status,
    documents: documents.slice(0, MAX_GROUNDING_DOCUMENTS).map(buildGroundingDocument),
  };
}

function buildSourceMetadata(documents: RetrievedDocument[]): ChatGroundingSource[] {
  const sources = documents.flatMap(({ document }) => {
    const source = getTrustedSource(document);
    if (!source) return [];

    return [{ documentTitle: document.title, category: document.category, ...source }];
  });

  return Array.from(new Map(sources.map((source) => [source.url, source])).values());
}

function buildGroundingResponse(
  status: ChatGroundingResponse["status"],
  documents: RetrievedDocument[]
): ChatGroundingResponse {
  return { status, sources: buildSourceMetadata(documents) };
}

function buildOfficialSourceResponse(
  query: string,
  language: Language
): ChatOfficialSource[] {
  return discoverOfficialSources(query, language).map((source) => ({
    id: source.id,
    title: source.title,
    description: source.description,
    url: source.url,
    publisher: source.publisher,
    category: source.category,
    lastVerifiedAt: source.lastVerifiedAt,
  }));
}

export async function POST(request: Request) {
  let body: ChatBody;
  try {
    const payload: unknown = await request.json();
    if (!isChatBody(payload)) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }

    body = payload;
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const messages = parseMessages(body.messages);
  if (!isLanguage(body.language) || !messages) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const latestUserMessage = messages.at(-1);
  if (!latestUserMessage) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const plannerSelection = body.plannerSelection;
  if (plannerSelection !== undefined && !isWaterConservationPlannerSelection(plannerSelection)) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const complaintDraft = body.complaintDraft;
  const officialSourceDiscovery = body.officialSourceDiscovery;
  const workflowCount = [plannerSelection, complaintDraft, officialSourceDiscovery]
    .filter((workflow) => workflow !== undefined).length;
  if (workflowCount > 1) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  if (complaintDraft !== undefined) {
    const complaintRequest = parseComplaintDraftRequest(complaintDraft);
    if (!complaintRequest) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }

    const response: ChatApiResponse = {
      message: createComplaintDraft(complaintRequest, body.language),
      grounding: buildGroundingResponse("none", []),
    };
    return NextResponse.json(response);
  }

  if (officialSourceDiscovery !== undefined) {
    const discoveryQuery = parseOfficialSourceDiscoveryQuery(officialSourceDiscovery);
    if (!discoveryQuery) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }

    const officialSources = buildOfficialSourceResponse(discoveryQuery, body.language);
    const response: ChatApiResponse = {
      message: officialSources.length > 0
        ? body.language === "en"
          ? "Here are verified official sources from the JalSarthi catalogue."
          : "जलसारथी कैटलॉग से सत्यापित आधिकारिक स्रोत यहाँ दिए गए हैं।"
        : body.language === "en"
          ? "No verified official source was found for this request in the JalSarthi catalogue."
          : "इस अनुरोध के लिए जलसारथी कैटलॉग में कोई सत्यापित आधिकारिक स्रोत नहीं मिला।",
      grounding: buildGroundingResponse("none", []),
      officialSources,
    };
    return NextResponse.json(response);
  }

  const plannerRequest = plannerSelection
    ? getWaterConservationPlannerRequest(plannerSelection, body.language)
    : undefined;
  const retrievalQuery = plannerRequest?.query ?? latestUserMessage.content;
  const completionMessages = plannerRequest
    ? [
        ...messages.slice(0, -1),
        { role: "user" as const, content: plannerRequest.prompt },
      ]
    : messages;

  let retrieval: RetrievalResult;
  try {
    retrieval = retrieveKnowledge(retrievalQuery, body.language);
  } catch {
    return NextResponse.json({ error: "KNOWLEDGE_RETRIEVAL_ERROR" }, { status: 500 });
  }

  if (retrieval.status === "none") {
    const response: ChatApiResponse = {
      message: NONE_FALLBACK[body.language],
      grounding: buildGroundingResponse("none", []),
    };
    return NextResponse.json(response);
  }

  const grounding = buildGroundingContext(retrieval.status, retrieval.documents);

  if (plannerSelection) {
    const response: ChatApiResponse = {
      message: getWaterConservationPlannerResponse(plannerSelection, body.language),
      grounding: buildGroundingResponse(retrieval.status, retrieval.documents),
    };
    return NextResponse.json(response);
  }

  try {
    const message = await getAiProvider().completeChat({
      language: body.language,
      messages: completionMessages,
      grounding,
    });
    const response: ChatApiResponse = {
      message,
      grounding: buildGroundingResponse(retrieval.status, retrieval.documents),
    };
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AiProviderError) {
      const status = error.code === "AI_NOT_CONFIGURED" ? 503 : 502;
      return NextResponse.json({ error: error.code }, { status });
    }

    return NextResponse.json({ error: "AI_PROVIDER_ERROR" }, { status: 502 });
  }
}
