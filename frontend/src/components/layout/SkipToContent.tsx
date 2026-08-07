"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

export default function SkipToContent() {
  const { t } = useLanguage();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-body-sm focus:font-semibold focus:text-primary-700 focus:shadow-card"
    >
      {t.accessibility.skipToContent}
    </a>
  );
}
