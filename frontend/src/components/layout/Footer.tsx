"use client";

import { Droplets, ExternalLink, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-blue-950 text-blue-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                <Droplets className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </span>
              <div>
                <p className="text-base font-bold text-white">JalSarthi AI</p>
                <div className="text-xs text-blue-300">
                  <p>{t.footer.ministry}</p>
                  <p>{t.footer.portal}</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-blue-300">
              {t.footer.description}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">{t.footer.quickLinks}</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/#capabilities" className="hover:text-white transition-colors">
                  {t.footer.services}
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  {t.footer.howItWorks}
                </Link>
              </li>
              <li>
                <Link href="/#impact" className="hover:text-white transition-colors">
                  {t.footer.impact}
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-white transition-colors">
                  {t.footer.assistant}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">{t.footer.aboutPrototype}</p>
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-relaxed text-amber-200">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>
                {t.footer.prototypeNotice}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-blue-400 sm:flex-row">
          <p>© {new Date().getFullYear()} JalSarthi AI </p>
          <a
            href="https://github.com/Laraib-oi/JalSarthi-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            {t.footer.repository}
          </a>
        </div>
      </div>
    </footer>
  );
}
