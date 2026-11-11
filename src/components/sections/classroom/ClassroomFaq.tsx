import Accordion from "@/components/ui/Accordion";
import { siteConfig } from "@/config/site";
import { classroomFaqs } from "@/data/classroom";

const linkClass = "transition-colors hover:text-accent";

/** "Before you enrol" — title and contact on the left, the questions on the right */
export default function ClassroomFaq() {
  const { email, phone } = siteConfig.contact;
  const whatsapp = phone.replace(/\D/g, "");

  return (
    <section aria-labelledby="faq" className="bg-surface grain">
      <div className="container grid-split py-section">
        <div>
          <h2 id="faq" data-heading-effect className="text-display-sm">
            Before you <em className="block text-flourish text-accent">enrol</em>
          </h2>
          {/* Has links, so it fades as a block rather than splitting into lines */}
          <p data-fade data-delay="0.3" className="mt-6 max-w-xs text-caption text-muted">
            Anything else? <br /> Write to{" "}
            <a href={`mailto:${email}`} className={linkClass}>
              {email}
            </a>{" "}
            <br />
            or WhatsApp{" "}
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {phone}
            </a>
            .
          </p>
        </div>

        <div data-fade data-delay="0.2">
          <Accordion
            size="lg"
            defaultOpen={0}
            items={classroomFaqs.map((faq) => ({ title: faq.question, content: faq.answer }))}
          />
        </div>
      </div>
    </section>
  );
}
