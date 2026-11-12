import Link from "next/link";
import WorkshopTicket from "@/components/sections/classroom/WorkshopTicket";
import { workshops } from "@/data/classroom";

/** The season's other workshops as tickets, beside a link back to the Classroom */
export default function MoreWorkshops({ currentSlug }: { currentSlug: string }) {
  const others = workshops.filter((w) => w.slug !== currentSlug);
  if (others.length === 0) return null;

  return (
    <section aria-labelledby="more-workshops" className="bg-surface grain py-section">
      <div className="container grid gap-stack lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-x-16">
        <div>
          <h2 id="more-workshops" data-heading-effect className="text-title-xl">
            More from the <em className="text-flourish text-accent">Classroom</em>
          </h2>
          <p className="mt-4 max-w-xs text-body text-muted">
            More tables are set this season, online and in the studio.
          </p>
          <Link
            href="/classroom#workshops"

            className="mt-6 inline-block text-lead text-flourish text-accent underline underline-offset-4 transition-colors hover:text-ink"
          >
            See all classes &amp; workshops →
          </Link>
        </div>

        {/* Bottom padding leaves room for a stub torn off on hover */}
        <div data-stagger="0.15" className="grid gap-grid pb-4 sm:grid-cols-2">
          {others.slice(0, 2).map((workshop) => (
            <WorkshopTicket key={workshop.slug} workshop={workshop} />
          ))}
        </div>
      </div>
    </section>
  );
}
