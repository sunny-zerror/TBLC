import { RiArrowDownLine } from "@remixicon/react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { classroomStats, workshops } from "@/data/classroom";
import { cn } from "@/utils/cn";

/** 2πr of the badge's text circle, so the words wrap it exactly once */
const BADGE_RADIUS = 46;
const BADGE_CIRCUMFERENCE = 2 * Math.PI * BADGE_RADIUS;

/** A round seal of slowly turning text over the arch's edge, pointing on down the page */
function ScrollBadge({ className }: { className?: string }) {
  return (
    <a
      href="#workshops"
      aria-label="Jump to the workshops"
      data-fade="in"
      data-delay="0.9"
      className={cn(
        "group center size-28 rounded-full bg-paper text-accent shadow-xl shadow-accent/15 md:size-36",
        className,
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 120 120" className="absolute inset-0 size-full animate-turn">
        <defs>
          <path
            id="classroom-badge-circle"
            d={`M60,60 m-${BADGE_RADIUS},0 a${BADGE_RADIUS},${BADGE_RADIUS} 0 1,1 ${BADGE_RADIUS * 2},0 a${BADGE_RADIUS},${BADGE_RADIUS} 0 1,1 -${BADGE_RADIUS * 2},0`}
          />
        </defs>
        <text className="fill-current text-eyebrow">
          <textPath href="#classroom-badge-circle" textLength={BADGE_CIRCUMFERENCE} lengthAdjust="spacing">
            Learn with us · Since 2018 ·
          </textPath>
        </text>
      </svg>
      <RiArrowDownLine className="size-5 transition-transform duration-700 ease-out-expo group-hover:translate-y-1" />
    </a>
  );
}

/*
 * The Classroom's title page: a run of meta over a hairline, then the title set large beside
 * Sanjana's portrait in an arch, a turning badge on its edge. The intro and the figures sit under
 * the title, the figures on the arch's baseline.
 */
export default function ClassroomHero() {
  return (
    <section className="bg-surface grain">
      <div className="container pt-8 pb-section md:pt-10">

        <div className="mt-stack grid gap-x-grid gap-y-stack lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr]">
          <h1 className="text-display lg:col-span-7 lg:col-start-1 lg:row-start-1">
            <span data-heading-effect="words" className="block">
              The
            </span>
            <span className="flex items-start gap-3">
              <span data-heading-effect="words" data-delay="0.1">
                Classroom
              </span>
              <span className="mt-[0.1em] text-count text-accent-soft">({workshops.length})</span>
            </span>
            {/* Tucked under "Classroom", overlapping it slightly as in the lettering */}
            <em
              data-heading-effect
              data-delay="0.4"
              className="mt-[-0.2em] block pr-[0.3em] text-right text-flourish text-aside text-accent-soft"
            >
              learn with us
            </em>
          </h1>

          <div className="relative lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1">
            <div
              data-image-reveal="zoom"
              className="relative aspect-4/5 overflow-hidden rounded-t-full bg-blush lg:aspect-auto lg:h-full lg:min-h-120"
            >
              <Image
                src="/images/classroom/hero.jpg"
                alt="Sanjana lettering at her desk in the Colaba studio"
                fill
                priority
                sizes="(min-width: 64rem) 40vw, 100vw"
                data-parallax="0.1"
                className="object-cover object-[50%_30%]"
              />
            </div>
            <ScrollBadge className="absolute right-4 bottom-4 lg:right-auto lg:bottom-[18%] lg:-left-18" />
          </div>

          <div className="max-w-xl lg:col-span-6 lg:col-start-1 lg:row-start-2">
            <p className="text-body-lg text-ink-soft">
              When Sanjana began learning calligraphy in 2018, India had no formal resources, instructors or supplies
              for it. Today the Classroom holds digital and in-person workshops in Copperplate calligraphy, brush
              lettering and creative entrepreneurship.
            </p>
            <ButtonLink href="#workshops" variant="accent" size="lg" data-fade data-delay="0.75" className="mt-8">
              <em className="text-flourish">Find your</em> CLASS
            </ButtonLink>
          </div>

          <dl className="grid grid-cols-3 border-t border-line lg:col-span-6 lg:col-start-1 lg:row-start-3 lg:self-end">
            {classroomStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col-reverse gap-2 border-l border-line pt-5 pl-4 first:border-l-0 first:pl-0 md:pl-6"
              >
                <dt className="text-eyebrow text-muted">{stat.label}</dt>
                <dd data-counter={stat.count || undefined} className="text-title tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
