import Accordion from "@/components/ui/Accordion";
import { siteConfig } from "@/config/site";
import { expertiseFaqs } from "@/data/expertise";

const linkClass = "transition-colors hover:text-accent";

/** "Questions, answered." on candy-striped paper — title and contact on the left, the questions on the right */
export default function ExpertiseFaq() {
  const { email, phone } = siteConfig.contact;

  return (
    <section aria-labelledby="expertise-faq" className="bg-paper bg-stripes">
      <div className="container grid-split py-section">
        <div>
          <h2 id="expertise-faq" data-heading-effect className="text-display-sm">
            Questions, <em className="block text-flourish">answered.</em>
          </h2>
          {/* Has links, so it stays still rather than splitting into lines */}
          <p className="mt-6 max-w-xs text-caption text-muted">
            Anything else? Write to{" "}
            <a href={`mailto:${email}`} className={linkClass}>
              {email}
            </a>{" "}
            or call{" "}
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className={`${linkClass} whitespace-nowrap`}>
              {phone}
            </a>
            .
          </p>
        </div>

        <div>
          <Accordion
            size="lg"
            defaultOpen={0}
            items={expertiseFaqs.map((faq) => ({ title: faq.question, content: faq.answer }))}
          />
        </div>
      </div>
    </section>
  );
}
