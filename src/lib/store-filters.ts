/*
 * Store filtering: the URL is the source of truth (/shop?category=…&minPrice=…&f=Colour:Ivory),
 * so filtered pages can be shared and the back button works. Pure functions only — the
 * filter drawer (client) and the catalogue service (server) both import this.
 */
import type { ProductSummary } from "@/types";
import { displayPrice, isSoldOut } from "@/utils/product";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export interface StoreFilters {
  /** category slug, "" for everything */
  category: string;
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
  onSale: boolean;
  /** option name → chosen values, e.g. { Colour: ["Ivory", "Sage"] } */
  attrs: Record<string, string[]>;
  sort: SortKey;
}

export const emptyFilters: StoreFilters = { category: "", inStock: false, onSale: false, attrs: {}, sort: "featured" };

type RawParams = Record<string, string | string[] | undefined>;

const list = (value?: string | string[]) => (Array.isArray(value) ? value : value ? [value] : []);

function amount(value?: string | string[]) {
  const raw = list(value)[0];
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function parseFilters(params: RawParams): StoreFilters {
  const attrs: Record<string, string[]> = {};
  for (const pair of list(params.f)) {
    const at = pair.indexOf(":");
    if (at < 1) continue;
    const key = pair.slice(0, at);
    const value = pair.slice(at + 1);
    if (value && !attrs[key]?.includes(value)) (attrs[key] ??= []).push(value);
  }
  let minPrice = amount(params.minPrice);
  let maxPrice = amount(params.maxPrice);
  if (minPrice != null && maxPrice != null && minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];
  const sort = SORT_OPTIONS.find((o) => o.value === list(params.sort)[0])?.value ?? "featured";
  return {
    category: list(params.category)[0] ?? "",
    minPrice,
    maxPrice,
    inStock: list(params.inStock)[0] === "1",
    onSale: list(params.onSale)[0] === "1",
    attrs,
    sort,
  };
}

/** How many refinements are on (price counts once). Category and sort aren't counted. */
export const activeFilterCount = (f: StoreFilters) =>
  (f.minPrice != null || f.maxPrice != null ? 1 : 0) +
  (f.inStock ? 1 : 0) +
  (f.onSale ? 1 : 0) +
  Object.values(f.attrs).reduce((n, values) => n + values.length, 0);

/** True when the listing can't use the API's plain, paged product query */
export const needsLocalFiltering = (f: StoreFilters) => activeFilterCount(f) > 0 || f.sort !== "featured";

/** Same category and sort, every refinement off */
export const withoutRefinements = (f: StoreFilters): StoreFilters => ({
  ...f,
  minPrice: undefined,
  maxPrice: undefined,
  inStock: false,
  onSale: false,
  attrs: {},
});

export function filtersToHref(f: StoreFilters) {
  const params = new URLSearchParams();
  if (f.category) params.set("category", f.category);
  if (f.minPrice != null) params.set("minPrice", String(f.minPrice));
  if (f.maxPrice != null) params.set("maxPrice", String(f.maxPrice));
  if (f.inStock) params.set("inStock", "1");
  if (f.onSale) params.set("onSale", "1");
  for (const [key, values] of Object.entries(f.attrs))
    for (const value of values) params.append("f", `${key}:${value}`);
  if (f.sort !== "featured") params.set("sort", f.sort);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export function filterProducts(products: ProductSummary[], f: StoreFilters): ProductSummary[] {
  const wanted = Object.values(f.attrs).filter((values) => values.length > 0);
  return products.filter((product) => {
    const { price, compareAt } = displayPrice(product);
    if (f.minPrice != null && price < f.minPrice) return false;
    if (f.maxPrice != null && price > f.maxPrice) return false;
    if (f.inStock && isSoldOut(product)) return false;
    if (f.onSale && compareAt == null) return false;
    // Listing variants only carry choice names, so an attribute matches on its values;
    // every attribute group must match (Colour AND Lettering style), any value within one
    return wanted.every((values) =>
      (product.variants ?? []).some((v) => values.some((value) => v.selectedOptions?.includes(value))),
    );
  });
}

export function sortProducts(products: ProductSummary[], sort: SortKey): ProductSummary[] {
  if (sort === "featured") return products;
  const price = (p: ProductSummary) => displayPrice(p).price;
  const sorted = [...products];
  if (sort === "price-asc") sorted.sort((a, b) => price(a) - price(b));
  else if (sort === "price-desc") sorted.sort((a, b) => price(b) - price(a));
  else sorted.sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
}
