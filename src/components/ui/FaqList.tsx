"use client";

import { RiAddLine } from "@remixicon/react";
import { useId, useState } from "react";
import { cn } from "@/utils/cn";

/*
 * Numbered questions as soft cards: the open one lifts onto cream with a shadow and its + turns to ×.
 * One open at a time. Panels animate their height with grid-rows 0fr → 1fr; closed ones stay in the
 * HTML (indexable) but are `inert`, so their links can't be tabbed to.
 */
export default function FaqList({
  items,
  defaultOpen = 0,
}: {
  items: { question: string; answer: string }[];
  defaultOpen?: number;
}) {
  const id = useId();
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const expanded = open === i;
        const panelId = `${id}-panel-${i}`;
        const buttonId = `${id}-button-${i}`;
        const number = String(i + 1).padStart(2, "0");
        return (
          <div
            key={item.question}
            className={cn(
              "rounded-2xl border transition-[background-color,border-color,box-shadow] duration-500 ease-out-expo",
              expanded ? "border-transparent bg-cream shadow-xl shadow-accent/10" : "border-line hover:bg-cream/50",
            )}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : i)}
                className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 p-5 text-left md:px-8 md:py-6"
              >
                <span className="text-eyebrow text-accent tabular-nums">{number}</span>
                <span
                  className={cn("text-lead transition-colors duration-500", !expanded && "group-hover:text-accent")}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "center size-10 shrink-0 rounded-full border transition-colors duration-500",
                    expanded ? "border-accent bg-accent text-cream" : "border-line text-ink group-hover:border-accent",
                  )}
                >
                  <RiAddLine
                    className={cn("size-4 transition-transform duration-500 ease-out-expo", expanded && "rotate-45")}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!expanded}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo",
                expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                {/* An invisible number keeps the answer lined up under the question */}
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 px-5 pb-6 md:px-8 md:pb-8">
                  <span aria-hidden="true" className="invisible text-eyebrow tabular-nums">
                    {number}
                  </span>
                  <p className="max-w-xl text-body text-ink-soft">{item.answer}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
