"use client";

import Image from "next/image";
import { useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Asset } from "@/types";
import { cn } from "@/utils/cn";
import { mediaUrl, productImages } from "@/utils/media";

/**
 * Main image with a thumbnail strip — beside it on desktop, under it on phones.
 * Images crossfade on a loop; the active thumbnail's progress line is the timer
 * (its animation ending advances the slide), so hovering pauses it mid-way.
 */
export default function ProductGallery({ assets, name }: { assets: Asset[]; name: string }) {
  const images = productImages(assets);
  const list = images.length ? images : [{ path: "", altText: name }];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const autoplay = list.length > 1 && !reduceMotion;

  return (
    <div
      className="flex flex-col-reverse gap-4 md:flex-row md:items-start"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      // Keyboard focus pauses too; a mouse click shouldn't leave it paused after the pointer leaves
      onFocus={(e) => e.target.matches(":focus-visible") && setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {list.length > 1 && (
        <ul
          data-stagger="0.08"
          data-delay="0.4"
          className="no-scrollbar flex shrink-0 gap-4 overflow-x-auto md:w-16 md:flex-col md:overflow-visible"
        >
          {list.map((image, i) => {
            const active = i === index;
            return (
              <li key={`${image.path}-${i}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1} of ${list.length}`}
                  aria-current={active || undefined}
                  className={cn(
                    "relative block aspect-3/4 w-16 transition-opacity duration-300",
                    active ? "opacity-100" : "opacity-60 hover:opacity-100",
                  )}
                >
                  <Image src={mediaUrl(image.path)} alt="" fill sizes="64px" className="object-cover" />
                  {active && (
                    <span
                      // Keyed by index so the timer restarts whenever the slide changes
                      key={index}
                      aria-hidden="true"
                      onAnimationEnd={() => setIndex((n) => (n + 1) % list.length)}
                      style={{ animationPlayState: paused ? "paused" : "running" }}
                      className={cn(
                        "absolute inset-x-0 -bottom-1 h-0.5 origin-left bg-accent",
                        autoplay && "animate-progress",
                      )}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {/* zoom, not a wipe: this is the page's main image, so it must paint straight away */}
      <div data-image-reveal="zoom" className="relative aspect-3/4 w-full max-w-164 overflow-hidden bg-surface">
        {list.map((image, i) => (
          <Image
            key={`${image.path}-${i}`}
            src={mediaUrl(image.path)}
            alt={image.altText || `${name} — image ${i + 1}`}
            aria-hidden={i !== index || undefined}
            fill
            priority={i === 0}
            sizes="(min-width: 48rem) 45vw, 100vw"
            className={cn(
              "object-cover transition-opacity duration-1000 ease-in-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>
    </div>
  );
}
