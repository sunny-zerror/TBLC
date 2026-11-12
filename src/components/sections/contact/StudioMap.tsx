import { siteConfig } from "@/config/site";
import { locationUrl, studioAddress } from "@/data/contact";

const { lat, lng } = siteConfig.address.geo;
// A few streets either side of the studio, which sits at the centre of the embed
const bbox = [lng - 0.014, lat - 0.006, lng + 0.014, lat + 0.006].join(",");
const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;

/** "Visit the studio": the address above an OpenStreetMap tinted to the paper, with our own checkpoint pin */
export default function StudioMap() {
  return (
    <section aria-labelledby="visit-studio" className="container">
      <span aria-hidden="true" data-draw className="block h-px bg-line" />

      <header className="flex flex-col gap-3 pt-stack md:flex-row md:items-baseline md:gap-8">
        <h2 id="visit-studio" data-heading-effect className="text-title-sm text-flourish text-accent md:mr-auto">
          Visit the studio
        </h2>
        <p className="text-body text-muted">{studioAddress}</p>
      </header>

      <div data-image-reveal className="relative mt-8 aspect-4/3 overflow-hidden bg-surface md:aspect-12/5">
        {/* Inert, so the page scroll isn't captured; the pin is the way in */}
        <iframe
          src={mapSrc}
          title={`Map of ${siteConfig.name}, ${studioAddress}`}
          loading="lazy"
          tabIndex={-1}
          className="pointer-events-none absolute inset-0 size-full border-0 opacity-70 mix-blend-multiply grayscale"
        />

        {/* The checkpoint: rings ripple out of the dot; hovering grows the pin from the dot and it opens the studio on Google Maps */}
        <a
          href={locationUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${siteConfig.name} on Google Maps (opens in a new tab)`}
          className="group absolute top-1/2 left-1/2 flex origin-[0.5rem_50%] -translate-x-2 -translate-y-1/2 items-center gap-4 transition-transform duration-500 ease-out-expo hover:scale-110 focus-visible:scale-110"
        >
          <span aria-hidden="true" className="relative size-4 shrink-0">
            <span className="absolute inset-0 animate-checkpoint rounded-full bg-accent" />
            <span className="absolute inset-0 animate-checkpoint rounded-full bg-accent [animation-delay:1.2s]" />
            <span className="absolute inset-0 rounded-full bg-accent ring-4 ring-cream transition-colors duration-500 group-hover:bg-ink" />
          </span>
          <span className="flex flex-col gap-0.5 bg-cream px-3 py-2 shadow-sm">
            <span className="text-eyebrow text-ink">{siteConfig.name}</span>
            <span className="text-caption text-muted">Doli Chambers, Colaba</span>
          </span>
        </a>
      </div>
    </section>
  );
}
