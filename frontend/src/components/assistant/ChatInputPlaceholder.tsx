"use client";

import { LoaderCircle, SendHorizontal } from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";

type ChatInputProps = {
  value: string;
  isLoading: boolean;
  loadingLabel: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function ChatInputPlaceholder({
  value,
  isLoading,
  loadingLabel,
  onChange,
  onSubmit,
}: ChatInputProps) {
  const { t } = useLanguage();
  const canSubmit = value.trim().length > 0 && !isLoading;

  return (
    <div className="sticky bottom-0 z-20 w-full border-t border-slate-200 bg-white/95 backdrop-blur">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        aria-label={t.assistant.askLabel}
        className="mx-auto flex w-full max-w-3xl items-center gap-2 px-4 py-4 sm:px-6"
      >
        <div className="relative flex-1">
          <label htmlFor="assistant-input" className="sr-only">
            {t.assistant.askLabel}
          </label>
          <input
            id="assistant-input"
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={isLoading}
            placeholder={t.assistant.placeholder}
            className="w-full rounded-full border border-slate-300 bg-slate-50 px-5 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          aria-label={isLoading ? loadingLabel : t.assistant.sendMessage}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-900 text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-900/40 disabled:opacity-60"
        >
          {isLoading ? (
            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <SendHorizontal className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </form>

      <p className="mx-auto max-w-3xl px-4 pb-3 text-center text-xs text-slate-400 sm:px-6">
        {t.assistant.chatNotice}
      </p>
    </div>
  );
}
