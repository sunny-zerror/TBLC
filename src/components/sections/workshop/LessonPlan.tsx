import type { LessonPlan as Plan } from "@/data/classroom";

const cell = "border border-line p-4 align-top";

/** "The lesson plan": a timetable with one column per day, breaks spanning them all */
export default function LessonPlan({ plan }: { plan: Plan }) {
  return (
    <section aria-labelledby="lesson-plan" className="bg-surface grain py-section">
      <div className="container">
        <h2 id="lesson-plan" data-heading-effect className="text-center text-title-xl">
          The lesson <em className="text-flourish text-accent">plan</em>
        </h2>

        {/* Scrolls sideways on phones rather than squeezing the lessons into slivers */}
        <div data-fade data-delay="0.2" className="mt-stack no-scrollbar overflow-x-auto">
          <table className="w-full min-w-160 border-collapse text-left">
            <thead>
              <tr>
                <th scope="col" className={`${cell} w-28 text-center align-middle text-eyebrow text-muted`}>
                  Time
                </th>
                {plan.days.map((day) => (
                  <th key={day.label} scope="col" className={`${cell} font-normal`}>
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="text-title-sm text-flourish text-accent">{day.label}</span>
                      <span className="text-eyebrow text-muted">{day.weekday}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plan.slots.map((slot) => (
                <tr key={slot.time}>
                  <th scope="row" className={`${cell} text-center text-lead font-normal`}>
                    {slot.time}
                  </th>
                  {slot.break ? (
                    <td
                      colSpan={plan.days.length}
                      className={`${cell} align-middle text-flourish text-body text-muted`}
                    >
                      {slot.break}
                    </td>
                  ) : (
                    plan.days.map((day, i) => {
                      const lesson = slot.lessons?.[i];
                      return (
                        <td key={day.label} className={cell}>
                          {lesson && (
                            <>
                              <p className="text-caption font-medium">{lesson.title}</p>
                              <p className="mt-1 text-small text-muted">{lesson.text}</p>
                            </>
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-flourish text-caption text-muted">
          Timings are indicative and confirmed with your booking.
        </p>
      </div>
    </section>
  );
}
