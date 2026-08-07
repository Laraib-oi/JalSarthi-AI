"use client";

import { BookOpenCheck, Droplets, FileEdit, Mic, FileSearch, Leaf } from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";

const capabilityIcons = [BookOpenCheck, Droplets, FileEdit, Mic, FileSearch, Leaf];

export default function Capabilities() {
  const { t } = useLanguage();

  return (
    <section id="capabilities" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          </span>
          <h2 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">{t.capabilities.heading}</h2>
          <p className="mt-3 text-slate-600">
            {t.capabilities.description}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.capabilities.items.map(({ title, description }, index) => {
            const Icon = capabilityIcons[index]!;
            return (
            <div
              key={title}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900/5 text-blue-800 transition-colors group-hover:bg-blue-900 group-hover:text-white">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-blue-950">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
