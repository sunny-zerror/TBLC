"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { RiLockLine } from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddressFields, { ContactFields, readAddress } from "@/components/checkout/AddressFields";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, TextField, formValues } from "@/components/ui/form";
import Skeleton from "@/components/ui/Skeleton";
import { CHECKOUT, GET_ADDRESSES } from "@/graphql";
import { useCart } from "@/hooks/useCart";
import { isApiConfigured } from "@/lib/env";
import { openNimbblCheckout } from "@/lib/payment";
import { selectIsLoggedIn, useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";
import type { Address } from "@/types";
import { errorMessage } from "@/utils/errors";

/** A message in place of the form: demo mode, empty cart */
function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container flex flex-col items-start gap-6 py-section">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default function CheckoutView() {
  const router = useRouter();
  const { cart, lines, loading, busy, applyCoupon, removeCoupon, removeItem } = useCart();
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const [sameBilling, setSameBilling] = useState(true);
  const [paying, setPaying] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [checkout] = useMutation(CHECKOUT);

  const { data: addressData } = useQuery(GET_ADDRESSES, {
    variables: { filters: { userId: user?._id }, limit: 20, sort: { primary: "DESC", createdAt: "DESC" } },
    skip: !isLoggedIn || !user?._id,
  });
  const saved = addressData?.getAddressByFilters.data ?? [];
  const chosen: Address | undefined = saved.find((a) => a._id === savedId) ?? saved.find((a) => a.primary) ?? saved[0];
  const shippingDefaults = chosen ?? {
    firstname: user?.firstName,
    lastname: user?.lastName,
    phone: user?.phoneNumber ?? "",
    countryCode: user?.countryCode ?? undefined,
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cart) return;
    if (!isApiConfigured) {
      toast.info("Demo mode — connect z-commerce in .env.local to take payments.");
      return;
    }
    const v = formValues(e.currentTarget);
    const shippingAddress = { ...readAddress(v, "shipping"), email: v.email, primary: true };
    const billingAddress = sameBilling
      ? { ...shippingAddress, primary: false }
      : { ...readAddress(v, "billing"), email: v.email, primary: false };

    setPaying(true);
    try {
      const { data } = await checkout({
        variables: {
          input: {
            cartId: cart._id,
            userData: {
              firstName: shippingAddress.firstname,
              lastName: shippingAddress.lastname,
              email: v.email,
              phoneNumber: shippingAddress.phone,
              countryCode: shippingAddress.countryCode,
              emailSubscribedStatus: v.newsletter ? "SUBSCRIBED" : user?.emailSubscribedStatus || "NEVER_SUBSCRIBED",
            },
            shippingAddress,
            billingAddress,
          },
        },
      });
      const token = data?.clientCheckout.nimbblData?.token;
      if (!token) throw new Error("Payment couldn't be started.");
      router.push(await openNimbblCheckout(token));
    } catch (error) {
      toast.error(errorMessage(error, "Checkout failed. Please try again."));
      setPaying(false);
    }
  }

  if (loading) {
    return (
      // Shaped like the form (heading + underlined fields) beside the order summary panel
      <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" aria-busy="true" aria-label="Loading checkout">
        <div className="order-2 px-gutter pt-12 pb-section lg:order-1 lg:pr-20">
          <div className="flex max-w-170 flex-col gap-8">
            <Skeleton className="h-10 w-40" />
            {[0, 1, 2].map((field) => (
              <div key={field} className="flex flex-col gap-3 border-b border-line pb-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
            <Skeleton className="mt-8 h-10 w-40" />
            {[0, 1].map((field) => (
              <div key={field} className="flex flex-col gap-3 border-b border-line pb-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-56" />
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 bg-surface grain px-gutter py-12 lg:order-2 lg:pl-18">
          <div className="flex max-w-115 flex-col gap-8">
            <Skeleton className="h-10 w-56" />
            <div className="flex gap-6 border-b border-line pb-7">
              <Skeleton className="aspect-5/6 w-21" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-3/5" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
            {[0, 1].map((row) => (
              <div key={row} className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
            <div className="flex justify-between border-t border-line pt-7">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || lines.length === 0) {
    return (
      <Notice title="Your cart is empty">
        <ButtonLink href="/shop" variant="paper" size="lg" className="w-60">
          <em className="text-flourish">Back to</em> STORE
        </ButtonLink>
      </Notice>
    );
  }

  const total = cart.discountedPrice || cart.totalprice;

  return (
    <form onSubmit={onSubmit} className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div className="order-2 px-gutter pt-12 pb-section lg:order-1 lg:pr-20">
        <div className="flex max-w-170 flex-col">
          {!isLoggedIn && (
            <p className="text-body text-ink-soft">
              Have an account?{" "}
              <Link href="/login?next=/checkout" className="border-b border-accent text-ink hover:text-accent">
                Log in
              </Link>{" "}
              or continue as a guest.
            </p>
          )}

          <fieldset className="mt-16 first:mt-0">
            <legend className="contents">
              <h2 data-heading-effect data-delay="0.1">
                Contact
              </h2>
            </legend>
            <div className="mt-8 flex flex-col gap-6">
              <TextField
                label="Email"
                name="email"
                type="email"
                variant="line"
                placeholder="you@example.com"
                autoComplete="email"
                defaultValue={user?.email}
                required
              />
              <ContactFields key={chosen?._id ?? "new"} prefix="shipping" defaults={shippingDefaults} variant="line" />
              <Checkbox name="newsletter" defaultChecked label="Email me about new collections, classes and events" />
            </div>
          </fieldset>

          <fieldset className="mt-16">
            <legend className="contents">
              <h2 data-heading-effect>Delivery</h2>
            </legend>
            {saved.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {saved.map((a) => (
                  <button
                    key={a._id}
                    type="button"
                    onClick={() => setSavedId(a._id ?? null)}
                    aria-pressed={a._id === chosen?._id}
                    className="border border-ink px-3 py-2 text-caption aria-pressed:bg-ink aria-pressed:text-cream"
                  >
                    {a.addressType || a.city} — {a.addressline1}
                  </button>
                ))}
              </div>
            )}
            <div className="mt-8">
              <AddressFields prefix="shipping" defaults={shippingDefaults} variant="line" contact={false} />
            </div>
            <Checkbox
              className="mt-6"
              checked={sameBilling}
              onChange={(e) => setSameBilling(e.target.checked)}
              label="Billing address is the same as delivery"
            />
          </fieldset>

          {!sameBilling && (
            <fieldset className="mt-16">
              <legend className="contents">
                <h2 data-heading-effect>Billing</h2>
              </legend>
              <div className="mt-8">
                <AddressFields prefix="billing" variant="line" />
              </div>
            </fieldset>
          )}

          <section aria-labelledby="payment" className="mt-16">
            <h2 id="payment" data-heading-effect>
              Payment
            </h2>
            <p className="mt-8 flex min-h-18 items-center border border-ink px-5 text-body text-ink-soft">
              UPI &nbsp;·&nbsp; Cards &nbsp;·&nbsp; Net banking &nbsp;·&nbsp; International cards
            </p>
            <Button
              type="submit"
              variant="accent"
              size="lg"
              fullWidth
              loading={paying}
              data-fade
              data-delay="0.25"
              className="mt-9 h-14"
            >
              Checkout
            </Button>
            {!isApiConfigured && (
              <p role="status" className="mt-4 text-caption text-accent">
                Demo mode: your cart is saved in this browser. Connect z-commerce in .env.local to take payments.
              </p>
            )}
            <p className="mt-8 text-caption text-ink-soft">
              By continuing you agree to our Terms of service, Privacy policy and Shipping &amp; refunds policy.
            </p>
          </section>
        </div>
      </div>

      <aside
        aria-label="Order summary"
        className="order-1 flex flex-col bg-surface grain px-gutter py-12 lg:order-2 lg:pl-18"
      >
        <div className="max-w-115 lg:sticky lg:top-12">
          <OrderSummary
            lines={lines}
            subtotal={cart.totalprice}
            discount={cart.totalDiscount}
            tax={cart.totalTax}
            total={total}
            coupon={{ code: cart.coupon?.couponCode, onApply: applyCoupon, onRemove: removeCoupon }}
            onRemoveLine={(line) => void removeItem(line)}
            busy={busy}
          />
          <p className="mt-14 flex items-center justify-center gap-2 text-caption text-ink-soft">
            <RiLockLine className="size-3.5" aria-hidden="true" />
            Secure checkout
          </p>
        </div>
      </aside>
    </form>
  );
}
