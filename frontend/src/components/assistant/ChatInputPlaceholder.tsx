"use client";

import { Mic, Paperclip, SendHorizontal, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

function DisabledActionButton({
  icon: Icon,
  label,
  className,
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
}) {
  const { t } = useLanguage();

  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        disabled
        aria-label={`${label} — ${t.features.comingSoon}`}
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-blue-950 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
      >
        {t.assistant.nextMilestone}
      </span>
    </span>
  );
}

export default function ChatInputPlaceholder() {
  const { t } = useLanguage();

  return (
    <div className="sticky bottom-0 z-20 w-full border-t border-slate-200 bg-white/95 backdrop-blur">
      <form
        onSubmit={(e) => e.preventDefault()}
        aria-label={`${t.assistant.askLabel} — ${t.features.comingSoon}`}
        className="mx-auto flex w-full max-w-3xl items-center gap-2 px-4 py-4 sm:px-6"
      >
        <DisabledActionButton icon={Paperclip} label={t.assistant.attachFile} />

        <div className="relative flex-1">
          <label htmlFor="assistant-input" className="sr-only">
            {t.assistant.askLabel}
          </label>
          <input
            id="assistant-input"
            type="text"
            placeholder={t.assistant.placeholder}
            className="w-full rounded-full border border-slate-300 bg-slate-50 px-5 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          />
        </div>

        <DisabledActionButton icon={Mic} label={t.assistant.voiceInput} />
        <DisabledActionButton
          icon={SendHorizontal}
          label={t.assistant.sendMessage}
          className="bg-blue-900/40 text-white"
        />
      </form>

      <p className="mx-auto max-w-3xl px-4 pb-3 text-center text-xs text-slate-400 sm:px-6">
        {t.assistant.prototypeNotice}
      </p>
    </div>
  );
}
