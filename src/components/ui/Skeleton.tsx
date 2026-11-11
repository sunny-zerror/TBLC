import { cn } from "@/utils/cn";

/*
 * Loading placeholders, each shaped like the content it stands in for so nothing jumps when the
 * data arrives. The shimmer is the `skeleton` utility in globals.css.
 */
export default function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("skeleton block", className)} />;
}

/** One product tile: hairline frame, square image, name + bag icon, price (matches ProductCard) */
export function ProductTileSkeleton() {
  return (
    <div className="border border-line p-4 md:p-5 xl:p-6">
      <Skeleton className="aspect-square w-full" />
      <div className="mt-6 flex items-center justify-between gap-3">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="size-4" />
      </div>
      <Skeleton className="mt-2.5 h-4 w-1/4" />
    </div>
  );
}

/** The product grid (matches ProductGrid's columns and gaps) */
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-grid sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <ProductTileSkeleton key={i} />
      ))}
    </div>
  );
}

/** A row of product tiles, for carousels ("See also") — 1, 2 then 3 across like RelatedCarousel */
export function ProductRowSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8" aria-busy="true" aria-label="Loading">
      <ProductTileSkeleton />
      <div className="hidden sm:block">
        <ProductTileSkeleton />
      </div>
      <div className="hidden lg:block">
        <ProductTileSkeleton />
      </div>
    </div>
  );
}

/** A section heading line, sized for the title scale it stands in for */
export function HeadingSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-64 md:h-14 md:w-96", className)} />;
}
