import Image from "next/image";
import PrivateClassComposer from "@/components/sections/classroom/PrivateClassComposer";

/*
 * Private classes: a one-to-one lesson in a tall frame, "1:1" lettered across it, held in view on
 * wide screens while the pitch and the class composer scroll beside it.
 */
export default function PrivateClasses() {
  return (
    <section
      id="private-classes"
      aria-labelledby="private-classes-title"
      className="scroll-mt-header bg-surface grain py-section"
    >
      <div className="container grid gap-stack lg:grid-cols-12 lg:gap-x-grid">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--spacing-header)+2rem)]">
            <div data-image-reveal className="relative aspect-4/5 overflow-hidden rounded-2xl bg-blush">
              <Image
                src="/images/classroom/private_class.jpg"
                alt="A student watching closely as the teacher letters with an oblique pen"
                fill
                sizes="(min-width: 64rem) 40vw, 100vw"
                className="object-cover object-[40%_45%]"
              />
              {/* Shade under the lettering so it reads over the photo */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-ink/60 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-cream md:p-8">
                <p aria-hidden="true" className="text-display text-flourish">
                  1:1
                </p>
                <p className="pb-3 text-right text-eyebrow">
                  One teacher <br /> One student
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 id="private-classes-title" data-heading-effect className=" text-title-xl">
            Private <em className="text-flourish text-accent">classes</em>
          </h2>
          <p className="mt-5 max-w-md text-body-lg text-muted">
            Choose your script, your pace and your hours: in the studio in Colaba, or online.
          </p>

          <div data-fade data-delay="0.2" className="mt-10">
            <PrivateClassComposer />
          </div>
        </div>
      </div>
    </section>
  );
}
