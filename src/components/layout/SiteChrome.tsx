"use client";

import { usePathname } from "next/navigation";

/** Paths that draw their own minimal chrome instead of the site header and footer: checkout, workshop booking */
const STANDALONE = [/^\/checkout$/, /^\/classroom\/[^/]+\/book$/];

/** Renders the header or footer everywhere except the standalone pages */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return STANDALONE.some((pattern) => pattern.test(pathname)) ? null : children;
}
