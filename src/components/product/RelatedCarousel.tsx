"use client";

import "swiper/css";
import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard, { productTileClass } from "@/components/product/ProductCard";
import CarouselControls from "@/components/ui/CarouselControls";
import { useLoopCarousel } from "@/hooks/useLoopCarousel";
import type { ProductSummary } from "@/types";
import { cn } from "@/utils/cn";

/** Looping, autoplaying product row — 3 cards on desktop. Pauses on hover. */
export default function RelatedCarousel({ products, label }: { products: ProductSummary[]; label: string }) {
  const { slides, swiperProps, controls } = useLoopCarousel(products);
  const { key, ...props } = swiperProps;

  return (
    <div>
      <Swiper
        key={key}
        {...props}
        modules={[A11y, Autoplay]}
        slidesPerView={1.2}
        spaceBetween={16}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 32 },
        }}
        a11y={{ containerMessage: label }}
      >
        {slides.map((product, i) => (
          // swiper.css (unlayered) sets height: 100% and transition-property: transform on slides;
          // the ! overrides let tiles stretch to the tallest one and keep the bg fade
          <SwiperSlide
            key={`${product._id}-${i}`}
            className={cn(productTileClass, "h-auto! transition-colors! duration-500! ease-out!")}
          >
            <ProductCard product={product} sizes="(min-width: 64rem) 26vw, (min-width: 40rem) 45vw, 85vw" />
          </SwiperSlide>
        ))}
      </Swiper>

      {products.length > 1 && <CarouselControls {...controls} labels={products.map((p) => p.name)} className="mt-12" />}
    </div>
  );
}
