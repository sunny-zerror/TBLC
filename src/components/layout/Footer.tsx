import Link from "next/link";
import { footerNav } from "@/config/navigation";
import SketchImage from "@/components/ui/SketchImage";
import { siteConfig } from "@/config/site";

const label = "font-secondary text-eyebrow text-cream/70";
const link = "link-line text-caption";

/** How each network in siteConfig.socials is written in the footer */
const socialNames: Record<string, string> = {
  instagram: "Instagram",
  pinterest: "Pinterest",
  facebook: "Facebook",
  youtube: "YouTube",
  x: "X",
};

/*
 * Desktop: illustration · newsletter · one column per nav group · Follow (the socials).
 * Two columns on tablet, stacked on phones. A hairline separates the legal / contact bar.
 */
export default function Footer() {
  const socials = Object.entries(siteConfig.socials).filter(([, url]) => url);
  const { email, phone } = siteConfig.contact;

  return (
    <footer className="bg-accent grain text-cream">
      <div className="container pt-section pb-8">
        <div className="grid gap-x-grid gap-y-stack sm:grid-cols-2 lg:grid-cols-[minmax(0,3fr)_minmax(0,4.5fr)_repeat(3,minmax(0,1.2fr))]">
          {/* Sketches itself in when the footer scrolls into view */}
          <SketchImage
            src="/images/illustrations/studio-desk.png"
            linesSrc="/images/illustrations/studio-desk-lines.json"
            alt="Line drawing of the studio lettering desk"
            width={800}
            height={800}
            sizes="16rem"
            className="w-48 self-start md:w-64"
          />

          <div className="flex max-w-sm flex-col gap-5">
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

          {footerNav.map((group) => (
            <nav
              key={group.title}
              aria-label={group.title}

              className="flex flex-col gap-5"
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

          {socials.length > 0 && (
            <nav
              aria-label="Follow us"

              className="flex flex-col gap-5"
            >
              <h2 className={label}>Follow</h2>
              <ul className="flex flex-col gap-3">
                {socials.map(([name, url]) => (
                  <li key={name}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className={link}>
                      {socialNames[name] ?? name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="relative mt-section flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
          <span aria-hidden="true" data-draw className="absolute inset-x-0 top-0 h-px bg-cream/25" />
          {/* The bar's content fades in while its rule draws */}
          <p className="text-cta">
            © {new Date().getFullYear()} {siteConfig.legalName}
          </p>
          {(email || phone) && (
            <p className="flex flex-wrap gap-x-5 text-flourish">
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
