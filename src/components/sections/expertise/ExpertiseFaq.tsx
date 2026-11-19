import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import FaqList from "@/components/ui/FaqList";
import { siteConfig } from "@/config/site";
import { expertiseFaqs } from "@/data/expertise";

/*
 * "Questions, answered." on candy-striped paper: the title and a "talk to the studio" card held in
 * view on wide screens, while the numbered questions scroll by on the right.
 */
export default function ExpertiseFaq() {
  const { email, phone } = siteConfig.contact;
  const whatsapp = `https://wa.me/${phone.replace(/\D/g, "")}`;

  return (
    <section aria-labelledby="expertise-faq" className="bg-paper bg-stripes py-section">
      <div className="container grid gap-stack lg:grid-cols-12 lg:gap-x-grid">
        <div className="lg:sticky lg:top-[calc(var(--spacing-header)+2rem)] lg:col-span-4 lg:self-start">
          <h2 id="expertise-faq" data-heading-effect className="text-display-sm">
            Questions, <em className="block text-flourish text-accent">answered.</em>
          </h2>
          <p className="mt-6 max-w-xs text-body text-muted">What clients usually ask before a commission.</p>

          <div data-fade className="mt-10 max-w-sm rounded-2xl bg-accent grain p-6 text-cream md:p-8">
            <div className="flex items-center gap-4">
              <span className="center size-14 shrink-0 rounded-full bg-cream p-1 ring-2 ring-cream/40">
                <Image src="/images/expertise/hero/seal.png" alt="" width={112} height={112} className="size-full" />
              </span>
              <div>
                <p className="text-title-sm text-flourish">Planning something?</p>
                <p className="mt-1 text-caption text-cream/75">Talk to the studio directly.</p>
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
          <FaqList items={expertiseFaqs} />
        </div>
      </div>
    </section>
  );
}
