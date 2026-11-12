import ProductCard, { productTileClass } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/types";

/* Each card sits in its own hairline frame with padding inside; cards fade up row by row */
export default function ProductGrid({
  products,
  priorityCount = 3,
  headingLevel,
}: {
  products: ProductSummary[];
  priorityCount?: number;
  headingLevel?: "h2" | "h3";
}) {
  if (products.length === 0) {
    return <p className="py-section text-center text-lead text-muted">No pieces here yet.</p>;
  }
  return (
    <ul data-stagger className="grid gap-grid sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, i) => (
        <li key={product._id} className={productTileClass}>
          <ProductCard product={product} priority={i < priorityCount} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
