import type { Metadata } from "next";
import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import JsonLd from "@/components/seo/JsonLd";
import StoreHeader from "@/components/store/StoreHeader";
import StorePersonalise from "@/components/store/StorePersonalise";
import { siteRoutes } from "@/config/site";
import { breadcrumbSchema, productListSchema } from "@/lib/schema";
import { createMetadata, createPageMetadata } from "@/lib/seo";
import {
  activeFilterCount,
  filtersToHref,
  needsLocalFiltering,
  parseFilters,
  withoutRefinements,
} from "@/lib/store-filters";
import { getCategories, getCategoryProducts, getFilterOptions, getStoreListing } from "@/services/catalog";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const storeIntro = siteRoutes.find((r) => r.path === "/shop")?.description ?? "";

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams;
  const filters = parseFilters(params);
  const { category } = filters;

  let metadata: Metadata = createPageMetadata("/shop");
  if (category) {
    const result = await getCategoryProducts(category);
    if (result) {
      const meta = result.category.meta;
      metadata = createMetadata({
        title: meta?.title || result.category.name,
        description: meta?.description || result.category.description || undefined,
        path: `/shop?category=${category}`,
      });
    }
  }
  // Filtered and sorted views are near-duplicates of the plain listing: keep them out of the index
  return needsLocalFiltering(filters) ? { ...metadata, robots: { index: false, follow: true } } : metadata;
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters = parseFilters(params);

  const categories = await getCategories();
  const selected = categories.find((c) => c.slug === filters.category);
  const [listing, options] = await Promise.all([getStoreListing(filters), getFilterOptions(selected?._id)]);

  const products = listing?.products ?? [];
  const totalCount = listing?.totalCount ?? 0;
  const activeCategory = listing?.category ?? null;
  const title = activeCategory?.name ?? "Store";
  const refined = activeFilterCount(filters) > 0;

  return (
    <div className="container overflow-x-clip">
      <JsonLd
        data={[
          productListSchema(products, title, filtersToHref(filters)),
          breadcrumbSchema(
            activeCategory
              ? [
                  { name: "Store", path: "/shop" },
                  {
                    name: activeCategory.name,
                    path: filtersToHref({ ...withoutRefinements(filters), sort: "featured" }),
                  },
                ]
              : [{ name: "Store", path: "/shop" }],
          ),
        ]}
      />
      <StoreHeader
        title={title}
        count={totalCount}
        intro={activeCategory?.description || storeIntro}
        categories={categories}
        filters={filters}
        options={options}
      />

      <div className="pt-section">
        {products.length === 0 && refined ? (
          <div className="flex flex-col items-center gap-6 py-section text-center">
            <p className="text-title-sm">No pieces match those filters.</p>
            <Link
              href={filtersToHref(withoutRefinements(filters))}
              className="border-b border-ink pb-0.5 text-caption hover:text-accent"
            >
              Clear all filters
            </Link>
          </div>
        ) : (
          // Keyed by the filters so a new selection re-mounts the grid and its cards stagger in again
          <ProductGrid key={filtersToHref(filters)} products={products} headingLevel="h2" />
        )}
      </div>

      <StorePersonalise />
    </div>
  );
}
