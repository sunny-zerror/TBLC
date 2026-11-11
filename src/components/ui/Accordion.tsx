"use client";

import { useId, useState } from "react";
import { cn } from "@/utils/cn";

interface AccordionProps {
  items: { title: string; content: React.ReactNode }[];
  /** sm: uppercase UI rows. lg: serif questions, for FAQs. */
  size?: "sm" | "lg";
  /** Index of the item that starts open */
  defaultOpen?: number;
}

/**
 * One-open-at-a-time accordion. Panels animate their height with a grid-rows 0fr → 1fr
 * transition; closed panels stay in the HTML (indexable) but are `inert`, so their links
 * can't be tabbed to.
 */
export default function Accordion({ items, size = "sm", defaultOpen }: AccordionProps) {
  const id = useId();
  const [open, setOpen] = useState<number | null>(defaultOpen ?? null);
  const lg = size === "lg";

  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const expanded = open === i;
        const panelId = `${id}-panel-${i}`;
        const buttonId = `${id}-button-${i}`;
        return (
          <div key={item.title} className="border-b border-line">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : i)}
                className={cn(
                  "flex w-full items-center justify-between gap-6 text-left transition-colors hover:text-accent",
                  // Inside an <h3>, so the sans size sets its font back from the heading serif
                  lg ? "py-6 text-lead" : "py-4 font-secondary text-cta",
                )}
              >
                {item.title}
                {/* + that folds into − : the vertical bar rotates flat onto the horizontal one */}
                <span aria-hidden="true" className="relative size-3.5 shrink-0 text-muted">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                  <span
                    className={cn(
                      "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-out-expo",
                      expanded && "rotate-90",
                    )}
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
                <div className={cn("text-muted", lg ? "-mt-2 max-w-2xl pb-6 text-caption" : "pb-5 text-body")}>
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
