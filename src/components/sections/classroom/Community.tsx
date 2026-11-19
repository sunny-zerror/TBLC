"use client";

import "swiper/css";
import { RiPlayFill } from "@remixicon/react";
import Image from "next/image";
import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ButtonLink } from "@/components/ui/Button";
import CarouselControls from "@/components/ui/CarouselControls";
import { siteConfig } from "@/config/site";
import { classroomLinks, communityPosts } from "@/data/classroom";
import { useLoopCarousel } from "@/hooks/useLoopCarousel";

/** Matches useLoopCarousel's autoplay delay, so a card's story bar fills just as the reel moves on */
const AUTOPLAY_MS = 4500;

/** "Tips / The nib" → { kind: "Tips", title: "The nib" }; a label without a slash is all title */
function splitLabel(label: string) {
  const [kind, title] = label.split(" / ");
  return title ? { kind, title } : { kind: undefined, title: kind };
}

/*
 * A post dressed as an Instagram reel: a story bar and the studio's handle along the top, a play
 * button that opens out into "Watch" on hover, the title lettered at the foot. The centred card
 * stands forward — full size, deeper shadow, its story bar filling over the autoplay — while its
 * neighbours ease back.
 */
function ReelCard({ post, href }: { post: (typeof communityPosts)[number]; href: string }) {
  const { kind, title } = splitLabel(post.label);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${post.label}: watch on Instagram`}
      className="group relative block aspect-9/16 scale-92 overflow-hidden rounded-3xl bg-surface text-cream shadow-lg shadow-ink/10 transition-[scale,box-shadow] duration-700 ease-out-expo in-[.swiper-slide-active]:scale-100 in-[.swiper-slide-active]:shadow-2xl in-[.swiper-slide-active]:shadow-accent/30"
    >
      <Image
        src={post.image}
        alt={post.alt}
        fill
        sizes="(min-width: 64rem) 22vw, (min-width: 40rem) 40vw, 70vw"
        className="object-cover transition-[scale] duration-1000 ease-out-expo group-hover:scale-106"
      />
      {/* Shade top and bottom so the overlay reads on any photo */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-ink/55 via-transparent via-35% to-ink/75"
      />

      <div aria-hidden="true" className="absolute inset-x-0 top-0 p-4">
        <span className=" flex items-center gap-2.5">
          <span className="center size-8 shrink-0 rounded-full bg-cream p-1.5 ring-2 ring-cream/40">
            <Image src={siteConfig.logo} alt="" width={777} height={646} className="h-full w-auto" />
          </span>
          <span className="text-caption">bombaylettering</span>
        </span>
      </div>

      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-1/2 items-center gap-2 overflow-hidden rounded-full bg-cream pl-5 text-ink shadow-lg shadow-ink/20 transition-[width] duration-700 ease-out-expo group-hover:w-32"
      >
        <RiPlayFill className="size-4 shrink-0" />
        <span className="text-cta whitespace-nowrap opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          Watch
        </span>
      </span>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 p-5">
        {kind && <p className="text-eyebrow text-cream/75">{kind}</p>}
        <p className="mt-1.5 text-title-sm text-flourish">{title}</p>
      </div>
    </a>
  );
}

/** Centred, looping reel of community posts with arrows and dots, then the Instagram CTAs */
export default function Community() {
  const { slides, swiperProps, controls } = useLoopCarousel(communityPosts, { minSlides: 10 });
  const { key, ...props } = swiperProps;
  const instagram = siteConfig.socials.instagram;

  return (
    <section aria-labelledby="community" className="overflow-x-clip py-section">
      <header className="container text-center">
        <h2 id="community" data-heading-effect className="text-title-xl">
          Join the <em className="text-flourish text-accent">community</em>
        </h2>
        <p className="mx-auto mt-3 max-w-60 text-body text-muted">
          share your practice sheets with us, we may feature yours!
        </p>
      </header>

      <div data-fade data-delay="0.2" className="mt-section">
        <Swiper
          key={key}
          {...props}
          modules={[A11y, Autoplay]}
          centeredSlides
          // Adds swiper-slide-fully-visible, so the half-cut cards at the edges can fade
          watchSlidesProgress
          slidesPerView={1.4}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 2.4, spaceBetween: 24 },
            1024: { slidesPerView: 4.4, spaceBetween: 24 },
          }}
          a11y={{ containerMessage: "Posts from the community" }}
        >
          {slides.map((post, i) => (
            <SwiperSlide
              key={`${post.image}-${i}`}
              // swiper.css limits slide transitions to transform; ! brings the opacity fade back
              className="opacity-40 transition-opacity! duration-500! [&.swiper-slide-fully-visible]:opacity-100"
            >
              <ReelCard post={post} href={instagram || classroomLinks.shareWork} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div>
        <CarouselControls {...controls} labels={communityPosts.map((p) => p.label)} className="container mt-8" />
      </div>

      <div data-fade data-delay="0.4" className="container mt-8 flex flex-wrap justify-center gap-4">
        <ButtonLink href={classroomLinks.shareWork} variant="paper" size="lg" className="px-12">
          <em className="text-flourish">Share your</em> WORK
        </ButtonLink>
        {instagram && (
          <ButtonLink href={instagram} target="_blank" rel="noopener noreferrer" variant="accent" size="lg">
            <em className="text-flourish">Follow on</em> INSTAGRAM
          </ButtonLink>
        )}
      </div>
    </section>
  );
}
