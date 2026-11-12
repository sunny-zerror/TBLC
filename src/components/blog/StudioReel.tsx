import StudioMarquee from "@/components/blog/StudioMarquee";
import { ButtonLink } from "@/components/ui/Button";
import { studioWork } from "@/data/studio";

/** "Meanwhile, in the studio": an endless, draggable strip of recent pieces on the candy stripes */
export default function StudioReel() {
  return (
    <section aria-labelledby="studio-reel" className="overflow-x-clip bg-stripes py-section">
      <h2 id="studio-reel" className="text-center text-eyebrow text-muted">
        Meanwhile, in the studio
      </h2>

      <div data-fade data-delay="0.15" className="mt-stack">
        <StudioMarquee pieces={studioWork} />
      </div>

      <div className="mt-stack text-center">
        <ButtonLink href="/expertise" variant="paper" size="lg" data-fade>
          <em className="text-flourish">Explore our</em> EXPERTISE
        </ButtonLink>
      </div>
    </section>
  );
}
