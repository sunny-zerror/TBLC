import Skeleton, { ProductGridSkeleton } from "@/components/ui/Skeleton";

/** Mirrors StoreHeader + ProductGrid: title and intro, category tabs with Filter, then the tiles */
export default function Loading() {
  return (
    <div className="container" aria-busy="true" aria-label="Loading the store">
      <div className="grid gap-8 pt-section md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <Skeleton className="h-20 w-64 md:h-28 md:w-md" />
        <div className="flex w-68 flex-col gap-2 xl:mr-36">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
      </div>

      <div className="mt-stack flex items-center justify-between gap-6 border-b border-line pb-6 md:pb-12">
        <div className="flex gap-8 xl:gap-14">
          {["w-16", "w-32", "w-28", "w-36", "w-24"].map((width, i) => (
            <Skeleton key={i} className={`h-5 ${i > 1 ? "hidden md:block" : ""} ${width}`} />
          ))}
        </div>
        <Skeleton className="h-5 w-16" />
      </div>

      <div className="pt-section">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
