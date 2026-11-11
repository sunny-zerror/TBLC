import Link from "next/link";
import Logo from "@/components/layout/Logo";

/** The checkout's own slim header — the site navigation is hidden on this page */
export default function CheckoutHeader() {
  return (
    <header className="border-b border-line">
      <div data-fade="down" className="container grid h-header grid-cols-[1fr_auto_1fr] items-center gap-4">
        <h1 data-heading-effect="words" data-delay="0.15" className="text-title-sm">
          Checkout
        </h1>
        <Logo />
        <Link
          href="/shop"
          className="justify-self-end border-b border-accent pb-0.5 text-caption whitespace-nowrap hover:text-accent"
        >
          Continue browsing
        </Link>
      </div>
    </header>
  );
}
