import { Landmark, MessageCircle } from "lucide-react";

import { ConversationSuggestions } from "@/components/assistant/ConversationSuggestions";

export default function EmptyChatArea() {
  return (
    <section
      aria-label="Conversation area"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6"
    >
      <div className="animate-in fade-in flex w-full flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 px-8 py-12 text-center shadow-sm duration-500 sm:px-16">
        <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 ring-1 ring-blue-100">
          <Landmark className="h-8 w-8 text-blue-800" aria-hidden="true" />
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
            <MessageCircle className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
          </span>
        </div>

        <p className="text-lg font-semibold text-blue-950">Your conversation starts here</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          JalSarthi AI can assist citizens with government water schemes, policies,
          complaint drafting and official guidance.
        </p>
      </div>

      <div className="mt-8 w-full">
        <ConversationSuggestions />
      </div>
    </section>
  );
}