import Link from "next/link";
import { RiCloseLine } from "@remixicon/react";
import { filtersToHref, type StoreFilters, withoutRefinements } from "@/lib/store-filters";
import { formatPrice } from "@/utils/format";

/** One removable chip per refinement, so shoppers can see and undo what is narrowing the grid */
export default function ActiveFilters({ filters }: { filters: StoreFilters }) {
  const chips: { label: string; next: StoreFilters }[] = [];

  if (filters.minPrice != null || filters.maxPrice != null) {
    const label =
      filters.minPrice != null && filters.maxPrice != null
        ? `${formatPrice(filters.minPrice)} – ${formatPrice(filters.maxPrice)}`
        : filters.minPrice != null
          ? `From ${formatPrice(filters.minPrice)}`
          : `Up to ${formatPrice(filters.maxPrice)}`;
    chips.push({ label, next: { ...filters, minPrice: undefined, maxPrice: undefined } });
  }
  if (filters.inStock) chips.push({ label: "In stock", next: { ...filters, inStock: false } });
  if (filters.onSale) chips.push({ label: "On sale", next: { ...filters, onSale: false } });
  for (const [key, values] of Object.entries(filters.attrs)) {
    for (const value of values) {
      chips.push({
        label: `${key}: ${value}`,
        next: { ...filters, attrs: { ...filters.attrs, [key]: values.filter((v) => v !== value) } },
      });
    }
  }
  if (chips.length === 0) return null;

  return (
    <ul aria-label="Active filters" className="mt-6 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <li key={chip.label}>
          <Link
            href={filtersToHref(chip.next)}
            aria-label={`Remove filter ${chip.label}`}
            className="flex items-center gap-1.5 border border-line bg-cream px-3 py-1 text-caption transition-colors hover:border-ink"
          >
            {chip.label}
            <RiCloseLine className="size-3.5" aria-hidden="true" />
          </Link>
        </li>
      ))}
      <li>
        <Link
          href={filtersToHref(withoutRefinements(filters))}
          className="ml-2 border-b border-ink pb-0.5 text-caption hover:text-accent"
        >
          Clear all
        </Link>
      </li>
    </ul>
  );
}
