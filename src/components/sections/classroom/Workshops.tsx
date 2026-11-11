import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { classroomLinks, type Workshop, workshops } from "@/data/classroom";
import { formatPrice } from "@/utils/format";

const bookingHref = (w: Workshop) => `/contact?subject=${encodeURIComponent(`Book: ${w.title} (${w.date})`)}`;

/** "from your first *hairline*" → sans text with the starred words in the serif italic */
function WithFlourish({ text }: { text: string }) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 ? (
      <em key={i} className="text-flourish">
        {part}
      </em>
    ) : (
      part
    ),
  );
}

/*
 * A workshop as a ticket: the details card, then a stub joined along a dashed tear line.
 * Hovering tears the stub: it drops and tilts, and the barcode gives way to "Book a SEAT".
 * Touch screens can't hover, so they always show the button.
 */
function WorkshopTicket({ workshop }: { workshop: Workshop }) {
  return (
    <article className="group/ticket flex flex-col text-accent">
      <div className="relative flex flex-1 flex-col rounded-2xl bg-cream grain p-6 xl:p-8">
        {/* One straight tear line along the seam, stopping where the rounded corners begin */}
        <span aria-hidden="true" className="absolute inset-x-4 bottom-0 h-0.5 text-accent-soft perforation" />
        <p className="text-eyebrow">
          {workshop.date} · {workshop.mode}
        </p>
        <h3 className="mt-3 text-title text-flourish">{workshop.title}</h3>
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
            href={bookingHref(workshop)}
            variant="accent"
            fullWidth
            className="h-12 transition-opacity duration-300 pointer-fine:opacity-0 pointer-fine:group-focus-within/ticket:opacity-100 pointer-fine:group-hover/ticket:opacity-100"
          >
            <em className="text-flourish">Book a</em> SEAT
          </ButtonLink>
        </div>
        <p className="mt-4 text-eyebrow">
          {workshop.seatsLeft} of {workshop.seats} seats left
        </p>
      </div>
    </article>
  );
}

export default function Workshops() {
  return (
    <section
      id="workshops"
      aria-labelledby="workshops-title"
      className="scroll-mt-header bg-accent-soft grain py-section text-cream"
    >
      <div className="container">
        <header className="mx-auto max-w-md text-center">
          <h2 id="workshops-title" data-heading-effect className="text-title-xl text-flourish">
            Workshops
          </h2>
          <p data-text-effect data-delay="0.2" className="mt-3 text-body">
            Small tables, real nibs, real paper, in the Colaba studio or live online.
          </p>
        </header>

        <div data-stagger="0.15" className="mt-stack grid gap-grid md:grid-cols-3">
          {workshops.map((workshop) => (
            <WorkshopTicket key={workshop.slug} workshop={workshop} />
          ))}
        </div>

        <div className="mx-auto mt-section max-w-xl text-center">
          <p data-heading-effect className="text-lead text-flourish">
            Every class is taught by hand.
          </p>
          <p data-text-effect data-delay="0.2" className="mt-2 text-body">
            Taught by Sanjana with corrections as you write, in small groups, with paper, nibs and ink at every desk.
          </p>
          <p data-fade data-delay="0.4" className="mt-6 text-lead">
            No date that suits you?{" "}
            <Link
              href={classroomLinks.waitingList}
              className="text-flourish underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              Join the waiting list
            </Link>{" "}
            <span aria-hidden="true">➳</span>
          </p>
        </div>
      </div>
    </section>
  );
}
