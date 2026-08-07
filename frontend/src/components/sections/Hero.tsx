import {
  ShieldCheck,
  Sparkles,
  Droplets,
  ArrowRight,
  PlayCircle,
} from "lucide-react";

const trustBadges = [
  {
    icon: Droplets,
    label: "Smart India Hackathon 2025 Prototype",
  },
  {
    icon: ShieldCheck,
    label: "Ministry of Jal Shakti • SIH Problem Statement PS-66",
  },
  {
    icon: Sparkles,
    label: "AI-Powered • Citizen-First",
  },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white"
    >
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        aria-hidden="true"
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200 blur-3xl" />
        <div className="absolute top-40 -left-20 h-72 w-72 rounded-full bg-emerald-100 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        {/* Left Content */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-900/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-900 ring-1 ring-blue-900/10">
            Government of India • Ministry of Jal Shakti
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-blue-950 sm:text-5xl">
            Empowering Every Citizen with{" "}
            <span className="text-blue-700">
              Intelligent Water Governance
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            JalSarthi AI helps citizens discover government water schemes,
            access official information, draft complaints, search public
            resources, and receive reliable guidance powered by the Ministry of
            Jal Shakti knowledge base.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#assistant"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-colors hover:bg-blue-800"
            >
              Ask JalSarthi AI
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-800"
            >
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              Explore Services
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap gap-3">
            {trustBadges.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
              >
                <Icon
                  className="h-3.5 w-3.5 text-blue-700"
                  aria-hidden="true"
                />
                {label}
              </span>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="mt-5 max-w-xl text-xs leading-relaxed text-slate-500">
            This prototype has been developed for the Smart India Hackathon
            (SIH) 2025 and is intended solely for demonstration purposes. It is
            not an official Government of India service.
          </p>
        </div>

        {/* Demo Chat Card */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-white">
                <Sparkles className="h-5 w-5" />
              </span>

              <div>
                <p className="text-sm font-semibold text-blue-950">
                  JalSarthi AI Assistant
                </p>

                <p className="text-xs font-medium text-emerald-600">
                  ● SIH 2025 Demo • Government Prototype
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="max-w-[85%] rounded-lg rounded-tl-none bg-slate-100 px-4 py-2.5 text-sm text-slate-700">
                How do I apply for the Jal Jeevan Mission scheme in my district?
              </div>

              <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-blue-900 px-4 py-2.5 text-sm text-white">
                I can help you with eligibility, required documents, application
                steps, and the nearest implementing authority for your district.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}