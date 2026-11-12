import Link from "next/link";
import WorkshopTicket from "@/components/sections/classroom/WorkshopTicket";
import { classroomLinks, workshops } from "@/data/classroom";

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
          <p className="mt-3 text-body">Small tables, real nibs, real paper, in the Colaba studio or live online.</p>
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
          <p className="mt-2 text-body">
            Taught by Sanjana with corrections as you write, in small groups, with paper, nibs and ink at every desk.
          </p>
          <p className="mt-6 text-lead">
            No date that suits you?{" "}
            <Link
              href={classroomLinks.waitingList}
              className="text-flourish underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              Join the waiting list
            </Link>{" "}
          </p>
        </div>
      </div>
    </section>
  );
}
