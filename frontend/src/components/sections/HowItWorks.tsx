"use client";

import { Fragment } from "react";
import { User, Sparkles, BookOpenText, ShieldCheck, ArrowRight } from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";

const stepIcons = [User, Sparkles, BookOpenText, ShieldCheck];

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="bg-blue-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-300"></span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{t.howItWorks.heading}</h2>
          <p className="mt-3 text-blue-200">
            {t.howItWorks.description}
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
          {t.howItWorks.steps.map((step, i) => {
            const Icon = stepIcons[i]!;
            return (
            <Fragment key={step.title}>
              <div className="flex items-center gap-4 lg:flex-1 lg:flex-col lg:text-center">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                  <Icon className="h-7 w-7 text-amber-400" aria-hidden="true" />
                </span>
                <div className="lg:mt-4">
                  <h3 className="text-base font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-blue-200 lg:mx-auto lg:max-w-[180px]">
                    {step.description}
                  </p>
                </div>
              </div>

              {i < t.howItWorks.steps.length - 1 && (
                <div className="hidden lg:flex lg:items-center lg:pt-8">
                  <ArrowRight className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
              )}
            </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
