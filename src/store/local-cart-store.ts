import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine } from "@/types";

/** One cart line is a product + variant pair */
export const lineKey = (line: Pick<CartLine, "productId" | "variantDetail">) =>
  `${line.productId}-${line.variantDetail?.variantDetailId ?? ""}`;

interface LocalCartState {
  lines: CartLine[];
  /** Adds one unit, or tops up the line if that product + variant is already in the cart */
  add: (line: Omit<CartLine, "qty" | "finalPrice">, qty?: number) => void;
  /** Changes a line's quantity by delta; a line that reaches 0 is removed */
  change: (key: string, delta: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const priced = (line: CartLine, qty: number): CartLine => ({ ...line, qty, finalPrice: line.price * qty });

/*
 * The cart while z-commerce isn't connected (see isApiConfigured): lives in this browser only.
 * Once the store is connected, useCart switches to the server cart and this store goes unused.
 * Persisted with skipHydration like the other stores — <StoreHydration /> rehydrates it.
 */
export const useLocalCartStore = create<LocalCartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (line, qty = 1) =>
        set(({ lines }) => {
          const key = lineKey(line);
          const existing = lines.find((l) => lineKey(l) === key);
          if (!existing) return { lines: [...lines, priced({ ...line, qty: 0, finalPrice: 0 }, qty)] };
          return { lines: lines.map((l) => (l === existing ? priced(l, l.qty + qty) : l)) };
        }),
      change: (key, delta) =>
        set(({ lines }) => ({
          lines: lines.flatMap((l) => {
            if (lineKey(l) !== key) return [l];
            const qty = l.qty + delta;
            return qty > 0 ? [priced(l, qty)] : [];
          }),
        })),
      remove: (key) => set(({ lines }) => ({ lines: lines.filter((l) => lineKey(l) !== key) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "tblc-local-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ lines }) => ({ lines }),
      skipHydration: true,
    },
  ),
);
