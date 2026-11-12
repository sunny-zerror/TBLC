import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { classroomLinks, privateClassSubjects } from "@/data/classroom";

/** Full-bleed nib photo beside the private-class pitch and the scripts on offer */
export default function PrivateClasses() {
  return (
    <section aria-labelledby="private-classes" className="grid bg-surface grain md:grid-cols-2">
      <div data-image-reveal className="relative aspect-4/3 overflow-hidden md:aspect-auto md:min-h-168">
        <Image
          src="/images/classroom/private_class_img.jpg"
          alt="A hand guiding an oblique pen holder and nib"
          fill
          sizes="(min-width: 48rem) 50vw, 100vw"
          data-parallax
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-center px-gutter py-section md:pl-16 xl:pl-24">
        <h2 id="private-classes" data-heading-effect className="text-title-xl">
          Private <em className="text-flourish text-accent">classes</em>
        </h2>
        <p className="mt-3 max-w-lg text-body text-muted">
          Choose your script, your pace and your hours: in the studio in Colaba, or online.
        </p>
        <ul className="mt-6 max-w-xl">
          {privateClassSubjects.map((subject) => (
            <li key={subject} className="border-b border-accent-soft py-5 text-cta">
              {subject}
            </li>
          ))}
        </ul>
        <ButtonLink
          href={classroomLinks.privateClasses}
          variant="paper"
          size="lg"
          data-fade
          data-delay="0.4"
          className="mt-8 self-start px-14"
        >
          <em className="text-flourish">Ask about</em> PRIVATE CLASSES
        </ButtonLink>
      </div>
    </section>
  );
}
