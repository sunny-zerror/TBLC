import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

// Drop a hero film at public/videos/hero.mp4 (and a poster in public/images/home/) to use it
const HERO_VIDEO: string | null = null; // e.g. "/videos/hero.mp4"

export default function HomeHero() {
  return (
    <section className="relative flex min-h-[calc(100svh-var(--spacing-header))] items-end overflow-hidden bg-surface grain">
      {HERO_VIDEO && (
        <video
          className="absolute inset-0 cover"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      )}
      <div className="relative container pb-section">
        <p className="mb-4 text-eyebrow text-muted">New season</p>
        <h1 data-heading-effect data-delay="0.15" className="max-w-4xl">
          {siteConfig.tagline}
        </h1>
        <div data-fade data-delay="0.6" className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/shop" size="lg">
            Shop the collection
          </ButtonLink>
          <ButtonLink href="/about" size="lg" variant="outline">
            Our story
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
