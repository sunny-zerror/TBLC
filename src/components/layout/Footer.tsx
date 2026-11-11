import Image from "next/image";
import Link from "next/link";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const label = "font-secondary text-eyebrow text-cream/70";
const link = "link-line text-caption";

/*
 * 12-column grid on desktop: illustration (4) · newsletter (4) · one column per nav group (2 each).
 * Two columns on tablet, stacked on phones. A hairline separates the legal / social / contact bar.
 */
export default function Footer() {
  const socials = Object.entries(siteConfig.socials).filter(([, url]) => url);
  const { email, phone } = siteConfig.contact;

  return (
    <footer className="bg-accent grain text-cream">
      <div className="container pt-section pb-8">
        <div className="grid gap-x-grid gap-y-stack sm:grid-cols-2 lg:grid-cols-12">
          <div data-image-reveal className="self-start lg:col-span-4">
            <Image
              src="/images/illustrations/studio-desk.png"
              alt="Line drawing of the studio lettering desk"
              width={800}
              height={800}
              sizes="16rem"
              className="w-48 md:w-64"
            />
          </div>

          <div data-fade data-delay="0.15" className="flex max-w-sm flex-col gap-5 lg:col-span-4">
            <h2 className={label}>Newsletter</h2>
            <p className="font-primary text-body-lg">
              Letters from the studio: new collections, classes and events, a few times a year. No spam, promise.
            </p>
            {/* z-commerce subscribes shoppers through their account, so sign-up goes via /signup */}
            <Link
              href="/signup"
              className="mt-2 flex items-center justify-between gap-3 border-b border-cream pb-2.5 text-eyebrow transition-opacity hover:opacity-80"
            >
              Create an account
              <span className="text-lead text-flourish normal-case">Subscribe</span>
            </Link>
          </div>

          {footerNav.map((group, i) => (
            <nav
              key={group.title}
              aria-label={group.title}
              data-fade
              data-delay={0.25 + i * 0.1}
              className="flex flex-col gap-5 lg:col-span-2"
            >
              <h2 className={label}>{group.title}</h2>
              <ul className="flex flex-col gap-3">
                {group.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="relative mt-section grid gap-4 pt-6 md:grid-cols-3 md:items-center">
          <span aria-hidden="true" data-draw className="absolute inset-x-0 top-0 h-px bg-cream/25" />
          {/* The bar's content fades in while its rule draws */}
          <p data-fade="in" data-delay="0.4" className="text-cta">
            © {new Date().getFullYear()} {siteConfig.legalName}
          </p>
          {socials.length > 0 && (
            <ul data-fade="in" data-delay="0.5" className="flex gap-6 md:justify-self-center">
              {socials.map(([name, url]) => (
                <li key={name}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="link-line text-cta">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {(email || phone) && (
            <p
              data-fade="in"
              data-delay="0.6"
              className="flex flex-wrap gap-x-5 text-flourish md:col-start-3 md:justify-self-end"
            >
              {email && (
                <a href={`mailto:${email}`} className="link-line">
                  {email}
                </a>
              )}
              {phone && (
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="link-line">
                  {phone}
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
