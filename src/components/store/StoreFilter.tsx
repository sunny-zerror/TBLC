"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Drawer from "@/components/ui/Drawer";
import { Checkbox } from "@/components/ui/form";
import {
  activeFilterCount,
  filtersToHref,
  SORT_OPTIONS,
  type SortKey,
  type StoreFilters,
  withoutRefinements,
} from "@/lib/store-filters";
import type { FilterOptions } from "@/services/catalog";
import type { Category } from "@/types";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/format";

interface StoreFilterProps {
  filters: StoreFilters;
  categories: Category[];
  options: FilterOptions;
}

const groupTitle = "text-eyebrow text-ink";
const pill = "h-9 min-w-12 border border-ink px-4 text-eyebrow transition-colors";

/** The "Filter" button from the store design, and the drawer it opens */
export default function StoreFilter({ filters, categories, options }: StoreFilterProps) {
  const [open, setOpen] = useState(false);
  const count = activeFilterCount(filters);
  // Re-key on the applied filters so the drawer's draft state resets after every navigation
  const applied = filtersToHref(filters);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="flex items-center gap-2 py-1 font-primary text-body transition-colors hover:text-accent"
      >
        Filter
        {count > 0 && <span className="text-accent">({count})</span>}
        <svg
          width="16"
          height="14"
          viewBox="0 0 16 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M1 3.5h7M12 3.5h3M1 10.5h3M8 10.5h7" />
          <circle cx="10" cy="3.5" r="2" />
          <circle cx="6" cy="10.5" r="2" />
        </svg>
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Filter & sort">
        <FilterForm
          key={applied}
          filters={filters}
          categories={categories}
          options={options}
          onDone={() => setOpen(false)}
        />
      </Drawer>
    </>
  );
}

function FilterForm({ filters, categories, options, onDone }: StoreFilterProps & { onDone: () => void }) {
  const router = useRouter();
  const [draft, setDraft] = useState<StoreFilters>(filters);
  const [min, setMin] = useState(filters.minPrice != null ? String(filters.minPrice) : "");
  const [max, setMax] = useState(filters.maxPrice != null ? String(filters.maxPrice) : "");

  const toggleAttr = (key: string, value: string) =>
    setDraft((d) => {
      const current = d.attrs[key] ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...d, attrs: { ...d.attrs, [key]: next } };
    });

  const toNumber = (value: string) => (value.trim() !== "" && Number(value) >= 0 ? Number(value) : undefined);

  function apply(e: React.FormEvent) {
    e.preventDefault();
    let minPrice = toNumber(min);
    let maxPrice = toNumber(max);
    if (minPrice != null && maxPrice != null && minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];
    const attrs = Object.fromEntries(Object.entries(draft.attrs).filter(([, values]) => values.length > 0));
    router.push(filtersToHref({ ...draft, minPrice, maxPrice, attrs }));
    onDone();
  }

  function clear() {
    // Keep the category and sort: "clear" removes refinements, not where you are
    router.push(filtersToHref(withoutRefinements(draft)));
    onDone();
  }

  return (
    <form onSubmit={apply} className="flex min-h-full flex-col">
      <div className="flex flex-1 flex-col gap-9 p-6">
        <fieldset>
          <legend className={groupTitle}>Sort by</legend>
          <div className="mt-3 flex flex-col gap-2.5">
            {SORT_OPTIONS.map((o) => (
              <label key={o.value} className="flex cursor-pointer items-center gap-3 text-caption">
                <input
                  type="radio"
                  name="sort"
                  value={o.value}
                  checked={draft.sort === o.value}
                  onChange={() => setDraft((d) => ({ ...d, sort: o.value as SortKey }))}
                  className="size-4 shrink-0 accent-accent"
                />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>

        {categories.length > 0 && (
          <fieldset>
            <legend className={groupTitle}>Category</legend>
            <div className="mt-3 flex flex-col gap-2.5">
              {[{ slug: "", name: "All" }, ...categories].map((c) => (
                <label key={c.slug || "all"} className="flex cursor-pointer items-center gap-3 text-caption">
                  <input
                    type="radio"
                    name="category"
                    value={c.slug}
                    checked={draft.category === c.slug}
                    onChange={() => setDraft((d) => ({ ...d, category: c.slug }))}
                    className="size-4 shrink-0 accent-accent"
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {options.maxPrice > 0 && (
          <fieldset>
            <legend className={groupTitle}>Price</legend>
            <p className="mt-1 text-caption text-muted">
              {formatPrice(options.minPrice)} – {formatPrice(options.maxPrice)}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-6">
              {[
                { label: "From (₹)", value: min, set: setMin, placeholder: String(Math.floor(options.minPrice)) },
                { label: "To (₹)", value: max, set: setMax, placeholder: String(Math.ceil(options.maxPrice)) },
              ].map((field) => (
                <label key={field.label} className="flex flex-col gap-1 text-caption text-muted">
                  {field.label}
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={field.value}
                    placeholder={field.placeholder}
                    onChange={(e) => field.set(e.target.value)}
                    className="h-11 w-full border-0 border-b border-ink bg-transparent text-body text-ink outline-none focus:border-accent"
                  />
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {options.attributes.map((attribute) => (
          <fieldset key={attribute.key}>
            <legend className={groupTitle}>{attribute.key}</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {attribute.values.map((value) => {
                const on = draft.attrs[attribute.key]?.includes(value) ?? false;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleAttr(attribute.key, value)}
                    className={cn(pill, on ? "bg-ink text-cream" : "hover:bg-ink/5")}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        <fieldset>
          <legend className={groupTitle}>Availability</legend>
          <div className="mt-3 flex flex-col gap-3">
            <Checkbox
              checked={draft.inStock}
              onChange={(e) => setDraft((d) => ({ ...d, inStock: e.target.checked }))}
              label="In stock only"
            />
            <Checkbox
              checked={draft.onSale}
              onChange={(e) => setDraft((d) => ({ ...d, onSale: e.target.checked }))}
              label="On sale"
            />
          </div>
        </fieldset>
      </div>

      <div className="sticky bottom-0 flex items-center gap-4 border-t border-line bg-paper p-6">
        <button type="button" onClick={clear} className="border-b border-ink pb-0.5 text-caption hover:text-accent">
          Clear all
        </button>
        <Button type="submit" variant="accent" size="lg" className="flex-1">
          Apply
        </Button>
      </div>
    </form>
  );
}
