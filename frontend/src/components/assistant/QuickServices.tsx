import type { LucideIcon } from "lucide-react";
import {
  Droplets,
  FileEdit,
  FileSearch,
  HelpCircle,
  PhoneCall,
  ScrollText,
} from "lucide-react";

interface QuickService {
  icon: LucideIcon;
  label: string;
}

const QUICK_SERVICES: QuickService[] = [
  { icon: FileSearch, label: "Scheme Search" },
  { icon: FileEdit, label: "Complaint Draft" },
  { icon: Droplets, label: "Water Saving Tips" },
  { icon: ScrollText, label: "Policies" },
  { icon: PhoneCall, label: "Emergency Contacts" },
  { icon: HelpCircle, label: "FAQ" },
];

export default function QuickServices() {
  return (
    <section aria-label="Quick services" className="mx-auto w-full max-w-3xl px-4 pb-2 sm:px-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
      </p>
      <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
        {QUICK_SERVICES.map(({ icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            className="group flex min-w-[132px] cursor-pointer flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900/5 text-blue-800 transition-colors group-hover:bg-blue-900 group-hover:text-white">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-xs font-medium text-slate-700 group-hover:text-blue-950">
              {label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}