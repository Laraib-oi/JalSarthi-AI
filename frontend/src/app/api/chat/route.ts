import { NextResponse } from "next/server";

import type { Language } from "@/constants/translations";
import { getAiProvider } from "@/lib/ai/provider";
import { AiProviderError } from "@/lib/ai/types";
import type { ChatRequestMessage, ChatRole } from "@/types/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_HISTORY_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2_000;

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
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_HISTORY_MESSAGES) {
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

  try {
    const message = await getAiProvider().completeChat({ language: body.language, messages });
    return NextResponse.json({ message });
  } catch (error) {
    if (error instanceof AiProviderError) {
      const status = error.code === "AI_NOT_CONFIGURED" ? 503 : 502;
      return NextResponse.json({ error: error.code }, { status });
    }

    return NextResponse.json({ error: "AI_PROVIDER_ERROR" }, { status: 502 });
  }
}
