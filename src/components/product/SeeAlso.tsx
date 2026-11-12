import Link from "next/link";
import RelatedCarousel from "@/components/product/RelatedCarousel";
import Skeleton, { HeadingSkeleton, ProductRowSkeleton } from "@/components/ui/Skeleton";
import { getRelatedProducts } from "@/services/catalog";
import type { Product } from "@/types";

/**
 * "See also" — related products under the product page. Async so the page can stream it behind
 * <SeeAlsoSkeleton /> instead of waiting for the related-products request before showing anything.
 */
export default async function SeeAlso({ product }: { product: Product }) {
  const related = await getRelatedProducts(product, 8);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="see-also" className="container pt-section pb-section">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="see-also" data-heading-effect className="text-title-lg">
          See also
        </h2>
        <Link
          href="/shop"

          className="link-line text-cta whitespace-nowrap hover:text-accent"
        >
          Visit the STORE &nbsp;→
        </Link>
      </div>
      <div data-fade data-delay="0.2" className="mt-14">
        <RelatedCarousel products={related} label={`More like ${product.name}`} />
      </div>
    </section>
  );
}

export function SeeAlsoSkeleton() {
  return (
    <section className="container pt-section pb-section" aria-busy="true" aria-label="Loading related products">
      <div className="flex items-baseline justify-between gap-4">
        <HeadingSkeleton />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="mt-14">
        <ProductRowSkeleton />
      </div>
    </section>
  );
}
