import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import WithFlourish from "@/components/ui/WithFlourish";
import { bookingHref, type Workshop, workshopHref } from "@/data/classroom";
import { formatPrice } from "@/utils/format";

/*
 * A workshop as a ticket: the details card, then a stub joined along a dashed tear line.
 * Hovering tears the stub: it drops and tilts, and the barcode gives way to "Book a SEAT".
 * Touch screens can't hover, so they always show the button.
 */
export default function WorkshopTicket({ workshop }: { workshop: Workshop }) {
  const session = workshop.sessions[0];

  return (
    <article className="group/ticket flex flex-col text-accent">
      <div className="relative flex flex-1 flex-col rounded-2xl bg-cream grain p-6 xl:p-8">
        {/* One straight tear line along the seam, stopping where the rounded corners begin */}
        <span aria-hidden="true" className="absolute inset-x-4 bottom-0 h-0.5 text-accent-soft perforation" />
        <p className="text-eyebrow">
          {workshop.date} · {workshop.mode}
        </p>
        <h3 className="mt-3 text-title text-flourish">
          <Link href={workshopHref(workshop.slug)} className="link-line">
            {workshop.title}
          </Link>
        </h3>
        <p className="mt-6 text-body">
          <WithFlourish text={workshop.description} />
        </p>
        <ul className="mt-auto flex flex-col gap-1.5 pt-10 text-caption">
          {workshop.details.map((detail) => (
            <li key={detail} className="flex items-baseline gap-2.5">
              <span aria-hidden="true" className="text-small">
                ◆
              </span>
              {detail}
            </li>
          ))}
        </ul>
        <Link
          href={workshopHref(workshop.slug)}
          className="mt-6 self-start text-eyebrow underline underline-offset-4 transition-colors hover:text-ink"
        >
          View details
          <span className="sr-only">: {workshop.title}</span>
        </Link>
      </div>

      <div className="origin-top-left rounded-2xl bg-cream grain p-6 transition-transform duration-700 ease-out-expo group-focus-within/ticket:translate-y-4 group-focus-within/ticket:rotate-3 group-hover/ticket:translate-y-4 group-hover/ticket:rotate-3 xl:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-eyebrow">Seats from</p>
          <p className="text-title-sm">{formatPrice(workshop.price)}</p>
        </div>
        <div className="mt-4 grid h-12 *:col-start-1 *:row-start-1">
          <div
            aria-hidden="true"
            className="hidden barcode transition-opacity duration-300 group-focus-within/ticket:opacity-0 group-hover/ticket:opacity-0 pointer-fine:block"
          />
          <ButtonLink
            href={bookingHref(workshop.slug)}
            variant="accent"
            fullWidth
            className="h-12 transition-opacity duration-300 pointer-fine:opacity-0 pointer-fine:group-focus-within/ticket:opacity-100 pointer-fine:group-hover/ticket:opacity-100"
          >
            <em className="text-flourish">Book a</em> SEAT
          </ButtonLink>
        </div>
        {session && (
          <p className="mt-4 text-eyebrow">
            {session.seatsLeft} of {workshop.seats} seats left
          </p>
        )}
      </div>
    </article>
  );
}
