"use client";

import { RiShoppingBag3Line } from "@remixicon/react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useCartStore } from "@/store/cart-store";
import type { ProductSummary } from "@/types";
import { primaryImage } from "@/utils/media";
import { displayPrice, isOutOfStock, toVariantDetail } from "@/utils/product";
import { productHref } from "@/utils/url";

// Inside a filled ProductGrid tile the icon stays cream (accent would vanish on the accent fill) and fades on hover instead
const iconClass =
  "relative z-10 -m-1 flex p-1 transition duration-500 ease-out hover:text-accent disabled:opacity-40 group-hover/tile:text-cream! group-hover/tile:hover:opacity-70";

/** The bag icon on a card: adds single-variant products, otherwise opens the product to choose options */
export default function QuickAddButton({ product }: { product: ProductSummary }) {
  const { addItem, busy } = useCart();
  const openCart = useCartStore((s) => s.open);
  const variants = product.variants ?? [];
  const only = variants.length === 1 ? variants[0] : undefined;

  if (!only) {
    return (
      <Link href={productHref(product.slug)} aria-label={`Choose options for ${product.name}`} className={iconClass}>
        <RiShoppingBag3Line className="size-4" />
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Add ${product.name} to your cart`}
      disabled={busy || isOutOfStock(only)}
      onClick={async () => {
        const added = await addItem({
          productId: product._id,
          categoryId: product.categoryIds?.[0],
          variant: toVariantDetail(only),
          product: {
            name: product.name,
            slug: product.slug,
            asset: primaryImage(product.assets),
            price: displayPrice(product).price,
          },
        });
        if (added) openCart();
      }}
      className={iconClass}
    >
      <RiShoppingBag3Line className="size-4" />
    </button>
  );
}
