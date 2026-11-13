import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({ title: "Page not found", noIndex: true });

/*
 * Copperplate guide lines, in em from the baseline, measured against the display face's old-style
 * numerals: the 0 fills the x-height, the 4 drops to the descender.
 */
const guides = [
  { label: "Ascender", at: -0.75 },
  { label: "Waistline", at: -0.47 },
  { label: "Baseline", at: 0 },
  { label: "Descender", at: 0.27 },
];

const elsewhere = [
  { label: "Store", note: "Paper goods, writing tools and keepsakes", href: "/shop" },
  { label: "Classroom", note: "Workshops, private classes and the online course", href: "/classroom" },
  { label: "Blog", note: "Notes on lettering, tools and practice", href: "/blog" },
  { label: "Contact", note: "Tell us what you were looking for", href: "/contact" },
];

/** A practice sheet with "404" lettered across its guide lines — the last 4 tips off the baseline */
function PracticeSheet() {
  return (
    <div
      data-image-reveal
      className="-rotate-2 overflow-hidden bg-cream guide-sheet px-6 py-6 shadow-xl shadow-ink/10 md:px-10 md:py-8"
    >
      {/* Printed header, as on the studio's guide sheets */}
      <div className="flex items-baseline justify-between gap-6 border-b border-line pb-3">
        <p className="text-eyebrow text-accent">Practice sheet · No. 404</p>
        <p className="hidden items-baseline gap-2 text-eyebrow text-muted sm:flex">
          Name <span className="w-24 border-b border-line" />
        </p>
      </div>

      <p aria-hidden="true" className="relative py-14 pl-24 text-display text-flourish md:py-24 md:pl-28">
        {/* Zero-height inline block: its top sits on the baseline, so the guides can hang off it in em */}
        <span className="relative inline-block h-0 w-0 align-baseline">
          {guides.map((guide) => (
            <span key={guide.label} style={{ top: `${guide.at}em` }} className="absolute left-0 w-[50vw]">
              <span
                className={guide.at === 0 ? "absolute inset-x-0 h-px bg-accent" : "absolute inset-x-0 h-px bg-line"}
              />
              {/* Each label rides just above its line, out in the left margin */}
              <span className="absolute right-full bottom-0 mr-4 font-secondary text-eyebrow whitespace-nowrap text-accent-soft not-italic">
                {guide.label}
              </span>
            </span>
          ))}
        </span>
        40<span className="inline-block origin-bottom-left animate-slip text-accent">4</span>
      </p>

      <p className="border-t border-line pt-3 text-right text-flourish text-caption text-muted">
        The Bombay Lettering Company
      </p>
    </div>
  );
}

export default function NotFound() {
  return (
    <section className="section container grid min-h-[80svh] items-center gap-stack md:grid-cols-2 md:gap-x-24">
      <PracticeSheet />

      <div>
        <p className="text-eyebrow text-accent">Error 404</p>
        <h1 data-heading-effect className="mt-4 text-title-xl">
          This page slipped off the <em className="text-flourish text-accent">baseline.</em>
        </h1>
        <p className="mt-5 max-w-md text-body-lg text-muted">
          The link may be old, or the page may have moved. Let&apos;s get you back on the line.
        </p>
        <ButtonLink href="/" variant="accent" size="lg" data-fade data-delay="0.3" className="mt-8">
          <em className="text-flourish">Back</em> HOME
        </ButtonLink>

        <nav aria-label="Elsewhere on the site" className="mt-stack">
          <p className="text-eyebrow text-muted">Or pick up from</p>
          <ul className="mt-3 border-t border-line">
            {elsewhere.map((page) => (
              <li key={page.href} className="border-b border-line">
                <Link href={page.href} className="group flex items-baseline gap-x-6 py-4">
                  <span className="w-32 shrink-0 text-lead transition-colors group-hover:text-accent">
                    {page.label}
                  </span>
                  <span className="hidden flex-1 text-caption text-muted sm:block">{page.note}</span>
                  <span
                    aria-hidden="true"
                    className="ml-auto text-accent transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
