"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/utils/cn";

interface SketchImageProps {
  src: string;
  /** The drawing's lines traced to SVG paths: { viewBox, paths } — top of the drawing first */
  linesSrc: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
}

/** Seconds: each line draws for DRAW, the starts spread over SPREAD, the artwork settles in over SETTLE */
const DRAW = 0.8;
const SPREAD = 0.9;
const SETTLE = 0.6;
/** The traced lines' strength — set to match the artwork's line opacity */
const STROKE_OPACITY = 0.72;

/*
 * A line illustration that sketches itself whenever it scrolls into view: its traced lines draw like a
 * pen working down the page, then the original artwork (shading and all) settles in over them —
 * under 2 seconds in all. Scrolling away resets it, so it draws again on every visit (the footer
 * stays mounted between pages, so a new page replays it too). The lines load only as it nears the screen.
 * Reduced motion, or the lines failing to load: just the image.
 */
export default function SketchImage({ src, linesSrc, alt, width, height, sizes, className }: SketchImageProps) {
  const scope = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{ viewBox: string; paths: string[] } | null>(null);

  // Fetch the paths well before the drawing is reached, so it's ready when it scrolls in
  useEffect(() => {
    const el = scope.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        fetch(linesSrc)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => !cancelled && data?.paths && setLines(data))
          .catch(() => {});
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [linesSrc]);

  useGSAP(
    () => {
      if (!lines) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const art = scope.current?.querySelector("img");
        const svg = scope.current?.querySelector("svg");
        const strokes = gsap.utils.toArray<SVGPathElement>("path", svg);
        if (!art || !svg || !strokes.length) return;

        strokes.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        });
        gsap.set(art, { opacity: 0 });
        gsap.set(svg, { opacity: 1 });

        // Draws every time it comes into view (either way), and resets once it's fully out of sight
        gsap
          .timeline({
            scrollTrigger: {
              trigger: scope.current,
              start: "top 85%",
              end: "bottom top",
              toggleActions: "restart reset restart reset",
            },
          })
          .to(strokes, { strokeDashoffset: 0, duration: DRAW, ease: "power1.inOut", stagger: { amount: SPREAD } })
          // A true crossfade (same start, length and curve), so the brightness holds steady through the swap
          .to(art, { opacity: 1, duration: SETTLE, ease: "none" }, DRAW + SPREAD - SETTLE)
          .to(svg, { opacity: 0, duration: SETTLE, ease: "none" }, DRAW + SPREAD - SETTLE);

        // The footer may already be on screen (short pages): measure again now the lines exist
        ScrollTrigger.refresh();
      });
      return () => mm.revert();
    },
    { scope, dependencies: [lines] },
  );

  return (
    <div ref={scope} className={cn("relative", className)}>
      <Image src={src} alt={alt} width={width} height={height} sizes={sizes} className="h-auto w-full" />
      {lines && (
        <svg
          viewBox={lines.viewBox}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full opacity-0"
          fill="none"
          stroke="currentColor"
          // Matches the artwork's own ink (its lines sit at ~72% opacity), so the hand-over doesn't dim
          strokeOpacity={STROKE_OPACITY}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {lines.paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      )}
    </div>
  );
}
