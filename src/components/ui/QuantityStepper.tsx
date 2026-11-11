"use client";

import { RiAddLine, RiSubtractLine } from "@remixicon/react";
import { useState } from "react";
import { cn } from "@/utils/cn";

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  max?: number;
  /** sm: compact, for the cart drawer. lg: the bordered box on product and cart pages. */
  size?: "sm" | "lg";
  /** Disable the minus button at 1 instead of letting it remove the line */
  min?: number;
}

export default function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  disabled,
  max,
  min,
  size = "sm",
}: QuantityStepperProps) {
  const lg = size === "lg";

  // Which way the number rolls: up when it grows, down when it shrinks, still on first render
  const [last, setLast] = useState(value);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  if (value !== last) {
    setDirection(value > last ? "up" : "down");
    setLast(value);
  }

  const buttonClass = cn(
    "center transition-colors duration-300 enabled:hover:bg-ink enabled:hover:text-cream disabled:opacity-40",
    // Icon nudges up on hover and presses in on click
    "[&>svg]:transition-transform [&>svg]:duration-300 enabled:hover:[&>svg]:scale-125 enabled:active:[&>svg]:scale-90",
  );

  return (
    <div
      className={cn(
        // Three equal columns stretched to the border: hover fills sit flush and the number stays centred
        "inline-grid shrink-0 grid-cols-3 items-stretch",
        // lg matches the lg Button height so they line up side by side
        lg ? "h-13 w-32! border border-ink bg-cream" : "h-9 w-26! border border-line",
      )}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled || (min != null && value <= min)}
        aria-label="Decrease quantity"
        className={buttonClass}
      >
        <RiSubtractLine className="size-4" />
      </button>
      <span className={cn("center overflow-hidden tabular-nums", lg ? "text-body" : "text-caption")} aria-live="polite">
        {/* Keyed by value so each change replays the roll */}
        <span
          key={value}
          className={cn(
            "block",
            direction === "up" && "animate-count-up",
            direction === "down" && "animate-count-down",
          )}
        >
          {value}
        </span>
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled || (max != null && value >= max)}
        aria-label="Increase quantity"
        className={buttonClass}
      >
        <RiAddLine className="size-4" />
      </button>
    </div>
  );
}
