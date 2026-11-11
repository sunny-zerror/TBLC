"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { startMotion } from "@/lib/motion";

/**
 * Runs the data-attribute animations in src/lib/motion.ts for the whole app — mounted once in
 * AppProviders. Only for visitors who haven't asked for reduced motion; if that preference
 * changes, everything reverts to its plain, visible state.
 */
export default function Motion() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Normally already set by the inline script in layout.tsx, before first paint
      document.documentElement.dataset.motion = "on";
      const stop = startMotion();
      return () => {
        stop();
        delete document.documentElement.dataset.motion;
      };
    });
    return () => mm.revert();
  }, []);

  return null;
}
