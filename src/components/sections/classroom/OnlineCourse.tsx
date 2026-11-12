import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { classroomLinks, courseModules } from "@/data/classroom";

/** The self-paced Copperplate course: workbook cover beside the module list */
export default function OnlineCourse() {
  return (
    <section aria-labelledby="online-courses" className="container grid-split items-center py-section">
      <Image
        src="/images/classroom/course_book.svg"
        alt="The Copperplate Collective workbook"
        width={479}
        height={627}
        // A Figma export with an embedded photo: serve as-is, the optimiser doesn't take SVG
        unoptimized
        data-fade
        className="mx-auto w-full max-w-sm md:max-w-none"
      />

      <div>
        <h2 id="online-courses" data-heading-effect className="text-title-xl text-flourish">
          Online Courses
        </h2>
        <p className="mt-4 max-w-md text-body-lg text-muted">
          A self-paced Copperplate course: nine modules of short, follow-along videos.
        </p>

        <div className="relative mt-8 pt-6">
          <span aria-hidden="true" data-draw data-delay="0.3" className="absolute inset-x-0 top-0 h-px bg-line" />
          <h3 className="text-eyebrow text-accent">The breakdown</h3>
          <ol className="mt-5 grid gap-x-12 gap-y-2.5 text-body sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-5">
            {courseModules.map((module, i) => (
              <li key={module} className="flex gap-2">
                <span className="w-5 shrink-0 text-accent-soft tabular-nums">{i + 1}.</span>
                {module}
              </li>
            ))}
            <li className="text-flourish text-body-lg text-accent-soft">
              + bonus: numbers, lowercase variations & punctuation
            </li>
          </ol>
        </div>

        <div data-fade className="mt-stack flex flex-wrap items-center gap-x-10 gap-y-5">
          <ButtonLink href={classroomLinks.collective} variant="accent" size="lg">
            <em className="text-flourish">Visit the</em> COLLECTIVE
          </ButtonLink>
          <Link
            href={classroomLinks.miniCourse}
            className="font-primary text-caption text-accent underline underline-offset-4 transition-colors hover:text-ink"
          >
            Join the free mini course
          </Link>
        </div>
      </div>
    </section>
  );
}
