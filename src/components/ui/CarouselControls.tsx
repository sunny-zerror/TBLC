"use client";

import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import CarouselDots from "@/components/ui/CarouselDots";
import { cn } from "@/utils/cn";

const arrowClass =
  "center size-10 shrink-0 rounded-full border border-accent-soft text-accent transition-colors duration-300 hover:bg-accent hover:text-cream";

type CarouselControlsProps = React.ComponentProps<typeof CarouselDots> & {
  onPrev: () => void;
  onNext: () => void;
};

/** ← dots → under a carousel. Pass the `dots` from useLoopCarousel plus prev/next handlers. */
export default function CarouselControls({ onPrev, onNext, className, ...dots }: CarouselControlsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      <button type="button" onClick={onPrev} aria-label="Previous slide" className={arrowClass}>
        <RiArrowLeftLine className="size-4" />
      </button>
      <CarouselDots {...dots} />
      <button type="button" onClick={onNext} aria-label="Next slide" className={arrowClass}>
        <RiArrowRightLine className="size-4" />
      </button>
    </div>
  );
}
