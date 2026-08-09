"use client";

import { useRef, useState } from "react";

import ChatConversation from "@/components/assistant/ChatConversation";
import ChatInputPlaceholder from "@/components/assistant/ChatInputPlaceholder";
import ComplaintDraftAssistant from "@/components/assistant/ComplaintDraftAssistant";
import GuidedWaterConservationPlanner from "@/components/assistant/GuidedWaterConservationPlanner";
import OfficialSourceDiscovery from "@/components/assistant/OfficialSourceDiscovery";
import StatusBanner from "@/components/assistant/StatusBanner";
import WelcomeSection from "@/components/assistant/WelcomeSection";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type {
  ChatGroundingResponse,
  ChatGroundingSource,
  ChatMessage,
  ChatOfficialSource,
  ChatRequestMessage,
  ComplaintDraftRequest,
  WaterConservationPlannerSelection,
} from "@/types/chat";

type ChatApiPayload = {
  message?: unknown;
  grounding?: unknown;
  officialSources?: unknown;
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

function isChatOfficialSource(value: unknown): value is ChatOfficialSource {
  if (!value || typeof value !== "object") return false;

  const source = value as Record<string, unknown>;
  return (
    typeof source.id === "string" &&
    typeof source.title === "string" &&
    typeof source.description === "string" &&
    typeof source.url === "string" &&
    typeof source.publisher === "string" &&
    typeof source.category === "string" &&
    typeof source.lastVerifiedAt === "string"
  );
}

function parseOfficialSources(value: unknown): ChatOfficialSource[] | undefined {
  return Array.isArray(value) && value.every(isChatOfficialSource) ? value : undefined;
}

function createMessage(
  role: ChatMessage["role"],
  content: string,
  grounding?: ChatGroundingResponse,
  plannerSelection?: WaterConservationPlannerSelection,
  complaintDraftType?: ComplaintDraftRequest["type"],
  officialSources?: ChatOfficialSource[]
): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    ...(grounding ? { grounding } : {}),
    ...(plannerSelection ? { plannerSelection } : {}),
    ...(complaintDraftType ? { complaintDraftType } : {}),
    ...(officialSources ? { officialSources } : {}),
  };
}

export default function AssistantChat() {
  const { language, t } = useLanguage();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [plannerSelectionInFlight, setPlannerSelectionInFlight] =
    useState<WaterConservationPlannerSelection>();
  const [complaintDraftInFlight, setComplaintDraftInFlight] = useState(false);
  const [officialSourceDiscoveryInFlight, setOfficialSourceDiscoveryInFlight] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  const submitMessage = async (
    plannerSelection?: WaterConservationPlannerSelection,
    plannerLabel?: string,
    complaintDraft?: ComplaintDraftRequest,
    officialSourceDiscoveryQuery?: string
  ) => {
    const content = plannerLabel ?? input.trim();
    if (!content || isSubmittingRef.current) return;

    const userMessage = createMessage(
      "user",
      content,
      undefined,
      plannerSelection,
      complaintDraft?.type
    );
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
    setPlannerSelectionInFlight(plannerSelection);
    setComplaintDraftInFlight(Boolean(complaintDraft));
    setOfficialSourceDiscoveryInFlight(Boolean(officialSourceDiscoveryQuery));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          messages: requestMessages,
          ...(plannerSelection ? { plannerSelection } : {}),
          ...(complaintDraft ? { complaintDraft } : {}),
          ...(officialSourceDiscoveryQuery
            ? { officialSourceDiscovery: { query: officialSourceDiscoveryQuery } }
            : {}),
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
      const officialSources = parseOfficialSources(payload.officialSources);
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          "assistant",
          responseMessage.trim(),
          grounding,
          plannerSelection,
          complaintDraft?.type,
          officialSources
        ),
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
      setPlannerSelectionInFlight(undefined);
      setComplaintDraftInFlight(false);
      setOfficialSourceDiscoveryInFlight(false);
    }
  };

  const selectPrompt = (prompt: string) => {
    if (!isLoading) {
      setInput(prompt);
      setError(null);
    }
  };

  const createComplaintDraft = (complaintDraft: ComplaintDraftRequest, label: string) => {
    void submitMessage(
      undefined,
      `${t.assistant.complaintDraft.detailsEntered}: ${label}`,
      complaintDraft
    );
  };

  const discoverOfficialSources = (query: string) => {
    void submitMessage(undefined, query, undefined, query);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StatusBanner />

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-4 sm:px-6">
        {messages.length === 0 && (
          <>
            <WelcomeSection />
            <GuidedWaterConservationPlanner
              isLoading={isLoading}
              onSelect={(selection, label) => void submitMessage(selection, label)}
            />
            <OfficialSourceDiscovery
              isLoading={isLoading}
              onDiscover={discoverOfficialSources}
            />
            <ComplaintDraftAssistant
              isLoading={isLoading}
              onCreateDraft={createComplaintDraft}
            />
          </>
        )}
        <ChatConversation
          messages={messages}
          isLoading={isLoading}
          isPlannerLoading={Boolean(plannerSelectionInFlight)}
          isComplaintDraftLoading={complaintDraftInFlight}
          isOfficialSourceDiscoveryLoading={officialSourceDiscoveryInFlight}
          error={error}
          onPromptSelect={selectPrompt}
        />
      </div>

      <ChatInputPlaceholder
        value={input}
        isLoading={isLoading}
        loadingLabel={
          plannerSelectionInFlight
            ? t.assistant.planner.loading
            : complaintDraftInFlight
              ? t.assistant.complaintDraft.loading
              : officialSourceDiscoveryInFlight
                ? t.assistant.officialInformation.loading
              : t.assistant.loading
        }
        onChange={setInput}
        onSubmit={submitMessage}
      />
    </div>
  );
}
