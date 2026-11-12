import { RiSearchLine } from "@remixicon/react";
import Link from "next/link";
import { blogCategories, blogListingHref } from "@/data/blog";
import { cn } from "@/utils/cn";

interface BlogHeaderProps {
  count: number;
  category?: string;
  q?: string;
}

/** "The Blog (38)", a search box and the category chips — plain links and a GET form, so it all works without JS */
export default function BlogHeader({ count, category, q }: BlogHeaderProps) {
  return (
    <header className="container pt-section pb-stack">
      <p className="text-eyebrow text-muted">Browse the blog</p>
      <h1 className="mt-4 flex items-start gap-4 text-display md:gap-6">
        <span data-heading-effect="words" data-delay="0.1">
          The Blog
        </span>
        {/* Keyed so the figure fades in again when a filter changes it */}
        <span key={count} className="mt-[-0.1em] text-count text-accent-soft">
          ({count})
        </span>
      </h1>

      <div className="mt-10 flex flex-col gap-5">
        <form action="/blog" role="search" className="relative w-full max-w-sm">
          {category && <input type="hidden" name="category" value={category} />}
          <RiSearchLine
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search the blog"
            aria-label="Search the blog"
            className="h-11 w-full rounded-full border border-ink bg-transparent pr-4 pl-11 text-caption transition-colors outline-none focus:border-accent"
          />
        </form>

        <nav aria-label="Blog categories">
          <ul className="flex flex-wrap gap-2">
            {blogCategories.map((c) => {
              const current = c.slug === category;
              return (
                <li key={c.slug}>
                  {/* Choosing the current category again clears it */}
                  <Link
                    href={blogListingHref({ category: current ? undefined : c.slug, q })}
                    aria-current={current ? "page" : undefined}
                    scroll={false}
                    className={cn(
                      "block rounded-full border border-ink px-4 py-2 text-eyebrow transition-colors duration-300",
                      current ? "bg-ink text-cream" : "hover:bg-surface",
                    )}
                  >
                    {c.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
