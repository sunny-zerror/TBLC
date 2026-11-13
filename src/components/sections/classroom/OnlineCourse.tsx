import { ButtonLink } from "@/components/ui/Button";
import { classroomLinks } from "@/data/classroom";
import CourseBook from "./CourseBook";

/** The self-paced Copperplate course: the intro, then the workbook, which opens on scroll to show the curriculum */
export default function OnlineCourse() {
  return (
    <section aria-labelledby="online-courses" className="container py-section">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
        <div>
          <h2 id="online-courses" data-heading-effect className="text-title-xl text-flourish">
            Online Courses
          </h2>
          <p className="mt-4 max-w-md text-body-lg text-muted">
            A self-paced Copperplate course: nine modules of short, follow-along videos.
          </p>
        </div>

        <ButtonLink
          href={classroomLinks.collective}
          variant="accent"
          size="lg"
          data-fade
          className="shrink-0 self-start md:self-auto"
        >
          <em className="text-flourish">Visit the</em> COLLECTIVE
        </ButtonLink>
      </div>

      <div data-fade data-delay="0.2" className="mt-stack">
        <CourseBook />
      </div>
    </section>
  );
}
