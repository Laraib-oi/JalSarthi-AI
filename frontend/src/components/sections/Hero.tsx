"use client";

import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  PlayCircle,
  User,
} from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";

const trustBadgeIcons = [ShieldCheck, Sparkles];

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white"
    >
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        aria-hidden="true"
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200 blur-3xl" />
        <div className="absolute top-40 -left-20 h-72 w-72 rounded-full bg-emerald-100 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        {/* Left Content */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-900/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-900 ring-1 ring-blue-900/10">
            {t.hero.eyebrow}
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-blue-950 sm:text-5xl">
            {t.hero.headingStart}{" "}
            <span className="text-blue-700">
              {t.hero.headingAccent}
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t.hero.description}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/assistant"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-colors hover:bg-blue-800"
            >
              {t.hero.askAssistant}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <a
              href="#capabilities"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-800"
            >
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              {t.hero.exploreServices}
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap gap-3">
            {trustBadgeIcons.map((Icon, index) => (
              <span
                key={t.hero.trustBadges[index]}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
              >
                <Icon
                  className="h-3.5 w-3.5 text-blue-700"
                  aria-hidden="true"
                />
                {t.hero.trustBadges[index]}
              </span>
            ))}
          </div>

        </div>

        {/* Demo Chat Card */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-white">
                <Sparkles className="h-5 w-5" />
              </span>

              <div>
                <p className="text-sm font-semibold text-blue-950">
                  {t.hero.assistantName}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-end justify-end gap-2">
                <div className="max-w-[85%] break-words rounded-lg rounded-tr-none bg-blue-900 px-4 py-2.5 text-sm text-white">
                  {t.hero.demoQuestion}
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-blue-800 ring-1 ring-slate-200">
                  <User className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>

              <div className="flex items-end gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-900 text-white">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="max-w-[85%] break-words rounded-lg rounded-tl-none bg-blue-50 px-4 py-2.5 text-sm text-blue-950">
                  {t.hero.demoResponse}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
