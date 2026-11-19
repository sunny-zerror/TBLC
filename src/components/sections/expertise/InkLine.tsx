"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/* Where the nib's tip sits inside the pen illustration (fractions of its box) */
const NIB = { x: 0.025, y: 0.998 };
/* The line swings out to these sides of the section, alternating step by step (first step: right) */
const SIDES = [0.83, 0.17];
/* Where the ink's tip sits in the viewport as it's drawn */
const TIP = 0.6;
const SAMPLES = 400;

/**
 * The ink line of "The process": a serpentine stroke from the pen's nib, past each step, to the
 * closing button. Built from the laid-out page, so it fits any width; it draws as you scroll, its
 * tip held just below the middle of the screen. Its parent marks the anchors with `data-ink="nib"`,
 * `data-ink="step"` and `data-ink="end"`. Desktop only — on narrow screens the steps stack.
 */
export default function InkLine() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);

  useGSAP(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const gradient = gradientRef.current;
    const section = svg?.parentElement;
    if (!svg || !path || !gradient || !section) return;

    // (length, y) along the path, so a scroll position can be turned into how much ink to show
    let samples: { length: number; y: number }[] = [];
    let total = 0;

    const build = () => {
      const box = section.getBoundingClientRect();
      const nib = section.querySelector('[data-ink="nib"]')?.getBoundingClientRect();
      const end = section.querySelector('[data-ink="end"]')?.getBoundingClientRect();
      const steps = [...section.querySelectorAll('[data-ink="step"]')].map((el) => el.getBoundingClientRect());
      if (!nib || !end || !nib.width) return;

      const points = [
        { x: nib.left - box.left + nib.width * NIB.x, y: nib.top - box.top + nib.height * NIB.y },
        ...steps.map((step, i) => ({ x: box.width * SIDES[i % 2], y: step.top - box.top + step.height / 2 })),
        { x: end.left - box.left + end.width * 0.15, y: end.top - box.top },
      ];
      // Vertical tangents at every point: the stroke runs down the sides and sweeps across between steps.
      // Keeping the handles at half the drop also keeps y rising steadily, which the scroll mapping relies on.
      let d = `M${points[0].x},${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        const handle = (b.y - a.y) / 2;
        d += ` C${a.x},${a.y + handle} ${b.x},${b.y - handle} ${b.x},${b.y}`;
      }

      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      path.setAttribute("d", d);
      gradient.setAttribute("y1", String(points[0].y));
      gradient.setAttribute("y2", String(points[points.length - 1].y));

      total = path.getTotalLength();
      samples = Array.from({ length: SAMPLES + 1 }, (_, i) => {
        const length = (total * i) / SAMPLES;
        return { length, y: path.getPointAtLength(length).y };
      });
      path.style.strokeDasharray = `${total}`;
    };

    const draw = () => {
      if (!samples.length) return;
      const tip = window.innerHeight * TIP - section.getBoundingClientRect().top;
      const index = samples.findIndex((s) => s.y > tip);
      const length = index === -1 ? total : index === 0 ? 0 : samples[index - 1].length;
      path.style.strokeDashoffset = `${total - length}`;
    };

    build();
    const resize = new ResizeObserver(() => {
      build();
      draw();
    });
    resize.observe(section);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      draw();
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: draw,
      });
      return () => {
        trigger.kill();
        path.style.strokeDashoffset = "0";
      };
    });

    return () => resize.disconnect();
  });

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      fill="none"
      className="pointer-events-none absolute inset-0 hidden size-full lg:block"
    >
      <defs>
        {/* Fresh ink at the nib, thinning to blush by the last step */}
        <linearGradient ref={gradientRef} id="ink-line" gradientUnits="userSpaceOnUse" x1="0" x2="0">
          <stop offset="0" style={{ stopColor: "var(--color-ink)" }} />
          <stop offset="0.35" style={{ stopColor: "var(--color-accent)" }} />
          <stop offset="0.7" style={{ stopColor: "var(--color-accent-soft)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-blush)" }} />
        </linearGradient>
      </defs>
      <path ref={pathRef} stroke="url(#ink-line)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
