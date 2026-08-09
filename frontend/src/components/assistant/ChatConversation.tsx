"use client";

import { Check, Copy, ExternalLink, LoaderCircle, Sparkles, UserRound } from "lucide-react";
import { useState } from "react";

import EmptyChatArea from "@/components/assistant/EmptyChatArea";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import type { ChatGroundingSource, ChatMessage, ChatOfficialSource } from "@/types/chat";

type ChatConversationProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  isPlannerLoading: boolean;
  isComplaintDraftLoading: boolean;
  isOfficialSourceDiscoveryLoading: boolean;
  error: string | null;
  onPromptSelect: (prompt: string) => void;
};

function uniqueSources(sources: ChatGroundingSource[]): ChatGroundingSource[] {
  return Array.from(new Map(sources.map((source) => [source.url, source])).values());
}

function uniqueOfficialSources(sources: ChatOfficialSource[]): ChatOfficialSource[] {
  return Array.from(new Map(sources.map((source) => [source.url, source])).values());
}

export default function ChatConversation({
  messages,
  isLoading,
  isPlannerLoading,
  isComplaintDraftLoading,
  isOfficialSourceDiscoveryLoading,
  error,
  onPromptSelect,
}: ChatConversationProps) {
  const { t } = useLanguage();
  const [copiedMessageId, setCopiedMessageId] = useState<string>();

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
          const sources = isUser ? [] : uniqueSources(message.grounding?.sources ?? []);
          const isPartial = message.grounding?.status === "partial";
          const isComplaintDraft = !isUser && Boolean(message.complaintDraftType);
          const officialSources = isUser ? [] : uniqueOfficialSources(message.officialSources ?? []);
          const plannerLabel =
            message.plannerSelection === "household-water-conservation"
              ? t.assistant.planner.household.label
              : message.plannerSelection === "rainwater-harvesting"
                ? t.assistant.planner.rainwater.label
                : undefined;

          return (
            <article
              key={message.id}
              className={cn("flex min-w-0 items-start gap-3", isUser && "flex-row-reverse")}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  isUser ? "bg-slate-200 text-slate-700" : "bg-blue-900 text-white"
                )}
                aria-hidden="true"
              >
                {isUser ? (
                  <UserRound className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </span>
              <div className="min-w-0 max-w-[88%] sm:max-w-[80%]">
                {!isUser && message.plannerSelection && (
                  <p className="mb-1 text-xs font-semibold text-blue-800">
                    {t.assistant.planner.resultLabel} · {plannerLabel}
                  </p>
                )}
                {isComplaintDraft && (
                  <p className="mb-1 text-xs font-semibold text-amber-800">
                    {t.assistant.complaintDraft.resultLabel}
                  </p>
                )}
                <p
                  className={cn(
                    "whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                    isUser
                      ? "rounded-tr-sm bg-blue-900 text-white"
                      : "rounded-tl-sm border border-slate-200 bg-slate-50 text-slate-700"
                  )}
                >
                  {message.content}
                </p>

                {isComplaintDraft && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(message.content);
                          setCopiedMessageId(message.id);
                        } catch {
                          setCopiedMessageId(undefined);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {copiedMessageId === message.id
                        ? t.assistant.complaintDraft.copiedDraft
                        : t.assistant.complaintDraft.copyDraft}
                    </button>
                  </div>
                )}

                {sources.length > 0 && (
                  <aside
                    className="mt-2 break-words rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2.5 text-xs text-slate-700"
                    aria-label={t.assistant.source}
                  >
                    <p className="font-semibold text-blue-950">{t.assistant.source}</p>
                    {isPartial && (
                      <p className="mt-1 text-slate-600">
                        {t.assistant.limitedInformation}
                      </p>
                    )}
                    <ul className="mt-2 space-y-2">
                      {sources.map((source) => (
                        <li key={source.url}>
                          <p className="font-medium text-slate-800">{source.documentTitle}</p>
                          <p className="mt-0.5 text-slate-600">
                            {t.assistant.officialSource}: {source.name}
                          </p>
                          <p className="mt-0.5 text-slate-600">{source.publisher}</p>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex max-w-full items-center gap-1 break-all font-medium text-blue-800 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                            aria-label={`${t.assistant.viewSource}: ${source.name}`}
                          >
                            {t.assistant.viewSource}
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}

                {officialSources.length > 0 && (
                  <aside
                    className="mt-2 break-words rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2.5 text-xs text-slate-700"
                    aria-label={t.assistant.officialInformation.resultLabel}
                  >
                    <p className="font-semibold text-emerald-950">
                      {t.assistant.officialInformation.resultLabel}
                    </p>
                    <ul className="mt-2 space-y-3">
                      {officialSources.map((source) => (
                        <li key={source.id}>
                          <p className="font-medium text-slate-800">{source.title}</p>
                          <p className="mt-0.5 leading-relaxed text-slate-600">{source.description}</p>
                          <p className="mt-1 text-slate-600">{source.publisher}</p>
                          <p className="mt-0.5 text-slate-600">
                            {t.assistant.officialInformation.lastVerified}: {source.lastVerifiedAt}
                          </p>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex max-w-full items-center gap-1 break-all font-medium text-emerald-800 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                            aria-label={`${t.assistant.viewSource}: ${source.title}`}
                          >
                            {t.assistant.viewSource}
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}
              </div>
            </article>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3" role="status">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-900 text-white">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
              <LoaderCircle
                className="h-4 w-4 animate-spin text-blue-800"
                aria-hidden="true"
              />
              {isPlannerLoading
                ? t.assistant.planner.loading
                : isComplaintDraftLoading
                  ? t.assistant.complaintDraft.loading
                  : isOfficialSourceDiscoveryLoading
                    ? t.assistant.officialInformation.loading
                  : t.assistant.loading}
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
