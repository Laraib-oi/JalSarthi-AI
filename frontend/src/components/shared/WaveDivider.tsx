import { cn } from "@/lib/utils";

interface WaveDividerProps {
  className?: string;
  /** Flips the curve so consecutive dividers don't look identical. */
  flip?: boolean;
}

/**
 * A single flowing line, referencing a river's current, used as the
 * recurring visual signature between major landing-page sections instead
 * of a hard edge. Deliberately quiet — one stroke, no fill, no motion —
 * so it reads as a governance-grade detail rather than decoration.
 */
export function WaveDivider({ className, flip = false }: WaveDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none w-full overflow-hidden leading-[0]", className)}
    >
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className={cn("h-8 w-full text-primary-100", flip && "-scale-y-100")}
      >
        <path
          d="M0 32 C 240 4, 480 60, 720 32 S 1200 4, 1440 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
