/*
 * Catalogue reads for Server Components. Pages call these, never Apollo directly,
 * so the data source (z-commerce or the demo catalogue) is decided in one place.
 * React's cache() dedupes calls made by generateMetadata and the page in one request.
 */
import { cache } from "react";
import { mockCategories, mockProducts } from "@/data/mock-products";
import { GET_CATEGORIES, GET_CATEGORY, GET_FILTER_OPTIONS, GET_PRODUCT, GET_PRODUCTS } from "@/graphql";
import { query } from "@/lib/apollo/server";
import { isApiConfigured } from "@/lib/env";
import { filterProducts, sortProducts, type StoreFilters } from "@/lib/store-filters";
import type { Category, Product, ProductSummary } from "@/types";

export const PAGE_SIZE = 12;

export interface ProductPage {
  products: ProductSummary[];
  totalCount: number;
}

const empty: ProductPage = { products: [], totalCount: 0 };

function logError(scope: string, error: unknown) {
  console.error(`[catalog] ${scope} failed:`, error instanceof Error ? error.message : error);
}

export const getProducts = cache(
  async ({ page = 1, limit = PAGE_SIZE }: { page?: number; limit?: number } = {}): Promise<ProductPage> => {
    const offset = (page - 1) * limit;
    if (!isApiConfigured) {
      return { products: mockProducts.slice(offset, offset + limit), totalCount: mockProducts.length };
    }
    try {
      const { data } = await query({ query: GET_PRODUCTS, variables: { limit, offset } });
      return data?.getClientSideProducts ?? empty;
    } catch (error) {
      logError("getProducts", error);
      return empty;
    }
  },
);

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  if (!isApiConfigured) return mockProducts.find((p) => p.slug === slug) ?? null;
  try {
    const { data } = await query({ query: GET_PRODUCT, variables: { slug } });
    return data?.getClientSideProductById ?? null;
  } catch (error) {
    logError(`getProduct(${slug})`, error);
    return null;
  }
});

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!isApiConfigured) return mockCategories;
  try {
    const { data } = await query({ query: GET_CATEGORIES, variables: { limit: 50 } });
    return data?.getClientSideCategories.categories ?? [];
  } catch (error) {
    logError("getCategories", error);
    return [];
  }
});

export const getCategoryProducts = cache(
  async (slug: string, page = 1, limit = PAGE_SIZE): Promise<(ProductPage & { category: Category }) | null> => {
    const offset = (page - 1) * limit;
    if (!isApiConfigured) {
      const category = mockCategories.find((c) => c.slug === slug);
      if (!category) return null;
      const all = mockProducts.filter((p) => p.categoryIds?.includes(category._id));
      return { category, products: all.slice(offset, offset + limit), totalCount: all.length };
    }
    try {
      const { data } = await query({ query: GET_CATEGORY, variables: { slug, limit, offset } });
      const result = data?.getClientSideCategory;
      if (!result) return null;
      const { products, productsCount, ...category } = result;
      return { category, products, totalCount: productsCount };
    } catch (error) {
      logError(`getCategoryProducts(${slug})`, error);
      return null;
    }
  },
);

/** Products sharing the first category, for "You may also like" — topped up from the catalogue when the category is small */
export const getRelatedProducts = cache(async (product: Product, limit = 4): Promise<ProductSummary[]> => {
  const slug = product.categories?.[0]?.slug;
  const sameCategory = slug ? ((await getCategoryProducts(slug))?.products ?? []) : [];
  const pool = sameCategory.length > limit ? sameCategory : [...sameCategory, ...(await getProducts()).products];
  const seen = new Set([product._id]);
  return pool.filter((p) => !seen.has(p._id) && seen.add(p._id)).slice(0, limit);
});

/** Everything the filter drawer offers: the price range and attribute choices (Colour, Lettering style…) */
export interface FilterOptions {
  minPrice: number;
  maxPrice: number;
  attributes: { key: string; values: string[] }[];
}

export const getFilterOptions = cache(async (categoryId?: string): Promise<FilterOptions> => {
  const fallback: FilterOptions = { minPrice: 0, maxPrice: 0, attributes: [] };
  if (!isApiConfigured) {
    const pool = categoryId ? mockProducts.filter((p) => p.categoryIds?.includes(categoryId)) : mockProducts;
    const prices = pool.map((p) => p.price ?? 0);
    const attributes = new Map<string, Set<string>>();
    for (const product of pool) {
      for (const option of product.productOptions ?? []) {
        const values = attributes.get(option.optionName) ?? new Set<string>();
        option.choices.forEach((c) => values.add(c.name));
        attributes.set(option.optionName, values);
      }
    }
    return {
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
      attributes: [...attributes].map(([key, values]) => ({ key, values: [...values] })),
    };
  }
  try {
    const { data } = await query({
      query: GET_FILTER_OPTIONS,
      variables: { categoryIds: categoryId ? [categoryId] : undefined },
    });
    const options = data?.getFilterOptions;
    // Drop empty groups so the drawer never shows a heading with nothing under it
    return options ? { ...options, attributes: options.attributes.filter((a) => a.values.length > 0) } : fallback;
  } catch (error) {
    logError("getFilterOptions", error);
    return fallback;
  }
});

/** More than a shop will realistically list: filtering and sorting run over all of it */
const ALL_PRODUCTS = 500;

export interface StoreListing extends ProductPage {
  category: Category | null;
}

/**
 * The /shop listing: the full set is fetched once (cached), then filtered and sorted here.
 */
export async function getStoreListing(filters: StoreFilters): Promise<StoreListing | null> {
  let all: ProductPage;
  let category: Category | null = null;
  if (filters.category) {
    const result = await getCategoryProducts(filters.category, 1, ALL_PRODUCTS);
    if (!result) return null;
    all = result;
    category = result.category;
  } else {
    all = await getProducts({ limit: ALL_PRODUCTS });
  }

  const matches = sortProducts(filterProducts(all.products, filters), filters.sort);
  return { products: matches, totalCount: matches.length, category };
}
