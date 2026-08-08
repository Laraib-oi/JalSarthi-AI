"use client";

import { useRef, useState } from "react";

import ChatConversation from "@/components/assistant/ChatConversation";
import ChatInputPlaceholder from "@/components/assistant/ChatInputPlaceholder";
import QuickServices from "@/components/assistant/QuickServices";
import GuidedWaterConservationPlanner from "@/components/assistant/GuidedWaterConservationPlanner";
import StatusBanner from "@/components/assistant/StatusBanner";
import WelcomeSection from "@/components/assistant/WelcomeSection";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type {
  ChatGroundingResponse,
  ChatGroundingSource,
  ChatMessage,
  ChatRequestMessage,
  WaterConservationPlannerSelection,
} from "@/types/chat";

type ChatApiPayload = {
  message?: unknown;
  grounding?: unknown;
  error?: unknown;
};

function isChatGroundingSource(value: unknown): value is ChatGroundingSource {
  if (!value || typeof value !== "object") return false;

  const source = value as Record<string, unknown>;
  return (
    typeof source.documentTitle === "string" &&
    typeof source.category === "string" &&
    typeof source.name === "string" &&
    typeof source.url === "string" &&
    typeof source.type === "string" &&
    typeof source.publisher === "string" &&
    typeof source.lastVerifiedAt === "string"
  );
}

function parseGrounding(value: unknown): ChatGroundingResponse | undefined {
  if (!value || typeof value !== "object") return undefined;

  const grounding = value as Record<string, unknown>;
  if (
    (grounding.status !== "relevant" &&
      grounding.status !== "partial" &&
      grounding.status !== "none") ||
    !Array.isArray(grounding.sources) ||
    !grounding.sources.every(isChatGroundingSource)
  ) {
    return undefined;
  }

  return { status: grounding.status, sources: grounding.sources };
}

function createMessage(
  role: ChatMessage["role"],
  content: string,
  grounding?: ChatGroundingResponse
): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    ...(grounding ? { grounding } : {}),
  };
}

export default function AssistantChat() {
  const { language, t } = useLanguage();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  const submitMessage = async (
    plannerSelection?: WaterConservationPlannerSelection,
    plannerLabel?: string
  ) => {
    const content = plannerLabel ?? input.trim();
    if (!content || isSubmittingRef.current) return;

    const userMessage = createMessage("user", content);
    const conversation = [...messages, userMessage];
    const requestMessages: ChatRequestMessage[] = conversation
      .slice(-20)
      .map(({ role, content: messageContent }) => ({
        role,
        content: messageContent,
      }));

    isSubmittingRef.current = true;
    setInput("");
    setError(null);
    setMessages(conversation);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          messages: requestMessages,
          ...(plannerSelection ? { plannerSelection } : {}),
        }),
      });
      const payload = (await response.json()) as ChatApiPayload;
      const responseMessage = payload.message;

      if (
        !response.ok ||
        typeof responseMessage !== "string" ||
        !responseMessage.trim()
      ) {
        const isNotConfigured = payload.error === "AI_NOT_CONFIGURED";
        throw new Error(isNotConfigured ? "AI_NOT_CONFIGURED" : "AI_PROVIDER_ERROR");
      }

      const grounding = parseGrounding(payload.grounding);
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("assistant", responseMessage.trim(), grounding),
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error && requestError.message === "AI_NOT_CONFIGURED"
          ? t.assistant.unavailable
          : t.assistant.error
      );
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  const selectPrompt = (prompt: string) => {
    if (!isLoading) {
      setInput(prompt);
      setError(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StatusBanner />

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-4 sm:px-6">
        <WelcomeSection />
        <GuidedWaterConservationPlanner
          isLoading={isLoading}
          onSelect={(selection, label) => void submitMessage(selection, label)}
        />
        <QuickServices isLoading={isLoading} onPromptSelect={selectPrompt} />
        <ChatConversation
          messages={messages}
          isLoading={isLoading}
          error={error}
          onPromptSelect={selectPrompt}
        />
      </div>

      <ChatInputPlaceholder
        value={input}
        isLoading={isLoading}
        onChange={setInput}
        onSubmit={submitMessage}
      />
    </div>
  );
}
