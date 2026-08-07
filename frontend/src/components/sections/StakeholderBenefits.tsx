import { Users, Briefcase, Landmark, CheckCircle2 } from "lucide-react";

const groups = [
  {
    icon: Users,
    title: "Citizens",
    color: "blue",
    benefits: [
      "Simple, jargon-free answers to water scheme queries",
      "Faster, guided complaint drafting",
      "24/7 availability in multiple languages",
    ],
  },
  {
    icon: Briefcase,
    title: "Government Officers",
    color: "emerald",
    benefits: [
      "Reduced repetitive query load",
      "Structured, pre-drafted complaint summaries",
      "Faster access to relevant circulars and guidelines",
    ],
  },
  {
    icon: Landmark,
    title: "Ministry",
    color: "amber",
    benefits: [
      "Consistent, standardized citizen communication",
      "Better visibility into common citizen concerns",
      "Scalable first point of contact for water governance",
    ],
  },
] as const;

const colorMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-100" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-100" },
};

export default function StakeholderBenefits() {
  return (
    <section id="benefits" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          </span>
          <h2 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">Built for Everyone Involved</h2>
          <p className="mt-3 text-slate-600">
            Designed to create value across citizens, officers and the Ministry.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {groups.map(({ icon: Icon, title, benefits, color }) => {
            const c = colorMap[color];
            return (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${c.bg} ${c.text} ring-1 ${c.ring}`}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-blue-950">{title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}