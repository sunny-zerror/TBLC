import { courseFacts } from "@/data/classroom";

/** "9 modules · 6+ hours…" on the grained candy-stripe band under the course */
export default function CourseFacts() {
  return (
    <section aria-label="The course in numbers" className="bg-stripes">
      <dl className="container grid grid-cols-2 gap-y-stack py-section text-center md:grid-cols-4">
        {courseFacts.map((fact) => (
          <div key={fact.label} className="flex flex-col-reverse gap-3">
            <dt className="font-primary text-body-lg text-muted">{fact.label}</dt>
            <dd data-counter className="text-stat text-accent tabular-nums">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
