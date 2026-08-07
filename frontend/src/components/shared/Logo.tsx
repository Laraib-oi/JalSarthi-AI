import { Droplets } from "lucide-react";
import Link from "next/link";

import { SITE } from "@/constants/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Use the light variant on dark/gradient surfaces such as the footer. */
  variant?: "default" | "light";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="#home"
      className={cn(
        "flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        className
      )}
      aria-label={`${SITE.name} — Home`}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-soft"
        )}
      >
        <Droplets className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
      </span>
      <span
        className={cn(
          "font-heading text-heading-md leading-none",
          isLight ? "text-white" : "text-ink"
        )}
      >
        {SITE.name}
      </span>
    </Link>
  );
}
