import Link from "next/link";
import ActiveFilters from "@/components/store/ActiveFilters";
import StoreFilter from "@/components/store/StoreFilter";
import { filtersToHref, type StoreFilters } from "@/lib/store-filters";
import type { FilterOptions } from "@/services/catalog";
import type { Category } from "@/types";
import { cn } from "@/utils/cn";

interface StoreHeaderProps {
  title: string;
  count: number;
  intro: string;
  categories: Category[];
  filters: StoreFilters;
  options: FilterOptions;
}

/** "Store (24)", the intro line, the category tabs, the Filter button and the active filter chips */
export default function StoreHeader({ title, count, intro, categories, filters, options }: StoreHeaderProps) {
  const tabs = [{ slug: "", name: "Shop all" }, ...categories];

  return (
    <header>
      {/* Two columns from md up, so a long category name wraps beside the intro instead of pushing it below */}
      <div className="grid gap-8 pt-section md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <h1 className={cn("flex items-start gap-4 text-display-sm text-balance break-words md:gap-6")}>
          {/* Keyed by text: switching category swaps only the query string, so the page isn't
              remounted; a new key replaces the split heading instead of editing its text */}
          <span key={title} data-heading-effect="words" className="min-w-0">
            {title}
          </span>
          <span className="mt-[-0.1em] shrink-0 text-count text-accent-soft">({count})</span>
        </h1>
        <p
          key={intro}

          className="max-w-68 font-primary text-body-lg text-muted xl:mr-36"
        >
          {intro}
        </p>
      </div>

      <div className="mt-stack flex items-start justify-between gap-6 border-b border-line pb-6 md:pb-12">
        {categories.length > 0 ? (
          <nav aria-label="Categories" className="no-scrollbar min-w-0 overflow-x-auto">
            <ul className="flex gap-x-8 font-primary text-body xl:gap-x-14">
              {tabs.map((c) => {
                const current = filters.category === c.slug;
                return (
                  <li key={c.slug || "all"}>
                    {/* Switching category keeps the other filters on */}
                    <Link
                      href={filtersToHref({ ...filters, category: c.slug })}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "block border-b py-1 whitespace-nowrap transition-colors",
                        current ? "border-accent text-accent" : "border-transparent hover:text-accent",
                      )}
                    >
                      {c.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : (
          <span />
        )}
        <StoreFilter filters={filters} categories={categories} options={options} />
      </div>

      <ActiveFilters filters={filters} />
    </header>
  );
}
