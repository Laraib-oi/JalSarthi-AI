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
import type {
  ChatApiResponse,
  ChatGroundingResponse,
  ChatGroundingSource,
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

const NONE_FALLBACK: Record<Language, string> = {
  en: "The information you requested is not currently available in JalSarthi's knowledge base.",
  hi: "आपके द्वारा पूछी गई जानकारी वर्तमान में जलसारथी के ज्ञान-भंडार में उपलब्ध नहीं है।",
};

type ChatBody = {
  language?: unknown;
  messages?: unknown;
};

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

function boundText(value: string): string {
  return value.length > MAX_GROUNDING_TEXT_LENGTH
    ? `${value.slice(0, MAX_GROUNDING_TEXT_LENGTH)}…`
    : value;
}

function getTrustedSource(
  document: RetrievedDocument["document"]
): GroundingSource | undefined {
  if (document.status === "draft") return undefined;

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
  return documents.flatMap(({ document }) => {
    const source = getTrustedSource(document);
    if (!source) return [];

    return [{ documentTitle: document.title, category: document.category, ...source }];
  });
}

function buildGroundingResponse(
  status: ChatGroundingResponse["status"],
  documents: RetrievedDocument[]
): ChatGroundingResponse {
  return { status, sources: buildSourceMetadata(documents) };
}

export async function POST(request: Request) {
  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
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

  let retrieval: RetrievalResult;
  try {
    retrieval = retrieveKnowledge(latestUserMessage.content, body.language);
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

  try {
    const message = await getAiProvider().completeChat({
      language: body.language,
      messages,
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
