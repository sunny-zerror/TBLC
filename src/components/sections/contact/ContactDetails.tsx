import { RiFacebookFill, RiInstagramLine, RiPinterestLine, RiTwitterXLine, RiYoutubeLine } from "@remixicon/react";
import { siteConfig } from "@/config/site";
import { studioAddress } from "@/data/contact";
import { cn } from "@/utils/cn";

const socialIcons: Record<string, typeof RiInstagramLine> = {
  instagram: RiInstagramLine,
  pinterest: RiPinterestLine,
  facebook: RiFacebookFill,
  youtube: RiYoutubeLine,
  x: RiTwitterXLine,
};

/** Email, phone, studio address and round social links — whichever are filled in src/config/site.ts */
export default function ContactDetails({ className }: { className?: string }) {
  const { email, phone } = siteConfig.contact;
  const socials = Object.entries(siteConfig.socials).filter(([, url]) => url);
  const rows = [
    email && { label: "Email", value: email, href: `mailto:${email}` },
    phone && { label: "Phone", value: phone, href: `tel:${phone.replace(/\s+/g, "")}` },
    studioAddress && { label: "Studio", value: studioAddress },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <dl className={cn("flex flex-col gap-8", className)}>
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-2">
          <dt className="text-eyebrow text-muted">{row.label}</dt>
          <dd className="max-w-xs text-body-lg">
            {row.href ? (
              <a href={row.href} className="link-line">
                {row.value}
              </a>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
      {socials.length > 0 && (
        <div className="flex flex-col gap-3">
          <dt className="text-eyebrow text-muted">Connect</dt>
          <dd>
            <ul className="flex gap-3">
              {socials.map(([name, url]) => {
                const Icon = socialIcons[name];
                return (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${siteConfig.name} on ${name}`}
                      className="center size-11 rounded-full border border-line text-accent transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-cream"
                    >
                      {Icon ? <Icon className="size-4.5" aria-hidden="true" /> : name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </dd>
        </div>
      )}
    </dl>
  );
}
