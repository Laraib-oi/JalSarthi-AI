"use client";

import { useEffect, useRef, useState } from "react";
import { MessagesSquare, FileText, Languages, Clock, type LucideIcon } from "lucide-react";

const stats: { icon: LucideIcon; value: number; suffix: string; label: string }[] = [
  { icon: MessagesSquare, value: 1200, suffix: "+", label: "Simulated Citizen Queries Handled" },
  { icon: FileText, value: 50, suffix: "+", label: "Government Schemes Indexed" },
  { icon: Languages, value: 12, suffix: "", label: "Languages Planned for Support" },
  { icon: Clock, value: 24, suffix: "/7", label: "AI Availability" },
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
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          </span>
          <h2 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">Illustrative Impact Metrics</h2>
          <p className="mt-3 text-slate-600">
            Demonstration figures for prototype purposes only — not live production data.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}