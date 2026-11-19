"use client";

import { RiArrowRightLine } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { serviceHref, services } from "@/data/expertise";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const panel = "flex h-full shrink-0 flex-col border-r border-line px-8 lg:px-10";

/**
 * "Our services & expertise": a full-height strip of columns that sticks under the header while
 * vertical scroll slides it sideways. With reduced motion (or before JS) it's a plain
 * horizontally scrollable strip.
 */
export default function ServicesSlider() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const sticky = stickyRef.current;
      const track = trackRef.current;
      if (!section || !sticky || !track) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        sticky.dataset.pinned = "";
        const distance = () => Math.max(track.scrollWidth - sticky.clientWidth, 0);
        // The section is as tall as the sticky panel plus the sideways travel, so every pixel scrolled moves the strip
        const setHeight = () => {
          section.style.height = `${sticky.offsetHeight + distance()}px`;
        };
        setHeight();
        ScrollTrigger.addEventListener("refreshInit", setHeight);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: () => `top ${parseFloat(getComputedStyle(sticky).top) || 0}px`,
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", setHeight);
          section.style.height = "";
          delete sticky.dataset.pinned;
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-title"
      className="relative border-t border-line bg-paper"
    >
      <div
        ref={stickyRef}
        className="sticky top-header no-scrollbar h-[calc(100svh-var(--spacing-header))] overflow-x-auto data-pinned:overflow-hidden"
      >
        <div ref={trackRef} className="flex h-full w-max">
          <div className={`${panel} w-[80vw] items-center justify-center text-center md:w-[40vw] lg:w-[35vw]`}>
            <h2 id="services-title" data-heading-effect className="text-title-lg">
              Our services <br />& expertise
            </h2>
          </div>

          {services.map((service, i) => (
            <article key={service.title} className={`${panel} w-[85vw] justify-center gap-5 md:w-[50vw] lg:w-[40vw]`}>
              <div className="relative aspect-4/3 overflow-hidden rounded-sm bg-surface">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 50vw, 85vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-eyebrow text-muted">
                  {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                </p>
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 className="text-title-sm">{service.title}</h3>
                  <Link
                    href={serviceHref(service.slug)}
                    aria-label={`Learn more about ${service.title}`}
                    className="inline-flex shrink-0 items-center gap-1 link-line text-cta"
                  >
                    Learn more
                    <RiArrowRightLine aria-hidden="true" className="size-3.5" />
                  </Link>
                </div>
                <p className="text-caption text-muted">{service.tags.join(" · ")}</p>
              </div>
            </article>
          ))}

          <div className={`${panel} w-[80vw] items-center justify-center gap-6 text-center md:w-[40vw] lg:w-[35vw]`}>
            <p className="text-title text-flourish">
              Not sure where <br />
              your project fits?
            </p>
            <ButtonLink href="/contact" variant="outline" data-fade>
              Get in touch
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
