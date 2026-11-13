"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { classroomLinks, courseModules, courseNote } from "@/data/classroom";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/utils/cn";

/** The cover's proportions, from the original workbook artwork */
const ASPECT = "aspect-[397/545]";

function Cover() {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-l-sm rounded-r-lg bg-accent grain shadow-2xl shadow-accent/25 backface-hidden">
      {/* Spine: a darker band and the crease where the board folds */}
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[7%] bg-ink/20" />
      <span aria-hidden="true" className="absolute inset-y-0 left-[8.5%] w-px bg-ink/15" />

      <div className="relative mx-auto mt-[19%] w-[74%] rounded-xl border border-line bg-cream p-[2%] shadow-sm shadow-ink/10">
        <div className="rounded-lg border border-blush px-[8%] pb-[7%]">
          <Image
            src="/images/classroom/copperplate_collective.jpg"
            alt="The Copperplate Collective"
            width={1280}
            height={720}
            sizes="18rem"
            className="w-full mix-blend-multiply"
          />
          <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2 text-ink">
            <span className="text-eyebrow">Name</span>
            <span className="border-b border-line text-flourish text-body text-accent-soft">your name here</span>
            <span className="text-eyebrow">Subject</span>
            <span className="text-flourish text-body">Copperplate calligraphy</span>
          </div>
        </div>
      </div>

      <div className="relative mt-auto px-[17%] pb-[9%] text-cream">
        <p className="text-eyebrow text-cream/70">{courseModules.length} modules &nbsp;·&nbsp; Self-paced</p>
        <p className="mt-1 text-lead text-flourish">The Bombay Lettering Co.</p>
      </div>
    </div>
  );
}

/** Written in under the note inside the cover — or, where the book lies flat, at the foot of the first page */
function MiniCourseLink({ className }: { className?: string }) {
  return (
    <p data-ink className={cn("text-body text-ink-soft", className)}>
      Just starting out?{" "}
      <Link href={classroomLinks.miniCourse} className="link-line text-flourish text-body-lg text-accent">
        Join the free mini course
      </Link>
    </p>
  );
}

/** The inside of the front cover, seen once it's turned: a note and a bookplate */
function InsideCover() {
  return (
    <div className="absolute inset-0 hidden rotate-y-180 flex-col rounded-l-lg rounded-r-sm bg-surface grain p-[11%] shadow-xl shadow-accent/15 backface-hidden lg:flex">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-[12%] bg-linear-to-l from-ink/10 to-transparent"
      />
      <p className="text-eyebrow text-accent">A note before you begin</p>
      <p data-ink className="mt-5 text-lead text-flourish text-ink-soft">
        {courseNote}
      </p>
      <MiniCourseLink className="mt-6" />
      <div className="mt-auto rounded-md border border-line p-[8%]">
        <p className="text-eyebrow text-muted">This workbook belongs to</p>
        <p className="mt-3 border-b border-line">
          <span data-ink className="inline-block text-title-sm text-flourish text-accent">
            you.
          </span>
        </p>
      </div>
    </div>
  );
}

/** The first page: the curriculum, written on a Copperplate guide sheet */
function FirstPage() {
  return (
    <div className="relative rounded-r-md bg-cream guide-sheet px-6 py-8 page-stack lg:absolute lg:inset-y-[1.5%] lg:right-[1.5%] lg:left-0 lg:px-[9%] lg:py-[9%]">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 hidden w-[10%] bg-linear-to-r from-ink/10 to-transparent lg:block"
      />
      <h3 className="text-eyebrow text-accent">The breakdown</h3>
      <ol className="mt-4 text-body">
        {courseModules.map((module, i) => (
          <li key={module} className="border-b border-blush py-1.5">
            <span data-ink className="flex gap-3">
              <span className="w-5 shrink-0 text-accent-soft tabular-nums">{i + 1}.</span>
              {module}
            </span>
          </li>
        ))}
        <li className="pt-3">
          <span data-ink className="block text-flourish text-body-lg text-accent-soft">
            + bonus: numbers, lowercase variations & punctuation
          </span>
        </li>
      </ol>
      <MiniCourseLink className="mt-6 lg:hidden" />
      {/* Ribbon bookmark, hanging out under the book */}
      <span
        aria-hidden="true"
        className="absolute top-full right-[16%] h-10 w-3 bg-accent [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)]"
      />
    </div>
  );
}

/*
 * The Copperplate Collective workbook. On wide screens it's a 3D book that opens as it scrolls into
 * view: the cover swings open on its spine while the book slides over to centre the spread, then the
 * curriculum and the note inside the cover are written in, line by line. Scrolling back above it
 * closes it again. Below lg it lays flat — the cover, with the first page under it — so the list stays
 * readable. Reduced motion: it simply sits open.
 */
export default function CourseBook() {
  const scope = useRef<HTMLDivElement>(null);
  const book = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ book: "(min-width: 64rem)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
        if (!context.conditions?.book || !scope.current) return;
        const reduce = context.conditions.reduce;
        const ink = scope.current.querySelectorAll("[data-ink]");

        // Lift the cover a hair off the page so the two never z-fight
        gsap.set(cover.current, { z: 1 });
        const tl = gsap
          .timeline({
            paused: reduce,
            defaults: { duration: 1.2, ease: "power3.inOut" },
            scrollTrigger: reduce
              ? undefined
              : { trigger: scope.current, start: "top 60%", toggleActions: "play none none reverse" },
          })
          .to(book.current, { xPercent: 50 }, 0)
          .to(cover.current, { rotateY: -180 }, 0)
          // Written in left to right; the outset keeps italic overhangs and descenders unclipped
          .fromTo(
            ink,
            { clipPath: "inset(-20% 100% -20% -5%)" },
            { clipPath: "inset(-20% -5% -20% -5%)", duration: 0.7, ease: "power2.out", stagger: 0.07 },
            0.55,
          );
        if (reduce) tl.progress(1);
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="@container flex justify-center">
      <div className="w-full lg:relative lg:h-[calc(var(--w)*545/397)] lg:w-[calc(var(--w)*2)] lg:[--w:min(26rem,46cqi)] lg:perspective-[2500px]">
        <div
          ref={book}
          className="relative mx-auto flex w-full max-w-sm flex-col gap-8 lg:absolute lg:inset-y-0 lg:left-[calc(var(--w)/2)] lg:mx-0 lg:block lg:w-(--w) lg:max-w-none lg:transform-3d"
        >
          <FirstPage />
          <div
            ref={cover}
            className={`relative -order-1 ${ASPECT} lg:absolute lg:inset-0 lg:aspect-auto lg:origin-left lg:transform-3d`}
          >
            <Cover />
            <InsideCover />
          </div>
        </div>
      </div>
    </div>
  );
}
