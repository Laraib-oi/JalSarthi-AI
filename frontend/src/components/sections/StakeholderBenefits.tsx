"use client";

import { Users, Briefcase, Landmark, CheckCircle2 } from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";

const groupIcons = [Users, Briefcase, Landmark];
const groupColors = ["blue", "emerald", "amber"] as const;

const colorMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-100" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-100" },
};

export default function StakeholderBenefits() {
  const { t } = useLanguage();

  return (
    <section id="benefits" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          </span>
          <h2 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">{t.benefits.heading}</h2>
          <p className="mt-3 text-slate-600">
            {t.benefits.description}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.benefits.groups.map(({ title, benefits }, index) => {
            const Icon = groupIcons[index]!;
            const c = colorMap[groupColors[index]!];
            return (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${c.bg} ${c.text} ring-1 ${c.ring}`}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-blue-950">{title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
