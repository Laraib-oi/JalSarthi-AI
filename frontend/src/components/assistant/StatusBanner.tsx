"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

const STATUS_TONES = ["pending", "ready", "pending", "pending"] as const;

export default function StatusBanner() {
  const { t } = useLanguage();

  return (
    <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2.5">        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
         {t.assistant.status}
        </span>

        {t.assistant.statusItems.map((item, index) => (
          <span
            key={item.label}
            className="flex items-center gap-1.5 text-xs text-slate-600"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                STATUS_TONES[index] === "ready"
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }`}
            />

            <span className="font-medium text-slate-700">
              {item.label}:
            </span>
            
            {item.value}
          </span>
        ))}
      </div>
    </div>
  );
}
