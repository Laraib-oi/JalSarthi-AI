"use client";

import { Landmark, Search } from "lucide-react";
import { useState } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";

type OfficialSourceDiscoveryProps = {
  isLoading: boolean;
  onDiscover: (query: string) => void;
};

export default function OfficialSourceDiscovery({
  isLoading,
  onDiscover,
}: OfficialSourceDiscoveryProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const canSubmit = query.trim().length > 0 && !isLoading;

  const submit = () => {
    if (!canSubmit) return;
    onDiscover(query.trim());
    setQuery("");
  };

  return (
    <section
      aria-labelledby="official-source-discovery-heading"
      aria-busy={isLoading}
      className="mx-auto mb-2 w-full max-w-3xl px-4 sm:px-6"
    >
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-white">
            <Landmark className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              {t.assistant.officialInformation.eyebrow}
            </p>
            <h2 id="official-source-discovery-heading" className="mt-1 text-lg font-bold text-emerald-950">
              {t.assistant.officialInformation.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {t.assistant.officialInformation.description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {t.assistant.officialInformation.suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={isLoading}
              onClick={() => onDiscover(suggestion)}
              className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-900 transition hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form
          className="mt-4 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <label htmlFor="official-source-query" className="sr-only">
            {t.assistant.officialInformation.searchLabel}
          </label>
          <input
            id="official-source-query"
            type="text"
            value={query}
            maxLength={200}
            disabled={isLoading}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.assistant.officialInformation.placeholder}
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-800 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {t.assistant.officialInformation.searchButton}
          </button>
        </form>
      </div>
    </section>
  );
}
