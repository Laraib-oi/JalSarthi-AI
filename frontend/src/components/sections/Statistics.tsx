"use client";

import { useEffect, useRef, useState } from "react";
import { MessagesSquare, FileText, Languages, Clock, type LucideIcon } from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";

const stats: { icon: LucideIcon; value: number; suffix: string }[] = [
  { icon: MessagesSquare, value: 1200, suffix: "+" },
  { icon: FileText, value: 50, suffix: "+" },
  { icon: Languages, value: 12, suffix: "" },
  { icon: Clock, value: 24, suffix: "/7" },
];

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    let frame: number;
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);
  return value;
}

function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
  active,
}: {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  active: boolean;
}) {
  const count = useCountUp(value, active);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/5 text-blue-800">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="mt-4 text-3xl font-extrabold text-blue-950">
        {count}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}

export default function Statistics() {
  const { t } = useLanguage();
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="impact" ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          </span>
          <h2 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">{t.statistics.heading}</h2>
          <p className="mt-3 text-slate-600">
            {t.statistics.description}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, index) => (
            <StatCard key={t.statistics.labels[index]} {...s} label={t.statistics.labels[index] ?? ""} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
