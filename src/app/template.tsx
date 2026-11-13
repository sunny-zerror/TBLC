import PageTransition from "@/components/layout/PageTransition";

/** Wraps every page in the site-wide page transition (see PageTransition) */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
