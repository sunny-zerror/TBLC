import { COURSE_FACT_ICONS } from "@/components/sections/classroom/CourseFactIcons";
import { courseFacts } from "@/data/classroom";

/*
 * The course in numbers, on the grained candy-stripe band: four cream bookplates, each numbered,
 * with a big serif figure that counts up, its label in the italic and a short note under a rule.
 * They come in one after another; hovering lifts a card and plays its icon.
 */
export default function CourseFacts() {
  return (
    <section aria-label="The course in numbers" className="bg-stripes py-section">
      <div className="container">
        <ul data-stagger className="grid grid-cols-2 gap-grid lg:grid-cols-4">
          {courseFacts.map((fact, i) => {
            const Icon = COURSE_FACT_ICONS[i % COURSE_FACT_ICONS.length];
            return (
              <li
                key={fact.label}
                className="group flex flex-col rounded-2xl bg-cream grain p-5 shadow-lg shadow-accent/10 transition-[translate,box-shadow] duration-700 ease-out-expo hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/20 md:p-8"
              >
                <div className="flex items-center justify-between gap-4 text-accent">
                  <span className="text-eyebrow text-xl">{String(i + 1).padStart(2, "0")}</span>
                  <span className="center size-10 rounded-full border border-line transition-colors duration-700 ease-out-expo group-hover:bg-accent group-hover:text-cream">
                    <Icon />
                  </span>
                </div>
                <p data-counter className="mt-8 text-display-sm text-accent tabular-nums md:mt-12">
                  {fact.value}
                </p>
                <p className="mt-2 mb-6 text-lead text-flourish">{fact.label}</p>
                <p className="mt-auto border-t border-line pt-4 text-caption text-muted max-md:hidden">{fact.note}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
