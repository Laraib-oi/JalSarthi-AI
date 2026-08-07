"use client";

import { useState } from "react";
import { Menu, X, Droplets, Languages, Sparkles, MessageCircle, } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");

  const navLinks = [
    { label: lang === "en" ? "Home" : "होम", href: "/#home" },
    { label: lang === "en" ? "Capabilities" : "क्षमताएँ", href: "/#capabilities" },
    { label: lang === "en" ? "How It Works" : "कार्यप्रणाली", href: "/#how-it-works" },
    { label: lang === "en" ? "Benefits" : "लाभ", href: "/#benefits" },
    { label: lang === "en" ? "About" : "परिचय", href: "/#about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      
      {/* Utility bar */}
      <div className="hidden sm:block bg-blue-950 text-blue-100 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6 lg:px-8">
          <p className="font-medium tracking-wide">
            {lang === "en"
              ? "Government of India · Ministry of Jal Shakti"
              : "भारत सरकार · जल शक्ति मंत्रालय"}
          </p>
          <div className="flex items-center gap-4">
            <a href="#main-content" className="hover:text-white underline-offset-2 hover:underline">
              {lang === "en" ? "Skip to content" : "मुख्य सामग्री पर जाएँ"}
            </a>
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="flex items-center gap-1 rounded px-2 py-0.5 hover:bg-blue-900/60 transition-colors"
              aria-label="Switch language"
            >
              <Languages className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{lang === "en" ? "English | हिन्दी" : "हिन्दी | English"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
          aria-label="Primary"
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
                {lang === "en" ? "Ministry of Jal Shakti  " : "जल शक्ति मंत्रालय · प्रोटोटाइप"}
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm font-medium text-slate-700 hover:text-blue-800 transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
  {lang === "en" ? "Official AI Assistant" : "आधिकारिक एआई सहायक"}
</span>

<Link
  href="/assistant"
  className="inline-flex items-center gap-2 rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-800 transition-colors"
>
  <MessageCircle className="h-4 w-4" aria-hidden="true" />
  {lang === "en" ? "Talk to JalSarthi" : "जलसारथी से बात करें"}
</Link>
          </div>

          <button
            className="lg:hidden rounded-md p-2 text-slate-700 hover:bg-slate-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
            <ul className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <li key={l.href}>
  <a
    href={l.href}
    onClick={() => setMobileOpen(false)}
    className="block text-sm font-medium text-slate-700 hover:text-blue-800"
  >
    {l.label}
  </a>
</li>
              ))}
            </ul>
            <Link
  href="/assistant"
  className="mt-4 flex items-center justify-center gap-2 rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white"
>
  <MessageCircle className="h-4 w-4" />
  {lang === "en" ? "Talk to JalSarthi" : "जलसारथी से बात करें"}
</Link>
          </div>
        )}
      </div>
    </header>
  );
}
