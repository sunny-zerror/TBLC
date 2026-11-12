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
              <figure className="group flex flex-col items-center">
                <figcaption className="bg-blush px-2 text-flourish text-caption text-accent">{post.label}</figcaption>
                <div className="relative mt-6 aspect-3/5 w-full overflow-hidden rounded-2xl bg-surface">
                  <Image
                    src={post.image}
                    alt={post.alt}
                    fill
                    sizes="(min-width: 64rem) 22vw, (min-width: 40rem) 40vw, 70vw"
                    className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 left-1/2 center size-12 -translate-1/2 rounded-full bg-ink text-cream transition-transform duration-700 ease-out-expo group-hover:scale-115"
                  >
                    <RiPlayFill className="size-5" />
                  </span>
                </div>
              </figure>
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
