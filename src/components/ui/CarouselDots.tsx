"use client";

import { cn } from "@/utils/cn";

interface CarouselDotsProps {
  /** One accessible label per slide, e.g. the product name */
  labels: string[];
  active: number;
  onSelect: (index: number) => void;
  /** When autoplay runs, the active pill fills from empty via `fillRef` (set its scaleX) */
  autoplay: boolean;
  fillRef: React.Ref<HTMLSpanElement>;
  className?: string;
}

/** Dots that stretch into a pill for the active slide; the pill fills with the autoplay countdown */
export default function CarouselDots({ labels, active, onSelect, autoplay, fillRef, className }: CarouselDotsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)} role="group" aria-label="Choose slide">
      {labels.map((label, i) => {
        const current = i === active;
        return (
          <button
            key={`${label}-${i}`}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Go to ${label}`}
            aria-current={current || undefined}
            className="group/dot p-1.5"
          >
            <span
              className={cn(
                "relative block h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-500 ease-out-expo",
                current ? "w-10 bg-blush" : "w-1.5 bg-line group-hover/dot:bg-accent-soft",
              )}
            >
              {current && (
                <span
                  ref={fillRef}
                  // Starts empty and fills with the countdown; full and still when there's no autoplay
                  style={{ transform: autoplay ? "scaleX(0)" : "scaleX(1)" }}
                  className="absolute inset-0 origin-left rounded-full bg-accent"
                />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
