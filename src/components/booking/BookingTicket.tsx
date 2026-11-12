import WithFlourish from "@/components/ui/WithFlourish";
import type { Workshop, WorkshopSession } from "@/data/classroom";
import { formatPrice } from "@/utils/format";

const pad = (n: number) => String(n).padStart(2, "0");
const admit = ["one", "two", "three", "four", "five", "six"];

interface BookingTicketProps {
  workshop: Workshop;
  session: WorkshopSession;
  seats: number;
}

/** The booking summary as an admission ticket: the details, a torn perforation, then the total */
export default function BookingTicket({ workshop, session, seats }: BookingTicketProps) {
  const total = workshop.price * seats;
  // The next free desks at the table, in the order the seat map fills them
  const firstDesk = workshop.seats - session.seatsLeft + 1;
  const desks = seats > 1 ? `Desks ${pad(firstDesk)}–${pad(firstDesk + seats - 1)}` : `Desk ${pad(firstDesk)}`;

  const rows = [
    { label: "Dates", value: session.dates },
    { label: "Time", value: session.time },
    { label: "Where", value: session.place },
    { label: "Seats", value: String(seats) },
    ...(workshop.kitIncluded ? [{ label: "Kit", value: seats > 1 ? `Included, ×${seats}` : "Included" }] : []),
  ];

  return (
    <div className="bg-cream shadow-xl shadow-ink/10">
      <div className="px-6 pt-8 pb-10 md:px-10">
        <p className="text-eyebrow text-accent">Admit {admit[seats - 1] ?? seats} · The Classroom</p>
        <h2 className="mt-3 text-title-lg">
          <WithFlourish text={workshop.heading} className="block text-accent" />
        </h2>
        <dl className="mt-6 border-t border-line">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[6rem_1fr] items-baseline gap-4 border-b border-line py-4">
              <dt className="text-eyebrow text-muted">{row.label}</dt>
              <dd className="text-caption">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Tear line with a notch bitten out of each edge, in the panel colour behind the ticket */}
      <div aria-hidden="true" className="relative flex items-center">
        <span className="absolute -left-3 size-6 rounded-full bg-surface" />
        <span className="mx-6 h-px flex-1 text-line perforation" />
        <span className="absolute -right-3 size-6 rounded-full bg-surface" />
      </div>

      <div className="px-6 pt-8 pb-8 md:px-10">
        <dl className="flex flex-col gap-2 text-caption">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Taxes</dt>
            <dd className="text-muted">at payment</dd>
          </div>
        </dl>
        <p className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-5">
          <span className="text-title-sm">Total</span>
          {/* Keyed so the figure rolls in again when the seat count changes it */}
          <span key={total} className="animate-count-up text-title tabular-nums">
            {formatPrice(total)}
          </span>
        </p>
        {workshop.mode === "In the studio" && <p className="mt-4 text-title text-accent-soft">{desks}</p>}
      </div>
    </div>
  );
}
