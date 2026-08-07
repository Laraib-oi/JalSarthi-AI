import type { LucideIcon } from "lucide-react";
import {
  BookOpenCheck,
  Droplets,
  FileEdit,
  FileSearch,
  Landmark,
  Leaf,
} from "lucide-react";

interface Suggestion {
  icon: LucideIcon;
  text: string;
}

const SUGGESTIONS: Suggestion[] = [
  { icon: BookOpenCheck, text: "How do I apply for Jal Jeevan Mission?" },
  { icon: Droplets, text: "Find rainwater harvesting guidelines." },
  { icon: FileEdit, text: "Draft a complaint about water supply." },
  { icon: Landmark, text: "Explain Atal Bhujal Yojana." },
  { icon: Leaf, text: "Water conservation tips." },
  { icon: FileSearch, text: "Check eligibility for PMKSY." },
];

export function ConversationSuggestions() {
  return (
    <div>
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
        Try asking
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SUGGESTIONS.map(({ icon: Icon, text }, i) => (
          <button
            key={text}
            type="button"
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-in fade-in slide-in-from-bottom-2 group flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm duration-500 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-900/5 text-blue-800 transition-colors group-hover:bg-blue-900 group-hover:text-white">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm leading-snug text-slate-700 group-hover:text-blue-950">
              {text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}