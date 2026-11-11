import type { Metadata } from "next";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutView from "@/components/checkout/CheckoutView";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({ title: "Checkout", path: "/checkout", noIndex: true });

// The site header and footer are hidden here (see SiteChrome) — checkout draws its own
export default function CheckoutPage() {
  return (
    <>
      <CheckoutHeader />
      <CheckoutView />
    </>
  );
}
