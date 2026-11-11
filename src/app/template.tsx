import { ViewTransition } from "react";

/**
 * Re-mounts on every navigation, so React's <ViewTransition> sees the old page exit and the new
 * one enter: the old page fades out, then the new one fades in ("page" in globals.css). Only
 * navigations animate — query-string changes (e.g. shop filters) keep the same template.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
