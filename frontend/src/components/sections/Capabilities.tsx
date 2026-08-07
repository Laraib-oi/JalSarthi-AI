import { BookOpenCheck, Droplets, FileEdit, Mic, FileSearch, Leaf } from "lucide-react";

const capabilities = [
  {
    icon: BookOpenCheck,
    title: "Scheme Guidance",
    description:
      "Step-by-step guidance on eligibility, documentation and application process for water-related government schemes.",
  },
  {
    icon: Droplets,
    title: "AI Water Assistant",
    description:
      "Conversational assistant that answers citizen queries on water supply, quality and governance in plain language.",
  },
  {
    icon: FileEdit,
    title: "Complaint Drafting",
    description:
      "Helps citizens draft clear, formal complaints for water-related grievances, ready to submit to the right authority.",
  },
  {
    icon: Mic,
    title: "Voice Assistant",
    description:
      "Voice-based interaction designed for accessibility, including low-literacy and regional-language users.",
  },
  {
    icon: FileSearch,
    title: "Official Document Search",
    description:
      "Quickly locate relevant circulars, guidelines and notifications from the Ministry's knowledge base.",
  },
  {
    icon: Leaf,
    title: "Water Conservation Advisor",
    description:
      "Practical, localized advice on water conservation and sustainable usage for households and communities.",
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          </span>
          <h2 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">What JalSarthi AI Can Do</h2>
          <p className="mt-3 text-slate-600">
            A focused set of AI-assisted capabilities built around real citizen needs in water
            governance.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900/5 text-blue-800 transition-colors group-hover:bg-blue-900 group-hover:text-white">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-blue-950">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}