"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X, Droplets, Languages, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { label: t.navbar.home, href: "/#home" },
    { label: t.navbar.capabilities, href: "/#capabilities" },
    { label: t.navbar.howItWorks, href: "/#how-it-works" },
    { label: t.navbar.benefits, href: "/#benefits" },
    { label: t.navbar.about, href: "/#about" },
    { label: t.navbar.monitor, href: "/city-monitor" },
  ];

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full">
      
      <div className="bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
          aria-label={t.navbar.primaryNavigation}
        >
          <Link href="/#home" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-900 text-white shadow-inner ring-2 ring-amber-500/40">
              <Droplets className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-bold text-blue-950">
                JalSarthi <span className="text-blue-700">AI</span>
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                {t.navbar.ministry}
              </span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
  {t.navbar.officialAssistant}
</span>

            <Link href="/assistant" className="hidden items-center gap-2 rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-800 sm:inline-flex">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {t.navbar.talkToAssistant}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="rounded-md p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? t.navbar.closeMenu : t.navbar.openMenu}
              aria-expanded={menuOpen}
              aria-controls="primary-navigation-menu"
            >
              {menuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div id="primary-navigation-menu" className="border-t border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex flex-col gap-1" aria-label={t.navbar.primaryNavigation}>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setMenuOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700">{l.label}</a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 sm:min-w-52">
              <button onClick={() => setLanguage(language === "en" ? "hi" : "en")} className="flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700" aria-label={t.navbar.switchLanguage}><Languages className="h-4 w-4" aria-hidden="true" /><span>{language === "en" ? "English | हिन्दी" : "हिन्दी | English"}</span></button>
              <Link href="/assistant" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white"><MessageCircle className="h-4 w-4" aria-hidden="true" />{t.navbar.talkToAssistant}</Link>
            </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
