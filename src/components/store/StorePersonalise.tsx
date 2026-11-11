import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

/** Where "Personalise a piece" leads — the personalised category in z-commerce */
const PERSONALISE_HREF = "/shop?category=personalised";

const photos = [
  {
    src: "/images/store/personalise-aurelia.jpg",
    alt: "The Aurelia Collection box",
    frame: "top-[5%] left-[4%] h-[73%] w-3/5 -rotate-4",
  },
  {
    src: "/images/store/personalise-nameplate.jpg",
    alt: "Calligraphy nameplate on walnut",
    frame: "top-[19%] left-[38%] h-[81%] w-3/5",
  },
  {
    src: "/images/store/personalise-mirrors.jpg",
    alt: "Personalised pocket mirrors",
    frame: "-top-[2%] left-[90%] hidden h-[73%] w-1/2 rotate-8 lg:block",
  },
];

/** "Made for you." — the personalisation pitch between the grid and the pagination */
export default function StorePersonalise() {
  return (
    <section aria-labelledby="made-for-you" className="flex flex-wrap items-center gap-12 py-section">
      <div className="relative z-10 max-w-xl flex-[1_1_22rem]">
        <h2 id="made-for-you" data-heading-effect className="text-title-xl">
          Made <em className="text-flourish text-accent">for you.</em>
        </h2>
        <p data-text-effect data-delay="0.2" className="mt-7 text-lead text-muted">
          Nameplates, stationery, vow booklets and keepsakes, personalised with your names or words. Choose a lettering
          style (Classic, Devnagari or Whimsical) and we letter it by hand.
        </p>
        <ButtonLink href={PERSONALISE_HREF} variant="paper" size="lg" data-fade data-delay="0.4" className="mt-12">
          <em className="text-flourish">Personalise a</em> PIECE
        </ButtonLink>
      </div>

      {/* The framed photos slide in from the right edge of the screen one after another (and back
          out if you scroll above them); each photo also drifts inside its frame */}
      <div data-slide-in className="relative h-96 min-w-72 flex-[1_1_32rem] md:h-160">
        {photos.map((photo) => (
          <div key={photo.src} className={cn("absolute bg-blush p-3 shadow-xl shadow-ink/12 md:p-4.5", photo.frame)}>
            <div className="relative size-full overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 64rem) 30vw, 60vw"
                data-parallax="0.1"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
