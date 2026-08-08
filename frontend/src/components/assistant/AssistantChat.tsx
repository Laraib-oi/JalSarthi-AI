"use client";

import { useRef, useState } from "react";

import ChatConversation from "@/components/assistant/ChatConversation";
import ChatInputPlaceholder from "@/components/assistant/ChatInputPlaceholder";
import QuickServices from "@/components/assistant/QuickServices";
import StatusBanner from "@/components/assistant/StatusBanner";
import WelcomeSection from "@/components/assistant/WelcomeSection";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { ChatMessage, ChatRequestMessage } from "@/types/chat";

type ChatApiResponse = {
  message?: unknown;
  error?: unknown;
};

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
  };
}

export default function AssistantChat() {
  const { language, t } = useLanguage();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  const submitMessage = async () => {
    const content = input.trim();
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
        body: JSON.stringify({ language, messages: requestMessages }),
      });
      const payload = (await response.json()) as ChatApiResponse;
      const responseMessage = payload.message;

      if (!response.ok || typeof responseMessage !== "string" || !responseMessage.trim()) {
        const isNotConfigured = payload.error === "AI_NOT_CONFIGURED";
        throw new Error(isNotConfigured ? "AI_NOT_CONFIGURED" : "AI_PROVIDER_ERROR");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("assistant", responseMessage.trim()),
      ]);
    } catch (requestError) {
      setError(requestError instanceof Error && requestError.message === "AI_NOT_CONFIGURED" ? t.assistant.unavailable : t.assistant.error);
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
