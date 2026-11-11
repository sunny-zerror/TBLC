import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({ title: "Your cart", path: "/cart", noIndex: true });

export default function CartPage() {
  return <CartView />;
}
