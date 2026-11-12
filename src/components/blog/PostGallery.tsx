"use client";

import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import Image from "next/image";
import { useState } from "react";
import type { BlogImage } from "@/data/blog";
import { cn } from "@/utils/cn";

const arrowClass =
  "center size-10 shrink-0 text-ink transition-transform duration-300 hover:scale-125 disabled:opacity-0";

/**
 * A post's photos, cover first, crossfading under arrows set out at the screen edges.
 * Only the current photo and its neighbours are mounted (some posts have 15+), plus any already seen.
 */
export default function PostGallery({ images, title }: { images: BlogImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState(() => new Set([0]));
  const many = images.length > 1;

  function go(step: number) {
    const next = (index + step + images.length) % images.length;
    setIndex(next);
    setSeen((s) => new Set(s).add(next));
  }

  return (
    <div className="relative">
      {/* zoom, not a wipe: this is the page's main image, so it must paint straight away */}
      <div
        data-image-reveal="zoom"
        className="relative aspect-4/3 overflow-hidden rounded-sm bg-surface md:aspect-16/9"
        aria-roledescription={many ? "carousel" : undefined}
        aria-label={many ? `Photos from “${title}”` : undefined}
      >
        {images.map((image, i) => {
          const near = Math.abs(i - index) <= 1 || (index === 0 && i === images.length - 1);
          if (!near && !seen.has(i)) return null;
          return (
            <Image
              key={image.src}
              src={image.src}
              alt={i === 0 ? title : image.caption || `From “${title}”, photo ${i + 1}`}
              aria-hidden={i !== index || undefined}
              fill
              priority={i === 0}
              sizes="(min-width: 100rem) 88rem, 92vw"
              className={cn(
                "object-cover transition-opacity duration-1000 ease-in-out",
                i === index ? "opacity-100" : "opacity-0",
              )}
            />
          );
        })}
        {many && (
          <p aria-live="polite" className="absolute right-4 bottom-4 bg-cream/90 px-2.5 py-1 text-small tabular-nums">
            {index + 1} / {images.length}
          </p>
        )}
      </div>

      {many && (
        <>
          {/* In the page gutter on wide screens, over the photo's edges on phones */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className={cn(
              arrowClass,
              "absolute top-1/2 left-2 -translate-y-1/2 md:-left-[calc(var(--spacing-gutter)/2+1.25rem)]",
            )}
          >
            <RiArrowLeftLine className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className={cn(
              arrowClass,
              "absolute top-1/2 right-2 -translate-y-1/2 md:-right-[calc(var(--spacing-gutter)/2+1.25rem)]",
            )}
          >
            <RiArrowRightLine className="size-5" />
          </button>
        </>
      )}
    </div>
  );
}
