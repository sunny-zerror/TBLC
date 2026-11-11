import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeCategories, HomeFeatured, HomeHero, HomeStory } from "@/components/sections/home";
import Skeleton, { HeadingSkeleton, ProductGridSkeleton } from "@/components/ui/Skeleton";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("/");

/** Placeholders shaped like the two catalogue sections, which stream in after the hero */
function CategoriesSkeleton() {
  return (
    <section className="section container" aria-busy="true" aria-label="Loading categories">
      <HeadingSkeleton className="mb-stack" />
      <div className="grid gap-grid md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="aspect-4/5 w-full" />
        ))}
      </div>
    </section>
  );
}

function FeaturedSkeleton() {
  return (
    <section className="section container" aria-busy="true" aria-label="Loading new arrivals">
      <div className="mb-stack flex items-end justify-between gap-6">
        <div>
          <Skeleton className="mb-3 h-3 w-16" />
          <HeadingSkeleton />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <ProductGridSkeleton count={3} />
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HomeHero />
      {/* Catalogue sections stream in, so the hero shows straight away while the API answers */}
      <Suspense fallback={<CategoriesSkeleton />}>
        <HomeCategories />
      </Suspense>
      <Suspense fallback={<FeaturedSkeleton />}>
        <HomeFeatured />
      </Suspense>
      <HomeStory />
    </>
  );
}
