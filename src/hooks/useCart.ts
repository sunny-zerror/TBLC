"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { ADD_ITEM_TO_CART, APPLY_COUPON, GET_CART, REMOVE_COUPON, REMOVE_ITEM_FROM_CART } from "@/graphql";
import { isApiConfigured } from "@/lib/env";
import { selectIsLoggedIn, useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { lineKey, useLocalCartStore } from "@/store/local-cart-store";
import { toast } from "@/store/toast-store";
import type { Asset, Cart, CartLine, VariantDetail } from "@/types";
import { errorMessage } from "@/utils/errors";
import { stripTypename } from "@/utils/product";

const refetchCart = { refetchQueries: ["GetCart"], awaitRefetchQueries: true };

function requireApi() {
  if (isApiConfigured) return true;
  toast.info("Demo mode — connect z-commerce in .env.local to use the cart.");
  return false;
}

/** What the demo cart needs to draw a line without asking z-commerce */
export interface CartProductInfo {
  name: string;
  slug: string;
  asset?: Asset | null;
  /** unit price to charge for the chosen variant */
  price: number;
}

/*
 * The server-side cart. Signed-in shoppers are identified by their access token,
 * guests by the guestId from the cart store — z-commerce merges the guest cart
 * into the account when they log in.
 *
 * Until z-commerce is connected (!isApiConfigured) the same hook is backed by the
 * Zustand local cart instead, so adding, the cart page, the drawer and checkout all work.
 */
export function useCart() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const accessToken = useAuthStore((s) => s.accessToken);
  const userId = useAuthStore((s) => s.user?._id);
  const guestId = useCartStore((s) => s.guestId);

  const owner = isLoggedIn && accessToken ? { token: accessToken } : guestId ? { guestId } : null;

  const { data, loading } = useQuery(GET_CART, {
    variables: owner ?? {},
    skip: !hydrated || !owner || !isApiConfigured,
    fetchPolicy: "cache-and-network",
  });

  const [addMutation, addState] = useMutation(ADD_ITEM_TO_CART, refetchCart);
  const [removeMutation, removeState] = useMutation(REMOVE_ITEM_FROM_CART, refetchCart);
  const [applyMutation, applyState] = useMutation(APPLY_COUPON, refetchCart);
  const [removeCouponMutation] = useMutation(REMOVE_COUPON, refetchCart);

  const localLines = useLocalCartStore((s) => s.lines);
  const local = useLocalCartStore.getState;

  const serverCart = data?.getCart ?? null;
  const localCart: Cart | null = isApiConfigured
    ? null
    : {
        _id: "local",
        itemcount: localLines.reduce((n, l) => n + l.qty, 0),
        totalprice: localLines.reduce((sum, l) => sum + l.finalPrice, 0),
        discountedPrice: 0,
        totalDiscount: 0,
        totalTax: 0,
        cart: localLines,
      };
  const cart = isApiConfigured ? serverCart : localCart;

  async function addItem(item: {
    productId: string;
    categoryId?: string;
    variant: VariantDetail;
    /** needed for the demo cart, which has no server to look the product up on */
    product?: CartProductInfo;
  }) {
    if (!isApiConfigured) {
      if (!item.product) return false;
      const { name, slug, asset, price } = item.product;
      local().add({
        productId: item.productId,
        name,
        price,
        asset,
        variantDetail: item.variant,
        product: { _id: item.productId, name, slug },
      });
      return true;
    }
    try {
      await addMutation({
        variables: {
          input: {
            productId: item.productId,
            categoryId: item.categoryId,
            variantDetail: stripTypename(item.variant),
            ...(isLoggedIn && accessToken ? { token: accessToken } : {}),
          },
          ...(!isLoggedIn ? { guestId: useCartStore.getState().ensureGuestId() } : {}),
        },
      });
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "Couldn't add this to your bag."));
      return false;
    }
  }

  async function removeItem(line: CartLine, completely = true) {
    if (!isApiConfigured) {
      if (completely) local().remove(lineKey(line));
      else local().change(lineKey(line), -1);
      return;
    }
    try {
      await removeMutation({
        variables: {
          input: {
            productId: line.productId,
            variantDetailId: line.variantDetail?.variantDetailId,
            isCompleteRemove: completely,
            ...(isLoggedIn && userId ? { userId } : { guestId: guestId ?? undefined }),
          },
        },
      });
    } catch (error) {
      toast.error(errorMessage(error, "Couldn't update your bag."));
    }
  }

  const increment = async (line: CartLine) => {
    if (!isApiConfigured) {
      local().change(lineKey(line), 1);
      return true;
    }
    return line.variantDetail ? addItem({ productId: line.productId, variant: line.variantDetail }) : false;
  };

  const decrement = (line: CartLine) => removeItem(line, line.qty <= 1);

  async function applyCoupon(couponCode: string) {
    if (!requireApi()) return false;
    try {
      await applyMutation({ variables: { couponCode, ...(owner ?? {}) } });
      toast.success("Coupon applied");
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "That coupon can't be used."));
      return false;
    }
  }

  async function removeCoupon() {
    try {
      await removeCouponMutation({ variables: { ...(owner ?? {}) } });
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return {
    cart,
    lines: cart?.cart ?? [],
    count: cart?.itemcount ?? 0,
    subtotal: cart?.totalprice ?? 0,
    loading: !hydrated || (loading && !cart),
    busy: addState.loading || removeState.loading || applyState.loading,
    addItem,
    removeItem,
    increment,
    decrement,
    applyCoupon,
    removeCoupon,
  };
}
