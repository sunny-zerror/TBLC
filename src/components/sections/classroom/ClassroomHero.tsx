import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { classroomStats, workshops } from "@/data/classroom";

/** Title, intro and stats on grained blush paper, beside a full-height portrait */
export default function ClassroomHero() {
  return (
    <section className="grid bg-surface grain md:min-h-[calc(100svh-var(--spacing-header))] md:grid-cols-2">
      <div className="flex flex-col justify-between gap-stack px-gutter py-section md:pr-12 lg:pl-[max(var(--spacing-gutter),5vw)]">
        <div className="my-auto">
          <h1 className="text-title-xl">
            <span className="flex items-start gap-2">
              <span data-heading-effect="words">The Classroom</span>
              <span data-fade="in" data-delay="0.6" className="mt-[-0.15em] text-count text-accent-soft">
                ({workshops.length})
              </span>
            </span>
            {/* Tucked under "Classroom", overlapping it slightly as in the lettering */}
            <em
              data-heading-effect
              data-delay="0.35"
              className="block pl-[3.6em] text-flourish text-aside text-accent-soft"
            >
              learn with us
            </em>
          </h1>

          <div className="mt-stack flex max-w-140 flex-col items-center">
            <p data-text-effect data-delay="0.5" className="text-body-lg text-ink-soft">
              When Sanjana began learning calligraphy in 2018, India had no formal resources, instructors or supplies
              for it. Today the Classroom holds digital and in-person workshops in Copperplate calligraphy, brush
              lettering and creative entrepreneurship.
            </p>
            <ButtonLink href="#workshops" variant="paper" size="lg" data-fade data-delay="0.75" className="mt-stack">
              <em className="text-flourish">Find your</em> CLASS
            </ButtonLink>
          </div>
        </div>

        <ul data-stagger data-delay="0.9" className="flex flex-wrap gap-x-3 gap-y-2 text-eyebrow text-accent">
          {classroomStats.map((stat, i) => (
            <li key={stat} className="flex gap-3">
              {i > 0 && <span aria-hidden="true">·</span>}
              {stat}
            </li>
          ))}
        </ul>
      </div>

      <div data-image-reveal className="relative aspect-4/5 overflow-hidden md:aspect-auto">
        <Image
          src="/images/classroom/hero.jpg"
          alt="Sanjana lettering at her desk in the Colaba studio"
          fill
          priority
          sizes="(min-width: 48rem) 50vw, 100vw"
          data-parallax="0.1"
          className="object-cover"
        />
      </div>
    </section>
  );
}
