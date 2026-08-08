"use client";

import { LoaderCircle, Sparkles, UserRound } from "lucide-react";

import EmptyChatArea from "@/components/assistant/EmptyChatArea";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

type ChatConversationProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onPromptSelect: (prompt: string) => void;
};

export default function ChatConversation({
  messages,
  isLoading,
  error,
  onPromptSelect,
}: ChatConversationProps) {
  const { t } = useLanguage();

  if (messages.length === 0) {
    return <EmptyChatArea isLoading={isLoading} onPromptSelect={onPromptSelect} />;
  }

  return (
    <section
      aria-label={t.assistant.conversationArea}
      aria-live="polite"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6"
    >
      <div className="space-y-5">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <article
              key={message.id}
              className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  isUser ? "bg-slate-200 text-slate-700" : "bg-blue-900 text-white"
                )}
                aria-hidden="true"
              >
                {isUser ? <UserRound className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              </span>
              <p
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                  isUser
                    ? "rounded-tr-sm bg-blue-900 text-white"
                    : "rounded-tl-sm border border-slate-200 bg-slate-50 text-slate-700"
                )}
              >
                {message.content}
              </p>
            </article>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3" role="status">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-900 text-white">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
              <LoaderCircle className="h-4 w-4 animate-spin text-blue-800" aria-hidden="true" />
              {t.assistant.loading}
            </span>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-800"
          >
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
