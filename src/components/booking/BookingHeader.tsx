import { RiLockLine } from "@remixicon/react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { workshopHref } from "@/data/classroom";

/** The booking page's own slim header over the form column — the site navigation is hidden here */
export default function BookingHeader({ slug }: { slug: string }) {
  return (
    // Same padding and width as the form below, so the two line up
    <header className="border-b border-line px-gutter lg:pr-20">
      <div className="flex h-header max-w-170 items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Logo className="h-9 md:h-11" />
          <h1 className="text-lead">Book your seat</h1>
        </div>
        <p className="hidden items-center gap-1.5 text-caption text-muted sm:flex">
          <RiLockLine className="size-3.5" aria-hidden="true" />
          Secure booking
        </p>
        <Link
          href={workshopHref(slug)}
          className="text-small font-medium whitespace-nowrap text-accent underline underline-offset-4 transition-colors hover:text-ink"
        >
          Back to the class
        </Link>
      </div>
    </header>
  );
}
