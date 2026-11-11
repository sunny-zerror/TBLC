import Image from "next/image";
import Link from "next/link";
import QuickAddButton from "@/components/product/QuickAddButton";
import Price from "@/components/ui/Price";
import type { ProductSummary } from "@/types";
import { hoverImage, mediaUrl, primaryImage } from "@/utils/media";
import { displayPrice, isSoldOut } from "@/utils/product";
import { productHref } from "@/utils/url";

/**
 * The hairline frame a card sits in on the shop grid and in carousels. It fills with
 * accent on hover; group/tile lets the card turn its text and icon cream to match.
 */
export const productTileClass =
  "group/tile border border-line p-4 transition-colors duration-500 ease-out hover:bg-accent md:p-5 xl:p-6";

interface ProductCardProps {
  product: ProductSummary;
  /** true for the first row on a page — loads the image eagerly for LCP */
  priority?: boolean;
  /** h2 on the store listing (straight under the page h1), h3 inside a titled section */
  headingLevel?: "h2" | "h3";
  sizes?: string;
}

export default function ProductCard({
  product,
  priority,
  headingLevel: Heading = "h3",
  sizes = "(min-width: 64rem) 30vw, (min-width: 40rem) 50vw, 100vw",
}: ProductCardProps) {
  const main = primaryImage(product.assets);
  const hover = hoverImage(product.assets);
  const { price, compareAt } = displayPrice(product);
  const soldOut = isSoldOut(product);
  const badge = soldOut ? "Sold out" : product.ribbon?.name;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-surface">
        <Image
          src={mediaUrl(main?.path)}
          alt={main?.altText || product.name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
        />
        {hover && hover.path !== main?.path && (
          <Image
            src={mediaUrl(hover.path)}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {badge && (
          <span className="absolute top-3 left-3 bg-cream px-2 py-0.5 text-flourish text-caption">{badge}</span>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between gap-3">
        {/* Accent on hover; cream instead inside a ProductGrid tile, which fills with accent */}
        <Heading className="font-secondary text-body-lg transition-colors duration-500 ease-out group-hover:text-accent group-hover/tile:text-cream!">
          {/* Stretched link: the whole card is clickable, one link for screen readers */}
          <Link href={productHref(product.slug)} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </Heading>
        {!soldOut && <QuickAddButton product={product} />}
      </div>
      <Price
        price={price}
        compareAt={compareAt}
        className="mt-1.5 font-primary text-body text-muted transition-colors duration-500 ease-out group-hover/tile:text-cream"
      />
    </article>
  );
}
