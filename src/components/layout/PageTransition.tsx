"use client";

import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

/**
 * React's <ViewTransition> around the page: the old page fades out, then the new one fades in
 * ("page" in globals.css). Keyed by the pathname so every page change animates — the root
 * template alone only re-mounts when the top-level segment changes, which left /shop → a product,
 * /blog → a post or /classroom → a workshop without a transition. Query-string changes (shop
 * filters, account tabs) keep the same pathname, so they don't animate.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
