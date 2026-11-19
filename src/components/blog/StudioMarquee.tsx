"use client";

import Image from "next/image";
import { useRef } from "react";
import type { studioWork } from "@/data/studio";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/utils/cn";

type Piece = (typeof studioWork)[number];

/** Cruising speed, px per second */
const CRUISE = 45;
/** How quickly a fling settles back to cruising (higher = sooner) */
const SETTLE = 2.5;
/** Fastest a fling can throw the strip, px per second */
const MAX_FLING = 4000;

// Pieces sit at staggered heights and slight tilts, like prints pinned along a wall
const offsets = ["mt-12", "mt-0", "mt-24", "mt-6", "mt-16", "mt-2", "mt-20"];
const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-1", "rotate-1", "-rotate-2"];
const tapeTilts = ["rotate-3", "-rotate-2", "rotate-2", "-rotate-3", "rotate-1", "-rotate-1", "rotate-3"];

/** A print on a cream mat, taped to the stripes; hovering straightens it and lifts it off the wall */
function PieceCard({ piece, index }: { piece: Piece; index: number }) {
  const at = index % offsets.length;
  return (
    <figure className={cn("group mr-8 w-48 shrink-0 md:mr-10 md:w-56 xl:w-64", offsets[at])}>
      <div
        className={cn(
          "relative bg-cream p-2.5 pb-4 shadow-xl shadow-ink/15 transition-[rotate,translate,scale,box-shadow] duration-700 ease-out-expo group-hover:-translate-y-2 group-hover:scale-103 group-hover:rotate-0 group-hover:shadow-2xl group-hover:shadow-ink/25 md:p-3 md:pb-5",
          tilts[at],
        )}
      >
        {/* A strip of tape holding it up */}
        <span
          aria-hidden="true"
          className={cn("absolute -top-3 left-1/2 z-10 h-6 w-16 -translate-x-1/2 bg-blush/70 shadow-sm", tapeTilts[at])}
        />
        <div className="overflow-hidden bg-surface">
          <Image
            src={piece.image}
            alt={piece.name}
            width={piece.width}
            height={piece.height}
            sizes="16rem"
            draggable={false}
            className="h-auto w-full transition-[scale] duration-1000 ease-out-expo group-hover:scale-105"
          />
        </div>
        <figcaption className="mt-3 flex items-baseline justify-between gap-3 px-0.5">
          <span className="text-flourish text-body-lg text-ink">{piece.name}</span>
          <span className="shrink-0 text-eyebrow text-muted tabular-nums">
            No. {String(index + 1).padStart(2, "0")}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

/*
 * An endless strip of studio pieces. It drifts on its own; drag it (or swipe sideways on a trackpad)
 * either way and it follows, then glides on with the throw and settles back to cruising in the
 * direction it was thrown. Hovering slows it right down.
 *
 * The pieces render twice in one track; the track's x wraps across one copy's width, so the seam
 * never shows. Reduced motion: no drift, but dragging still works.
 *
 * With a mouse, a round "Drag" badge stands in for the cursor over the strip, shrinking while you drag.
 */
export default function StudioMarquee({ pieces }: { pieces: Piece[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const badge = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const el = track.current;
          const area = scope.current;
          if (!el || !area) return;

          const cruise = context.conditions?.motion ? CRUISE : 0;
          const setX = gsap.quickSetter(el, "x", "px");
          let width = el.scrollWidth / 2; // one copy
          let x = 0;
          let direction = -1; // -1 drifts left, 1 drifts right
          let velocity = -cruise;
          let hovering = false;
          let dragging = false;
          let lastX = 0;
          let lastTime = 0;
          let throwVelocity = 0;

          const resize = new ResizeObserver(() => {
            width = el.scrollWidth / 2;
          });
          resize.observe(el);

          const tick = (_time: number, deltaMs: number) => {
            const dt = Math.min(deltaMs, 64) / 1000; // a backgrounded tab shouldn't jump on return
            if (!dragging) {
              const target = cruise * direction * (hovering ? 0.2 : 1);
              velocity += (target - velocity) * (1 - Math.exp(-dt * SETTLE));
              x += velocity * dt;
            }
            if (width > 0) setX(gsap.utils.wrap(-width, 0, x));
          };
          gsap.ticker.add(tick);

          const onDown = (e: PointerEvent) => {
            if (e.button !== 0) return;
            dragging = true;
            throwVelocity = 0;
            lastX = e.clientX;
            lastTime = performance.now();
            area.setPointerCapture(e.pointerId);
          };
          const onMove = (e: PointerEvent) => {
            if (!dragging) return;
            const now = performance.now();
            const dx = e.clientX - lastX;
            x += dx;
            // Smoothed px/s, so one jittery event doesn't decide the throw
            const instant = (dx / Math.max(now - lastTime, 1)) * 1000;
            throwVelocity = throwVelocity * 0.6 + instant * 0.4;
            lastX = e.clientX;
            lastTime = now;
          };
          const onUp = (e: PointerEvent) => {
            if (!dragging) return;
            dragging = false;
            if (area.hasPointerCapture(e.pointerId)) area.releasePointerCapture(e.pointerId);
            // Held still before letting go: no throw
            if (performance.now() - lastTime > 120) throwVelocity = 0;
            velocity = gsap.utils.clamp(-MAX_FLING, MAX_FLING, throwVelocity);
            if (Math.abs(throwVelocity) > 30) direction = Math.sign(throwVelocity);
          };
          // Sideways trackpad swipes scrub it too; vertical wheel is left to the page
          const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
            e.preventDefault();
            x -= e.deltaX;
            if (Math.abs(e.deltaX) > 2) direction = e.deltaX > 0 ? -1 : 1;
          };
          const onEnter = () => (hovering = true);
          const onLeave = () => (hovering = false);

          area.addEventListener("pointerdown", onDown);
          area.addEventListener("pointermove", onMove);
          area.addEventListener("pointerup", onUp);
          area.addEventListener("pointercancel", onUp);
          area.addEventListener("wheel", onWheel, { passive: false });
          area.addEventListener("pointerenter", onEnter);
          area.addEventListener("pointerleave", onLeave);

          return () => {
            gsap.ticker.remove(tick);
            resize.disconnect();
            area.removeEventListener("pointerdown", onDown);
            area.removeEventListener("pointermove", onMove);
            area.removeEventListener("pointerup", onUp);
            area.removeEventListener("pointercancel", onUp);
            area.removeEventListener("wheel", onWheel);
            area.removeEventListener("pointerenter", onEnter);
            area.removeEventListener("pointerleave", onLeave);
          };
        },
      );

      // The "Drag" badge: follows the pointer over the strip (instantly with reduced motion)
      mm.add({ fine: "(pointer: fine)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
        const area = scope.current;
        const dot = badge.current;
        if (!context.conditions?.fine || !area || !dot) return;
        const duration = context.conditions.reduce ? 0 : 0.5;
        gsap.set(dot, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
        const moveX = gsap.quickTo(dot, "x", { duration, ease: "power3" });
        const moveY = gsap.quickTo(dot, "y", { duration, ease: "power3" });
        const at = (e: PointerEvent) => {
          const box = area.getBoundingClientRect();
          return { x: e.clientX - box.left, y: e.clientY - box.top };
        };
        const size = (scale: number, autoAlpha = 1) =>
          gsap.to(dot, { scale, autoAlpha, duration: duration && 0.4, ease: "power3.out", overwrite: "auto" });

        const onEnter = (e: PointerEvent) => {
          const p = at(e);
          gsap.set(dot, p);
          size(1);
        };
        const onMove = (e: PointerEvent) => {
          const p = at(e);
          moveX(p.x);
          moveY(p.y);
        };
        const onDown = () => size(0.75);
        const onUp = () => size(1);
        const onLeave = () => size(0, 0);

        area.addEventListener("pointerenter", onEnter);
        area.addEventListener("pointermove", onMove);
        area.addEventListener("pointerdown", onDown);
        area.addEventListener("pointerup", onUp);
        area.addEventListener("pointerleave", onLeave);
        return () => {
          area.removeEventListener("pointerenter", onEnter);
          area.removeEventListener("pointermove", onMove);
          area.removeEventListener("pointerdown", onDown);
          area.removeEventListener("pointerup", onUp);
          area.removeEventListener("pointerleave", onLeave);
        };
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      role="region"
      aria-roledescription="carousel"
      aria-label="Recent studio pieces — drag to browse"
      // pan-y: a vertical swipe on a phone still scrolls the page; sideways drags move the strip
      className="relative cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing pointer-fine:cursor-none pointer-fine:active:cursor-none"
    >
      {/* Padded so the tilted prints and their tape aren’t clipped */}
      <div ref={track} className="flex w-max items-start py-8 will-change-transform">
        {pieces.map((piece, i) => (
          <PieceCard key={piece.name} piece={piece} index={i} />
        ))}
        {/* The second copy closes the loop; screen readers get the pieces once */}
        <div aria-hidden="true" className="contents">
          {pieces.map((piece, i) => (
            <PieceCard key={`${piece.name}-copy`} piece={piece} index={i} />
          ))}
        </div>
      </div>

      <div
        ref={badge}
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-0 left-0 z-20 center size-22 rounded-full bg-accent text-eyebrow text-cream shadow-xl shadow-ink/20"
      >
        Drag
      </div>
    </div>
  );
}
