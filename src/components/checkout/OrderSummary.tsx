"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { CartLine } from "@/types";
import { formatPrice } from "@/utils/format";
import { mediaUrl } from "@/utils/media";

interface OrderSummaryProps {
  lines: CartLine[];
  subtotal: number;
  discount?: number | null;
  shipping?: number | null;
  tax?: number | null;
  total: number;
  /** checkout only — shows the promo code field */
  coupon?: {
    code?: string | null;
    onApply: (code: string) => Promise<boolean>;
    onRemove: () => void;
  };
  /** checkout only — shows a Remove link on each line */
  onRemoveLine?: (line: CartLine) => void;
  /** disables the Remove links while the cart is updating */
  busy?: boolean;
  title?: string;
}

/**
 * Line items + totals. Sits on the checkout's blush panel and on the order
 * confirmation page; the parent supplies the background.
 */
export default function OrderSummary({
  lines,
  subtotal,
  discount,
  shipping,
  tax,
  total,
  coupon,
  onRemoveLine,
  busy,
  title = "Order summary",
}: OrderSummaryProps) {
  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);
  const items = lines.reduce((n, line) => n + line.qty, 0);

  async function apply() {
    if (!coupon || !code) return;
    setApplying(true);
    if (await coupon.onApply(code)) setCode("");
    setApplying(false);
  }

  return (
    <section aria-labelledby="order-summary" className="flex flex-col">
      <h2 id="order-summary" className="flex flex-wrap items-baseline gap-x-7">
        <span data-heading-effect="words">{title}</span>
        <span data-fade="in" data-delay="0.4" className="text-lead text-accent">
          ({items} {items === 1 ? "item" : "items"})
        </span>
      </h2>

      <ul data-stagger data-delay="0.2" className="mt-9 flex flex-col gap-7 border-b border-line pb-7">
        {lines.map((line) => (
          <li key={`${line.productId}-${line.variantDetail?.variantDetailId ?? ""}`} className="flex gap-6">
            <div className="relative aspect-5/6 w-21 shrink-0 bg-blush">
              <Image
                src={mediaUrl(line.asset?.path)}
                alt={line.asset?.altText || line.name}
                fill
                sizes="84px"
                className="object-cover"
              />
              <span className="absolute -top-2 -right-3 center size-6 rounded-full bg-accent text-small text-cream">
                {line.qty}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="">
                <div className="flex justify-between gap-3">
                  <p className="text-lead">{line.name}</p>
                  <p className="text-caption whitespace-nowrap">{formatPrice(line.finalPrice)}</p>
                </div>
                {Boolean(line.variantDetail?.selectedOptions?.length) && (
                  <p className="text-caption text-ink-soft">{line.variantDetail?.selectedOptions.join("  ·  ")}</p>
                )}
              </div>
              {onRemoveLine && (
                <button
                  type="button"
                  onClick={() => onRemoveLine(line)}
                  disabled={busy}
                  aria-label={`Remove ${line.name}`}
                  className="mt-3 w-fit border-b border-line pb-0.5 text-small text-ink-soft transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {coupon && (
        <div data-fade data-delay="0.3" className="mt-8">
          {coupon.code ? (
            <div className="flex items-center justify-between text-caption">
              <span>
                Promo code <strong className="font-medium">{coupon.code}</strong> applied
              </span>
              <button type="button" onClick={coupon.onRemove} className="border-b border-ink hover:text-accent">
                Remove
              </button>
            </div>
          ) : (
            <>
              <label htmlFor="coupon" className="text-eyebrow text-ink-soft">
                Promo code
              </label>
              <div className="mt-2 flex items-end gap-6">
                <input
                  id="coupon"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  // Enter applies the code instead of submitting the checkout form
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    void apply();
                  }}
                  className="h-11 min-w-0 flex-1 border-b border-ink bg-transparent text-body outline-none focus:border-accent"
                />
                <Button type="button" variant="outline" onClick={apply} disabled={!code} loading={applying}>
                  Apply
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      <dl data-fade data-delay="0.35" className="mt-10 flex flex-col gap-4.5 border-t border-line pt-7 text-body">
        <div className="flex justify-between gap-4">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {Boolean(discount) && (
          <div className="flex justify-between gap-4 text-sale">
            <dt>Discount</dt>
            <dd>−{formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt>Delivery</dt>
          <dd className="text-right">
            {shipping == null ? "Calculated after address" : shipping === 0 ? "Free" : formatPrice(shipping)}
          </dd>
        </div>
        {Boolean(tax) && (
          <div className="flex justify-between gap-4">
            <dt>Taxes</dt>
            <dd>{formatPrice(tax)}</dd>
          </div>
        )}
      </dl>
      <p
        data-fade
        data-delay="0.45"
        className="mt-7 flex items-baseline justify-between gap-4 border-t border-line pt-7 text-title"
      >
        <span>Total</span>
        <span className="text-accent">{formatPrice(total)}</span>
      </p>
      <p data-fade="in" data-delay="0.5" className="mt-7 text-small text-ink-soft">
        Prices in INR. International cards are charged in your card’s currency.
      </p>
    </section>
  );
}
