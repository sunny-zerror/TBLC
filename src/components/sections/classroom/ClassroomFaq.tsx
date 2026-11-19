import Image from "next/image";
import FaqList from "@/components/ui/FaqList";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { classroomFaqs } from "@/data/classroom";

/*
 * "Before you enrol": the title and an "ask the studio" card held in view on wide screens, while
 * the numbered questions scroll by on the right.
 */
export default function ClassroomFaq() {
  const { email, phone } = siteConfig.contact;
  const whatsapp = `https://wa.me/${phone.replace(/\D/g, "")}`;

  return (
    <section aria-labelledby="faq" className="bg-surface grain py-section">
      <div className="container grid gap-stack lg:grid-cols-12 lg:gap-x-grid">
        <div className="lg:sticky lg:top-[calc(var(--spacing-header)+2rem)] lg:col-span-4 lg:self-start">
          <h2 id="faq" data-heading-effect className=" text-display-sm">
            Before you <em className="block text-flourish text-accent">enrol</em>
          </h2>
          <p className="mt-6 max-w-xs text-body text-muted">What students usually ask before their first class.</p>

          <div data-fade className="mt-10 max-w-sm rounded-2xl bg-accent grain p-6 text-cream md:p-8">
            <div className="flex items-center gap-4">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-cream/40">
                <Image
                  src="/images/classroom/hero.jpg"
                  alt=""
                  fill
                  sizes="7rem"
                  className="origin-[52%_21%] translate-y-1/4 scale-200 object-cover"
                />
              </span>
              <div>
                <p className="text-title-sm text-flourish">Still wondering?</p>
                <p className="mt-1 text-caption text-cream/75">Ask the studio directly.</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ButtonLink href={whatsapp} target="_blank" rel="noopener noreferrer" variant="paper">
                <em className="text-flourish">Ask on</em> WHATSAPP
              </ButtonLink>
              <a href={`mailto:${email}`} className="link-line text-cta">
                Write an email
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <FaqList items={classroomFaqs} />
        </div>
      </div>
    </section>
  );
}
