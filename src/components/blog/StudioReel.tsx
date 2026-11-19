import StudioMarquee from "@/components/blog/StudioMarquee";
import { ButtonLink } from "@/components/ui/Button";
import { studioWork } from "@/data/studio";

/*
 * "Meanwhile, in the studio": a heading over the candy stripes, then an endless, draggable strip of
 * recent pieces pinned up like taped prints, and the way on to the studio's expertise.
 */
export default function StudioReel() {
  return (
    <section aria-labelledby="studio-reel" className="overflow-x-clip bg-stripes py-section">
      <div className="container flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="studio-reel" data-heading-effect className=" text-title-xl">
            Meanwhile, <em className="text-flourish text-accent">in the studio</em>
          </h2>
        </div>
        <p className="max-w-xs text-body text-muted">
          Suites, keepsakes and identities lettered by hand this season. Drag the wall to browse.
        </p>
      </div>

      <div data-fade data-delay="0.15" className="mt-10">
        <StudioMarquee pieces={studioWork} />
      </div>

      <div className="mt-10 text-center">
        <ButtonLink href="/expertise" variant="paper" size="lg" data-fade>
          <em className="text-flourish">Explore our</em> EXPERTISE
        </ButtonLink>
      </div>
    </section>
  );
}
