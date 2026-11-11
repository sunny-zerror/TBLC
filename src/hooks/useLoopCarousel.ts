"use client";

import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import type { SwiperProps } from "swiper/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Shared wiring for a looping, autoplaying Swiper with <CarouselDots />.
 *
 * - Swiper's loop needs roughly twice the visible slides, so short lists are repeated
 *   (`slides`); the dots still track the real items (`realIndex % items.length`).
 * - Swiper only reads `autoplay` at init, so `swiperProps.key` remounts it once the
 *   client knows whether motion is allowed.
 * - Pauses on hover; the active dot's fill follows the countdown.
 */
export function useLoopCarousel<T>(items: T[], { delay = 4500, minSlides = 8 } = {}) {
  const swiperRef = useRef<SwiperType | null>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  const count = items.length;
  const loop = count > 1;
  const autoplay = loop && !reduceMotion;
  const copies = loop ? Math.ceil(minSlides / count) : 1;
  const slides = Array.from({ length: copies }, () => items).flat();

  const swiperProps = {
    key: autoplay ? "autoplay" : "static",
    loop,
    speed: 800,
    autoplay: autoplay ? { delay, pauseOnMouseEnter: true, disableOnInteraction: false } : false,
    onSwiper: (swiper: SwiperType) => {
      swiperRef.current = swiper;
    },
    onRealIndexChange: (swiper: SwiperType) => setActive(swiper.realIndex % count),
    onAutoplayTimeLeft: (_: SwiperType, __: number, percentage: number) => {
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${1 - percentage})`;
    },
  } satisfies SwiperProps & { key: string };

  /** Spread onto <CarouselControls /> (or <CarouselDots />, which ignores onPrev/onNext) */
  const controls = {
    active,
    autoplay,
    fillRef,
    onSelect: (i: number) => swiperRef.current?.slideToLoop(i),
    onPrev: () => swiperRef.current?.slidePrev(),
    onNext: () => swiperRef.current?.slideNext(),
  };

  return { slides, swiperProps, controls };
}
