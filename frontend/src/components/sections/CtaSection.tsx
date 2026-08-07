import { ArrowRight } from "lucide-react";

import { WaveDivider } from "@/components/shared/WaveDivider";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-gradient-primary">
      <WaveDivider className="absolute inset-x-0 -top-4 text-white/25" flip />

      <div className="container flex flex-col items-center gap-6 py-20 text-center md:py-24">
        <h2 className="max-w-xl font-heading text-display-sm text-white">
          Built for every citizen who needs a clear answer on water
        </h2>
        <p className="max-w-lg text-body-lg text-white/85">
          JalSarthi AI is being developed as a public digital good under the Ministry of
          Jal Shakti — starting simple, and growing with the people who use it.
        </p>
        <Button asChild variant="outline" size="lg" className="mt-2">
          <a href="#chat">
            Start Chat with JalSarthi AI
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  );
}
