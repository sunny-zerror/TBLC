"use client";

import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Skeleton from "@/components/ui/Skeleton";
import { useCart } from "@/hooks/useCart";
import type { CartLine } from "@/types";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/format";
import { mediaUrl } from "@/utils/media";
import { productHref } from "@/utils/url";

/** Product · price · quantity · total — four columns from md up, stacked on phones */
const columns = "md:grid md:grid-cols-[minmax(0,4.4fr)_minmax(0,1.2fr)_minmax(0,2.6fr)_minmax(0,1.2fr)] md:gap-4";

const lineKey = (line: CartLine) => `${line.productId}-${line.variantDetail?.variantDetailId ?? ""}`;

export default function CartView() {
  const { cart, lines, count, loading, busy, increment, decrement, removeItem } = useCart();
  const subtotal = cart?.discountedPrice || cart?.totalprice || 0;

  return (
    <div className="container pt-section pb-section">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="flex items-start gap-4 text-display md:gap-7">
          {/* Only the static words are split; the count beside them keeps updating normally */}
          <span data-heading-effect="words">Your cart</span>
          <span data-fade="in" data-delay="0.5" className="mt-[-0.05em] text-count text-accent-soft">
            ({loading ? "…" : count})
          </span>
        </h1>
        <p data-fade data-delay="0.3" className="mb-4 text-caption text-muted">
          Shipping and taxes are calculated at checkout.
        </p>
      </div>

      {loading ? (
        <div className="mt-section flex flex-col gap-8" aria-busy="true" aria-label="Loading your cart">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-8 border-b border-line pb-8">
              <Skeleton className="h-33 w-28" />
              <div className="flex flex-1 flex-col gap-3">
                <Skeleton className="h-7 w-2/3 max-w-80" />
                <Skeleton className="h-4 w-1/3 max-w-40" />
              </div>
            </div>
          ))}
        </div>
      ) : lines.length === 0 ? (
        <div data-fade className="mt-section flex flex-col items-start gap-8 border-t border-line pt-section">
          <p className="text-title">Nothing in your cart yet.</p>
          <ButtonLink href="/shop" variant="paper" size="lg" className="w-60">
            <em className="text-flourish">Back to</em> STORE
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="mt-section">
            <div aria-hidden="true" className={cn("hidden border-b border-line pb-5 text-eyebrow", columns)}>
              <span>Product</span>
              <span className="text-right">Price</span>
              <span className="pr-7 text-right">Quantity</span>
              <span className="text-right">Total</span>
            </div>

            <ul aria-label="Items in your cart" data-stagger>
              {lines.map((line) => {
                const href = line.product?.slug ? productHref(line.product.slug) : "/shop";
                const options = line.variantDetail?.selectedOptions ?? [];
                const max = line.variantDetail?.trackInventory
                  ? (line.variantDetail.stockQuantity ?? undefined)
                  : undefined;
                return (
                  <li key={lineKey(line)} className={cn("border-b border-line py-8 md:items-center", columns)}>
                    <div className="flex items-stretch gap-5 md:gap-8">
                      <Link href={href} className="relative aspect-5/6 w-24 shrink-0 bg-surface md:w-28">
                        <Image
                          src={mediaUrl(line.asset?.path)}
                          alt={line.asset?.altText || line.name}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </Link>
                      {/* Stretches to the image's height: details at the top, Remove pinned to the bottom */}
                      <div className="flex flex-col justify-between gap-5">
                        <div>
                          <h2 className="text-title-sm">
                            <Link href={href} className="hover:text-accent">
                              {line.name}
                            </Link>
                          </h2>
                          {options.length > 0 && (
                            <p className="mt-2.5 text-caption text-muted">{options.join("  ·  ")}</p>
                          )}
                          <p className="mt-2 text-caption text-muted md:hidden">{formatPrice(line.price)} each</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(line)}
                          disabled={busy}
                          className="self-start border-b border-line pb-0.5 text-small text-ink-soft hover:text-accent disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="hidden text-right md:block">{formatPrice(line.price)}</p>
                    <div className="mt-6 flex items-center justify-between md:mt-0 md:justify-end md:pr-6">
                      <QuantityStepper
                        size="lg"
                        value={line.qty}
                        min={1}
                        max={max}
                        disabled={busy}
                        onIncrement={() => increment(line)}
                        onDecrement={() => decrement(line)}
                      />
                      <p className="md:hidden">{formatPrice(line.finalPrice)}</p>
                    </div>
                    <p className="hidden text-right md:block">{formatPrice(line.finalPrice)}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div data-fade className="mt-16 flex flex-wrap items-center justify-between gap-8">
            <div className="flex flex-col gap-2">
              <p className="flex items-baseline gap-6 text-title md:gap-10">
                <span>Subtotal</span>
                <span className="text-accent">{formatPrice(subtotal)}</span>
              </p>
              {Boolean(cart?.totalDiscount) && (
                <p className="text-caption text-muted">Includes −{formatPrice(cart?.totalDiscount)} in savings</p>
              )}
            </div>
            <div className="flex w-full flex-wrap gap-4 sm:w-auto">
              <ButtonLink href="/shop" variant="paper" size="lg" className="flex-1 sm:w-60 sm:flex-none">
                <em className="text-flourish">Back to</em> STORE
              </ButtonLink>
              <ButtonLink href="/checkout" variant="accent" size="lg" className="flex-1 sm:w-60 sm:flex-none">
                <em className="text-flourish">Check</em> OUT
              </ButtonLink>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
