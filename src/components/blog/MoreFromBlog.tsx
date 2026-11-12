"use client";

import "swiper/css";
import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PostCard from "@/components/blog/PostCard";
import CarouselControls from "@/components/ui/CarouselControls";
import type { BlogPostSummary } from "@/data/blog";
import { useLoopCarousel } from "@/hooks/useLoopCarousel";

/** "More from the blog": a looping row of post cards — 3½ across on desktop, the last cut by the edge */
export default function MoreFromBlog({ posts }: { posts: BlogPostSummary[] }) {
  const { slides, swiperProps, controls } = useLoopCarousel(posts);
  const { key, ...props } = swiperProps;

  return (
    <section aria-labelledby="more-posts" className="overflow-x-clip py-section">
      <h2 id="more-posts" data-heading-effect className="container text-center text-title-xl">
        More from the blog
      </h2>
      <div data-fade data-delay="0.2" className="container mt-stack">
        <Swiper
          key={key}
          {...props}
          modules={[A11y, Autoplay]}
          // Visible overflow lets the next card peek past the container edge
          className="overflow-visible!"
          slidesPerView={1.2}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 24 },
            1024: { slidesPerView: 3.4, spaceBetween: 32 },
          }}
          a11y={{ containerMessage: "More posts from the blog" }}
        >
          {slides.map((post, i) => (
            <SwiperSlide key={`${post.slug}-${i}`} className="h-auto!">
              <PostCard post={post} sizes="(min-width: 64rem) 26vw, (min-width: 40rem) 42vw, 80vw" />
            </SwiperSlide>
          ))}
        </Swiper>
        {posts.length > 1 && <CarouselControls {...controls} labels={posts.map((p) => p.title)} className="mt-12" />}
      </div>
    </section>
  );
}
