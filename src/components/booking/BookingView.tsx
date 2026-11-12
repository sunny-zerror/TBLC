"use client";

import { RiAddLine, RiSubtractLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BookingTicket from "@/components/booking/BookingTicket";
import { Button } from "@/components/ui/Button";
import { Checkbox, TextArea, TextField, formValues } from "@/components/ui/form";
import { bookingPaymentMethods, pointedPenExperience, type Workshop } from "@/data/classroom";
import { startBookingPayment } from "@/lib/booking";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";
import { cn } from "@/utils/cn";
import { errorMessage } from "@/utils/errors";
import { formatPrice } from "@/utils/format";

const numerals = ["I", "II", "III", "IV"];

/** A numbered step of the form: "II  Seats" */
function Step({ index, title, children }: { index: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-section first:mt-0">
      <legend className="contents">
        <h2 data-heading-effect className="text-title">
          <span className="mr-5 text-flourish text-accent-soft">{numerals[index]}</span>
          {title}
        </h2>
      </legend>
      <div className="mt-8">{children}</div>
    </fieldset>
  );
}

const chip =
  "cursor-pointer rounded-full border border-accent px-5 py-2 text-caption transition-colors duration-300 hover:bg-surface has-checked:bg-accent has-checked:text-cream has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent";

/** Session, seats, the student's details and payment beside a live admission ticket */
export default function BookingView({ workshop, header }: { workshop: Workshop; header: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const open = workshop.sessions.filter((s) => s.seatsLeft > 0);
  const [sessionId, setSessionId] = useState(open[0]?.startDate);
  const [seats, setSeats] = useState(1);
  const [paying, setPaying] = useState(false);

  const session = workshop.sessions.find((s) => s.startDate === sessionId) ?? open[0];
  if (!session) return null; // the page sends full workshops back to the class before rendering this
  const maxSeats = Math.min(session.seatsLeft, 6);
  const total = workshop.price * seats;

  function chooseSession(id: string) {
    const next = workshop.sessions.find((s) => s.startDate === id);
    setSessionId(id);
    if (next) setSeats((n) => Math.min(n, next.seatsLeft));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = formValues(e.currentTarget);
    setPaying(true);
    try {
      const redirect = await startBookingPayment({
        workshopSlug: workshop.slug,
        session: session.startDate,
        seats,
        firstName: v.firstName,
        lastName: v.lastName,
        email: v.email,
        phone: v.phone,
        guests: Array.from({ length: seats - 1 }, (_, i) => v[`guest-${i + 2}`]),
        experience: v.experience,
        leftHanded: Boolean(v.leftHanded),
        notes: v.notes,
        paymentMethod: v.paymentMethod,
        total,
      });
      if (redirect) {
        router.push(redirect);
        return;
      }
      toast.info("Online booking isn't connected yet — nothing has been charged. Write to us to hold your seat.");
    } catch (error) {
      toast.error(errorMessage(error, "Your booking didn't go through. Please try again."));
    }
    setPaying(false);
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div>
        {header}
        <form onSubmit={onSubmit} className="px-gutter pt-16 pb-section lg:pr-20">
          <div className="flex max-w-170 flex-col">
            <Step index={0} title="Choose your session">
              <div className="flex flex-col gap-4">
                {workshop.sessions.map((s) => {
                  const full = s.seatsLeft <= 0;
                  return (
                    <label
                      key={s.startDate}
                      className={cn(
                        "flex items-center gap-5 border border-line px-6 py-5 transition-colors duration-300 has-checked:border-accent has-checked:bg-surface",
                        full ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-accent",
                      )}
                    >
                      <input
                        type="radio"
                        name="session"
                        value={s.startDate}
                        checked={s.startDate === session.startDate}
                        onChange={() => chooseSession(s.startDate)}
                        disabled={full}
                        className="size-4.5 shrink-0 accent-accent"
                      />
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-title-sm">{s.dates}</span>
                        <span className="text-caption text-muted">
                          {s.time} · {s.place}
                        </span>
                      </span>
                      <span className="shrink-0 text-lead text-flourish text-accent">
                        {full ? "Full" : `${s.seatsLeft} seats left`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </Step>

            <Step index={1} title="Seats">
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                <div className="inline-flex h-14 items-center gap-2 rounded-full border border-accent px-2">
                  <button
                    type="button"
                    onClick={() => setSeats((n) => n - 1)}
                    disabled={seats <= 1}
                    aria-label="One seat fewer"
                    className="center size-10 rounded-full transition-colors enabled:hover:bg-surface disabled:opacity-40"
                  >
                    <RiSubtractLine className="size-4" />
                  </button>
                  <span aria-live="polite" className="w-16 text-center text-body tabular-nums">
                    {seats} {seats === 1 ? "seat" : "seats"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSeats((n) => n + 1)}
                    disabled={seats >= maxSeats}
                    aria-label="One more seat"
                    className="center size-10 rounded-full transition-colors enabled:hover:bg-surface disabled:opacity-40"
                  >
                    <RiAddLine className="size-4" />
                  </button>
                </div>
                <p className="text-lead text-flourish text-accent">
                  Bringing a friend? Add a seat and we&apos;ll ask for their name.
                </p>
              </div>
              {seats > 1 && (
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {Array.from({ length: seats - 1 }, (_, i) => (
                    <TextField
                      key={i}
                      variant="line"
                      label={`Seat ${i + 2} — full name`}
                      name={`guest-${i + 2}`}
                      required
                      className="animate-fade-up"
                    />
                  ))}
                </div>
              )}
            </Step>

            <Step index={2} title="About you">
              {/* Keyed by user: a signed-in student is restored after mount, and fills the fields then */}
              <div key={user?._id ?? "guest"} className="grid gap-x-12 gap-y-8 md:grid-cols-2">
                <TextField
                  variant="line"
                  label="First name"
                  name="firstName"
                  autoComplete="given-name"
                  defaultValue={user?.firstName}
                  required
                />
                <TextField
                  variant="line"
                  label="Last name"
                  name="lastName"
                  autoComplete="family-name"
                  defaultValue={user?.lastName}
                  required
                />
                <TextField
                  variant="line"
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={user?.email}
                  required
                  className="md:col-span-2"
                />
                <TextField
                  variant="line"
                  label="Phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91"
                  defaultValue={user?.phoneNumber ?? undefined}
                  required
                  className="md:col-span-2"
                />
              </div>

              <fieldset className="mt-12">
                <legend className="text-lead">Have you written with a pointed pen before?</legend>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {pointedPenExperience.map((answer, i) => (
                    <label key={answer} className={chip}>
                      <input
                        type="radio"
                        name="experience"
                        value={answer}
                        defaultChecked={i === 0}
                        className="sr-only"
                      />
                      {answer}
                    </label>
                  ))}
                </div>
              </fieldset>

              {workshop.mode === "In the studio" && (
                <Checkbox
                  name="leftHanded"
                  className="mt-8 text-body"
                  label="I write with my left hand, so please set my desk up for me"
                />
              )}
              <TextArea variant="line" label="Anything we should know? (optional)" name="notes" className="mt-10" />
            </Step>

            <Step index={3} title="Payment">
              <ul className="border-t border-line">
                {bookingPaymentMethods.map((method, i) => (
                  <li key={method}>
                    <label className="flex cursor-pointer items-center gap-4 border-b border-line py-5 text-body transition-colors hover:text-accent">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        defaultChecked={i === 0}
                        className="size-4.5 accent-accent"
                      />
                      {method}
                    </label>
                  </li>
                ))}
              </ul>

              <Button type="submit" variant="accent" fullWidth loading={paying} className="mt-12 h-16">
                <em className="text-flourish">Confirm and</em> PAY {formatPrice(total)}
              </Button>
              <p className="mt-6 text-small text-ink-soft">
                By booking you agree to our Terms of Service and the Cancellation &amp; refunds policy.
              </p>
            </Step>
          </div>
        </form>
      </div>

      <aside aria-label="Your booking" className="bg-surface grain px-gutter py-12 lg:py-24 lg:pl-18">
        <div className="max-w-115 lg:sticky lg:top-24">
          <div data-fade data-delay="0.2">
            <BookingTicket workshop={workshop} session={session} seats={seats} />
          </div>
          <p className="mt-10 text-lead text-flourish text-ink-soft">
            A confirmation, and a reminder the day before, will come to your inbox.
          </p>
        </div>
      </aside>
    </div>
  );
}
