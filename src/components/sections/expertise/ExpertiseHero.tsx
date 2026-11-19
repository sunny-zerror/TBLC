import Image from "next/image";
import FloatingGallery from "@/components/sections/expertise/FloatingGallery";
import { expertiseGallery, expertiseServices } from "@/data/expertise";

/** The studio's wax seal and title on blush paper, with studio photos drifting toward the viewer behind them */
export default function ExpertiseHero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-var(--spacing-header))] items-center justify-center overflow-hidden bg-surface grain px-gutter py-section">
      <FloatingGallery images={expertiseGallery} />

      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <div
          data-image-reveal="zoom"
          className="relative aspect-square w-56 drop-shadow-[0_1.5rem_2rem_color-mix(in_srgb,var(--color-accent)_30%,transparent)] md:w-72 lg:w-80"
        >
          <Image
            src="/images/expertise/hero/seal.png"
            alt="A pewter wax seal pressed with the studio's Copperplate B"
            fill
            priority
            sizes="(min-width: 64rem) 20rem, (min-width: 48rem) 18rem, 14rem"
            className="object-contain"
          />
        </div>

        <h1 data-heading-effect className="-mt-2 text-display md:-mt-4">
          Our expertise
        </h1>

        <p className="mt-6 max-w-lg text-body-lg text-ink-soft">{expertiseServices.join(" · ")}.</p>
      </div>
    </section>
  );
}
