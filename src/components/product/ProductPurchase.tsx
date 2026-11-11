"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Price from "@/components/ui/Price";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useCart } from "@/hooks/useCart";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types";
import { cn } from "@/utils/cn";
import { primaryImage } from "@/utils/media";
import { displayPrice, findVariant, isOutOfStock, toVariantDetail } from "@/utils/product";

/**
 * Price, option pickers, quantity, "Add to BAG" and "Buy NOW".
 * A variant is matched once every option has a choice. `children` (the summary
 * line and description) render between the price and the options.
 */
export default function ProductPurchase({ product, children }: { product: Product; children?: React.ReactNode }) {
  const router = useRouter();
  const options = product.productOptions ?? [];
  const variants = product.variants ?? [];
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState<"bag" | "buy" | null>(null);
  const { addItem } = useCart();
  const openCart = useCartStore((s) => s.open);

  const complete = options.every((o) => selected[o.optionName]);
  // Products without options sell their single variant directly
  const variant =
    options.length === 0 ? variants[0] : complete ? findVariant(variants, Object.values(selected)) : undefined;
  const soldOut = variant ? isOutOfStock(variant) : variants.length > 0 && variants.every((v) => isOutOfStock(v));
  const { price, compareAt } = displayPrice(product);
  const shownPrice = variant?.variantPrice && !compareAt ? variant.variantPrice : price;
  const maxQty = variant?.trackInventory ? (variant.stockQuantity ?? undefined) : undefined;

  /** A choice is unavailable if every variant containing it (with the other picks) is sold out */
  const choiceSoldOut = (optionName: string, choice: string) => {
    const picks = Object.values({ ...selected, [optionName]: choice });
    const matches = variants.filter((v) => picks.every((p) => v.selectedOptions?.includes(p)));
    return matches.length > 0 && matches.every((v) => isOutOfStock(v));
  };

  async function add(intent: "bag" | "buy") {
    if (!variant) {
      const missing = options.filter((o) => !selected[o.optionName]).map((o) => o.optionName.toLowerCase());
      setError(missing.length ? `Please choose ${missing.join(" and ")}.` : "This combination isn't available.");
      return;
    }
    setError("");
    setAdding(intent);
    // z-commerce adds one unit per call
    let added = true;
    for (let i = 0; i < qty && added; i++) {
      added = await addItem({
        productId: product._id,
        categoryId: product.categoryIds?.[0],
        variant: toVariantDetail(variant),
        product: {
          name: product.name,
          slug: product.slug,
          asset: primaryImage(product.assets),
          price: variant.variantPrice || shownPrice,
        },
      });
    }
    setAdding(null);
    if (!added) return;
    setQty(1);
    if (intent === "buy") router.push("/checkout");
    else openCart();
  }

  return (
    <div className="flex flex-col">
      <Price price={shownPrice} compareAt={compareAt} className="mt-3.5 text-title-sm" />
      {children}

      {options.map((option) => (
        <fieldset key={option.optionName} className="mt-10">
          <legend className="text-eyebrow">
            {option.optionName}
            {selected[option.optionName] && (
              <span className="ml-2 text-caption text-muted normal-case">{selected[option.optionName]}</span>
            )}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {option.choices.map((choice) => {
              const active = selected[option.optionName] === choice.name;
              const unavailable = choiceSoldOut(option.optionName, choice.name);
              return (
                <button
                  key={choice.name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setSelected((s) => ({ ...s, [option.optionName]: choice.name }));
                    setError("");
                  }}
                  className={cn(
                    "h-9 min-w-12 border border-ink px-4 text-eyebrow transition-colors",
                    active ? "bg-ink text-cream" : "hover:bg-ink/5",
                    unavailable && "text-placeholder line-through",
                  )}
                >
                  {choice.name}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      {/* Quantity + Add to BAG share a row at one height; Buy NOW spans the full width below */}
      <div className="mt-10 flex flex-col gap-3">
        <div className="flex gap-3">
          <QuantityStepper
            size="lg"
            value={qty}
            min={1}
            max={maxQty}
            disabled={soldOut || Boolean(adding)}
            onIncrement={() => setQty((q) => q + 1)}
            onDecrement={() => setQty((q) => Math.max(1, q - 1))}
          />
          <Button
            variant="paper"
            size="lg"
            loading={adding === "bag"}
            disabled={soldOut || Boolean(adding)}
            onClick={() => add("bag")}
            className="flex-1"
          >
            {soldOut ? "Sold out" : "Add to BAG"}
          </Button>
        </div>
        {!soldOut && (
          <Button
            variant="accent"
            size="lg"
            fullWidth
            loading={adding === "buy"}
            disabled={Boolean(adding)}
            onClick={() => add("buy")}
          >
            Buy NOW
          </Button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-caption text-sale">
          {error}
        </p>
      )}
    </div>
  );
}
