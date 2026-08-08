"use client";

import { ChevronLeft, Droplets, Sprout } from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import type { WaterConservationPlannerSelection } from "@/types/chat";

type GuidedWaterConservationPlannerProps = {
  isLoading: boolean;
  onSelect: (selection: WaterConservationPlannerSelection, label: string) => void;
};

export default function GuidedWaterConservationPlanner({
  isLoading,
  onSelect,
}: GuidedWaterConservationPlannerProps) {
  const { t } = useLanguage();
  const options: Array<{
    id: WaterConservationPlannerSelection;
    label: string;
    description: string;
    Icon: typeof Droplets;
  }> = [
    {
      id: "household-water-conservation",
      label: t.assistant.planner.household.label,
      description: t.assistant.planner.household.description,
      Icon: Droplets,
    },
    {
      id: "rainwater-harvesting",
      label: t.assistant.planner.rainwater.label,
      description: t.assistant.planner.rainwater.description,
      Icon: Sprout,
    },
  ];

  return (
    <section
      aria-labelledby="water-conservation-planner-heading"
      aria-busy={isLoading}
      className="mx-auto mb-2 w-full max-w-3xl px-4 sm:px-6"
    >
      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 shadow-sm sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-900 text-white">
            <Droplets className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">
              {t.assistant.planner.eyebrow}
            </p>
            <h2 id="water-conservation-planner-heading" className="mt-1 text-lg font-bold text-blue-950">
              {t.assistant.planner.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {t.assistant.planner.description}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm font-semibold text-slate-800">{t.assistant.planner.question}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {options.map(({ id, label, description, Icon }) => (
            <button
              key={id}
              type="button"
              disabled={isLoading}
              onClick={() => onSelect(id, label)}
              className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-800" aria-hidden="true" />
              <span>
                <span className="block text-sm font-semibold text-slate-800">{label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-600">{description}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-600">
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {t.assistant.planner.resetHint}
        </p>
      </div>
    </section>
  );
}
