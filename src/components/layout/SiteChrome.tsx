"use client";

import { usePathname } from "next/navigation";

/** Paths that draw their own minimal chrome instead of the site header and footer */
const STANDALONE = ["/checkout"];

/** Renders the header or footer everywhere except the standalone pages */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return STANDALONE.includes(pathname) ? null : children;
}
