"use client";

import { FilePenLine, MapPin, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import type { ComplaintDraftRequest, ComplaintDraftType } from "@/types/chat";

type ComplaintDraftAssistantProps = {
  isLoading: boolean;
  onCreateDraft: (request: ComplaintDraftRequest, label: string) => void;
};

export default function ComplaintDraftAssistant({
  isLoading,
  onCreateDraft,
}: ComplaintDraftAssistantProps) {
  const { t } = useLanguage();
  const [type, setType] = useState<ComplaintDraftType>();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateOrDuration, setDateOrDuration] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  const options: Array<{ id: ComplaintDraftType; label: string }> = [
    { id: "no_water_supply", label: t.assistant.complaintDraft.noWaterSupply },
    { id: "water_leakage", label: t.assistant.complaintDraft.waterLeakage },
    { id: "water_quality_concern", label: t.assistant.complaintDraft.waterQualityConcern },
  ];
  const selectedLabel = options.find((option) => option.id === type)?.label;

  const submit = () => {
    if (!type || !description.trim()) {
      setShowValidation(true);
      return;
    }

    onCreateDraft(
      {
        type,
        description: description.trim(),
        ...(location.trim() ? { location: location.trim() } : {}),
        ...(dateOrDuration.trim() ? { dateOrDuration: dateOrDuration.trim() } : {}),
      },
      selectedLabel!
    );
  };

  return (
    <section
      aria-labelledby="complaint-draft-heading"
      aria-busy={isLoading}
      className="mx-auto mb-2 w-full max-w-3xl px-4 sm:px-6"
    >
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-700 text-white">
            <FilePenLine className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              {t.assistant.complaintDraft.eyebrow}
            </p>
            <h2 id="complaint-draft-heading" className="mt-1 text-lg font-bold text-amber-950">
              {t.assistant.complaintDraft.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {t.assistant.complaintDraft.description}
            </p>
          </div>
        </div>

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-600">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-800" aria-hidden="true" />
          {t.assistant.complaintDraft.privacyNotice}
        </p>

        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-slate-800">
            {t.assistant.complaintDraft.chooseIssue}
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={type === option.id}
                disabled={isLoading}
                onClick={() => {
                  setType(option.id);
                  setShowValidation(false);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-medium text-slate-800 transition hover:border-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 disabled:cursor-not-allowed disabled:opacity-60 aria-pressed:border-amber-700 aria-pressed:bg-amber-100"
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        {type && (
          <div className="mt-4 space-y-3 rounded-xl border border-amber-100 bg-white/80 p-3 sm:p-4">
            <label className="block text-sm font-semibold text-slate-800" htmlFor="complaint-description">
              {t.assistant.complaintDraft.descriptionLabel}
            </label>
            <textarea
              id="complaint-description"
              value={description}
              maxLength={1000}
              required
              rows={3}
              onChange={(event) => {
                setDescription(event.target.value);
                setShowValidation(false);
              }}
              placeholder={t.assistant.complaintDraft.descriptionPlaceholder}
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
            />
            <p className="text-xs leading-relaxed text-slate-600">
              {t.assistant.complaintDraft.descriptionHelp}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-800" htmlFor="complaint-location">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-amber-800" aria-hidden="true" />
                  {t.assistant.complaintDraft.locationLabel}
                </span>
                <input
                  id="complaint-location"
                  value={location}
                  maxLength={250}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder={t.assistant.complaintDraft.locationPlaceholder}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                />
              </label>
              <label className="block text-sm font-medium text-slate-800" htmlFor="complaint-date-duration">
                {t.assistant.complaintDraft.dateLabel}
                <input
                  id="complaint-date-duration"
                  value={dateOrDuration}
                  maxLength={250}
                  onChange={(event) => setDateOrDuration(event.target.value)}
                  placeholder={t.assistant.complaintDraft.datePlaceholder}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                />
              </label>
            </div>

            {showValidation && (
              <p role="alert" className="text-sm text-rose-700">
                {t.assistant.complaintDraft.required}
              </p>
            )}
            <button
              type="button"
              disabled={isLoading}
              onClick={submit}
              className="rounded-xl bg-amber-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t.assistant.complaintDraft.createDraft}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
