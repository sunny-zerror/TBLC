import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import WithFlourish from "@/components/ui/WithFlourish";
import { bookingHref, type Workshop, workshopQuestionHref } from "@/data/classroom";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/format";

/*
 * "The table": the desks drawn as dots either side of a blush table, taken ones filled.
 * Desks fill left to right, alternating sides, so the taken ones sit facing each other.
 */
function TheTable({ seats, taken }: { seats: number; taken: number }) {
  const perSide = Math.ceil(seats / 2);
  const side = (s: 0 | 1) => (
    <div className="flex justify-between">
      {Array.from({ length: s === 0 ? perSide : seats - perSide }, (_, p) => (
        <span
          key={p}
          className={cn(
            "size-2.5 rounded-full border border-accent",
            p * 2 + s < taken ? "bg-accent" : "bg-transparent",
          )}
        />
      ))}
    </div>
  );

  return (
    <figure
      role="img"
      aria-label={`${taken} of ${seats} desks taken`}
      className="mx-auto flex w-full max-w-44 flex-col gap-2.5"
    >
      <figcaption className="text-center text-eyebrow text-muted">The table</figcaption>
      {side(0)}
      <span className="h-5 rounded-sm bg-blush" />
      {side(1)}
    </figure>
  );
}

/** Photo beside the title, the facts, the seat map, price and "Book a SEAT" */
export default function WorkshopHero({ workshop }: { workshop: Workshop }) {
  const session = workshop.sessions[0];
  const taken = session ? workshop.seats - session.seatsLeft : 0;
  const full = !session || session.seatsLeft <= 0;

  return (
    <section className="container grid items-start gap-x-16 gap-y-stack pt-5 pb-section md:grid-cols-[minmax(0,1fr)_minmax(0,32rem)]">
      <div data-image-reveal="zoom" className="relative aspect-4/5 overflow-hidden bg-surface">
        <Image
          src={workshop.image.src}
          alt={workshop.image.alt}
          fill
          priority
          sizes="(min-width: 48rem) 55vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="md:sticky md:top-[calc(var(--spacing-header)+1.5rem)]">
        <h1 data-heading-effect className="text-title-xl">
          <WithFlourish text={workshop.heading} className="text-accent" />
        </h1>
        <p className="mt-4 max-w-sm text-body text-ink-soft">{workshop.description.replace(/\*/g, "")}</p>

        <dl className="mt-8 border-t border-line">
          {workshop.facts.map((fact) => (
            <div key={fact.label} className="grid grid-cols-[6rem_1fr] gap-4 border-b border-line py-3">
              <dt className="text-eyebrow text-muted">{fact.label}</dt>
              <dd className="text-caption">{fact.value}</dd>
            </div>
          ))}
        </dl>

        {workshop.mode === "In the studio" && (
          <div className="mt-8">
            <TheTable seats={workshop.seats} taken={taken} />
          </div>
        )}

        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-title">{formatPrice(workshop.price)}</p>
            <p className="text-small text-muted">{workshop.priceNote}</p>
          </div>
          {session && (
            <p className="text-flourish text-caption text-muted">
              {session.seatsLeft} of {workshop.seats} seats left
            </p>
          )}
        </div>

        <div data-fade data-delay="0.6" className="mt-5 flex flex-col items-center gap-4">
          {full ? (
            <ButtonLink href={workshopQuestionHref(workshop)} variant="paper" size="lg" fullWidth>
              <em className="text-flourish">Join the</em> WAITING LIST
            </ButtonLink>
          ) : (
            <ButtonLink href={bookingHref(workshop.slug)} variant="accent" size="lg" fullWidth>
              <em className="text-flourish">Book a</em> SEAT
            </ButtonLink>
          )}
          <Link
            href={workshopQuestionHref(workshop)}
            className="text-small text-accent underline underline-offset-4 transition-colors hover:text-ink"
          >
            Ask a question about this class
          </Link>
        </div>
      </div>
    </section>
  );
}
