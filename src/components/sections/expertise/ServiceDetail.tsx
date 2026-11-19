import { RiArrowRightUpLine } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import ServiceTabs from "@/components/sections/expertise/ServiceTabs";
import { siteConfig } from "@/config/site";
import { type Service, serviceHref, services } from "@/data/expertise";

const bullet = "flex gap-2 before:content-['·']";

/**
 * A service page: the details stay pinned on the left (title, intro, tabs, previous / next) while
 * the work scrolls by on the right — the lead photo framed on an accent mat, a 2 × 2 grid, then a
 * full-width close.
 */
export default function ServiceDetail({ service }: { service: Service }) {
  const index = services.findIndex((s) => s.slug === service.slug);
  const previous = services[(index - 1 + services.length) % services.length];
  const next = services[(index + 1) % services.length];
  const [lead, ...rest] = service.gallery;
  const grid = rest.slice(0, 4);
  const close = rest[4];

  return (
    <div className="container grid-split pt-stack pb-section">
      <div className="flex flex-col md:sticky md:top-[calc(var(--spacing-header)+var(--spacing-stack))] md:self-start">
        <Link href="/expertise#services" className="w-fit link-line text-cta">
          Back to services
        </Link>
        <hr className="mt-4 border-line" />

        <h1 key={service.title} data-heading-effect className="mt-8 text-title-lg">
          {service.title}
        </h1>
        <p className="mt-4 max-w-md text-body text-ink-soft">{service.intro}</p>
        <ul className="mt-5 flex flex-col gap-1 text-body">
          {service.tags.map((tag) => (
            <li key={tag} className={bullet}>
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <ServiceTabs key={service.slug} service={service} />
        </div>

        <a
          href={siteConfig.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex w-fit items-center gap-1 link-line text-cta"
        >
          View on Instagram
          <RiArrowRightUpLine aria-hidden="true" className="size-3.5" />
        </a>

        <nav aria-label="More services" className="mt-8 flex justify-between border-t border-line pt-5">
          <Link
            href={serviceHref(previous.slug)}
            aria-label={`Previous: ${previous.title}`}
            className="link-line text-cta"
          >
            Previous
          </Link>
          <Link href={serviceHref(next.slug)} aria-label={`Next: ${next.title}`} className="link-line text-cta">
            Next
          </Link>
        </nav>
      </div>

      <div className="flex flex-col gap-grid">
        <div className="">
          <div data-image-reveal="zoom" className="relative aspect-3/2 overflow-hidden  bg-surface">
            <Image
              src={lead.src}
              alt={lead.alt}
              fill
              priority
              sizes="(min-width: 48rem) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div data-stagger className="grid grid-cols-2 gap-grid">
          {grid.map((image) => (
            <div key={image.src} className="relative aspect-square overflow-hidden  bg-surface">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 48rem) 30vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {close && (
          <div className="relative aspect-3/2 overflow-hidden  bg-surface">
            <Image
              src={close.src}
              alt={close.alt}
              fill
              sizes="(min-width: 48rem) 60vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
