"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { TRANSLATIONS, type Language } from "@/constants/translations";

const LANGUAGE_STORAGE_KEY = "jalsarthi-language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (typeof TRANSLATIONS)[Language];
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === "en" || savedLanguage === "hi") setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: TRANSLATIONS[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
