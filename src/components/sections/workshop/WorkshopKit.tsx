"use client";

import Image from "next/image";
import { useState } from "react";
import type { WorkshopKit as Kit } from "@/data/classroom";

/** Midpoint of the markers along one axis: the photo crops around it, so every marker stays in frame */
const focus = (values: number[]) => (Math.min(...values) + Math.max(...values)) / 2;

/*
 * Where a point of the photo lands once object-cover has cropped it (lg up, where the photo stretches
 * to the list's height). The marker list is a size container's child, so 100cqw/100cqh are the frame;
 * --s is the cover scale (px per photo pixel). Below lg the frame keeps the photo's proportions, so
 * plain percentages are exact — and Chrome reports 0 for cqh on an aspect-ratio box anyway.
 */
const place = (axis: "w" | "h", focusAt: number, at: number) =>
  `calc((100cq${axis} - var(--i${axis}) * var(--s)) * ${focusAt / 100} + var(--i${axis}) * var(--s) * ${at / 100})`;

/*
 * "In your kit": a mounted photo with numbered markers, beside the matching numbered list. On large
 * screens the photo stretches to the list's height. Hovering a marker picks out its row — a wash
 * sweeps in behind it and the others fade back — and hovering a row picks out its marker.
 */
export default function WorkshopKit({ kit }: { kit: Kit }) {
  const [active, setActive] = useState<number | null>(null);
  const fx = focus(kit.items.map((item) => item.x));
  const fy = focus(kit.items.map((item) => item.y));

  // Mouse: follow the pointer. Touch: a tap toggles, since there's no hover to leave
  const hover = (i: number) => ({
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setActive(i),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && setActive(null),
    onPointerDown: (e: React.PointerEvent) => e.pointerType !== "mouse" && setActive((a) => (a === i ? null : i)),
  });

  return (
    <section
      aria-labelledby="kit"
      className="container grid gap-stack py-section md:grid-cols-2 md:items-center md:gap-x-24 lg:items-stretch"
    >
      {/* A print on a cream mount, like a photo pinned to the studio wall */}
      <div data-fade className="flex flex-col bg-cream p-2.5 shadow-xl shadow-ink/10 md:p-4">
        <div
          style={{ "--ratio": `${kit.width} / ${kit.height}` } as React.CSSProperties}
          className="relative aspect-(--ratio) overflow-hidden lg:[container-type:size] lg:aspect-auto lg:flex-1"
        >
          <Image
            src={kit.image}
            alt={kit.alt}
            fill
            sizes="(min-width: 48rem) 45vw, 100vw"
            style={{ objectPosition: `${fx}% ${fy}%` }}
            className="object-cover"
          />
          <ol
            aria-hidden="true"
            style={{ "--iw": kit.width, "--ih": kit.height } as React.CSSProperties}
            className="absolute inset-0 [--s:max(100cqw/var(--iw),100cqh/var(--ih))]"
          >
            {kit.items.map((item, i) => (
              <li
                key={item.name}
                {...hover(i)}
                data-active={active === i || undefined}
                style={
                  {
                    "--x": `${item.x}%`,
                    "--y": `${item.y}%`,
                    "--cx": place("w", fx, item.x),
                    "--cy": place("h", fy, item.y),
                  } as React.CSSProperties
                }
                className="group/pin absolute top-(--y) left-(--x) size-7 -translate-1/2 cursor-pointer lg:top-(--cy) lg:left-(--cx)"
              >
                <span className="absolute inset-0 rounded-full bg-accent opacity-0 group-data-active/pin:animate-checkpoint" />
                <span className="relative center size-full rounded-full border border-ink/20 bg-cream text-small text-ink shadow-sm transition-[background-color,border-color,color,scale] duration-500 ease-out-expo group-data-active/pin:scale-125 group-data-active/pin:border-accent group-data-active/pin:bg-accent group-data-active/pin:text-cream">
                  {i + 1}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div>
        <h2 id="kit" data-heading-effect className="text-title-xl">
          In your <em className="text-flourish text-accent">kit</em>
        </h2>
        <p className="mt-4 max-w-sm text-lead text-flourish">
          Everything waits for you at your desk, and it all goes home with you.
        </p>
        <ol className="mt-stack border-t border-line">
          {kit.items.map((item, i) => (
            <li
              key={item.name}
              {...hover(i)}
              data-active={active === i || undefined}
              data-dim={(active !== null && active !== i) || undefined}
              className="group/row relative isolate grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-x-2 gap-y-1 border-b border-line px-4 py-5 transition-opacity duration-500 data-dim:opacity-40 sm:grid-cols-[2rem_minmax(0,1fr)_minmax(0,12rem)]"
            >
              {/* The wash that sweeps in from the left behind the picked row */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 origin-left scale-x-0 bg-surface transition-transform duration-700 ease-out-expo group-data-active/row:scale-x-100"
              />
              <span className="text-lead tabular-nums transition-[color,translate] duration-700 ease-out-expo group-data-active/row:translate-x-2 group-data-active/row:text-accent">
                {i + 1}
              </span>
              <span className="text-lead transition-[color,translate] delay-75 duration-700 ease-out-expo group-data-active/row:translate-x-2 group-data-active/row:text-accent">
                {item.name}
              </span>
              <span className="col-start-2 text-small text-muted transition-colors duration-500 group-data-active/row:text-ink sm:col-start-3">
                {item.note}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
