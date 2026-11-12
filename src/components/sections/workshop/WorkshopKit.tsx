import Image from "next/image";
import type { WorkshopKit as Kit } from "@/data/classroom";

/** "In your kit": a mounted photo with numbered markers, beside the matching numbered list */
export default function WorkshopKit({ kit }: { kit: Kit }) {
  return (
    <section
      aria-labelledby="kit"
      className="container grid items-center gap-stack py-section md:grid-cols-2 md:gap-x-24"
    >
      {/* A print on a cream mount, like a photo pinned to the studio wall */}
      <div data-fade className="bg-cream p-2.5 shadow-xl shadow-ink/10 md:p-4">
        <div className="relative aspect-3/2 overflow-hidden">
          <Image src={kit.image} alt={kit.alt} fill sizes="(min-width: 48rem) 45vw, 100vw" className="object-cover" />
          <ol aria-hidden="true" className="absolute inset-0">
            {kit.items.map((item, i) => (
              <li
                key={item.name}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                className="absolute center size-7 -translate-1/2 rounded-full border border-ink/20 bg-cream text-small text-ink shadow-sm"
              >
                {i + 1}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div>
        <h2 id="kit" data-heading-effect className="text-title-xl">
          In your <em className="text-flourish text-accent">kit</em>
        </h2>
        <p className="mt-4 max-w-sm text-lead text-flourish">
          Everything waits for you at your desk, and it all goes home with you.
        </p>
        <ol className="mt-stack border-t border-line">
          {kit.items.map((item, i) => (
            <li
              key={item.name}
              className="grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-x-2 gap-y-1 border-b border-line py-5 sm:grid-cols-[2rem_minmax(0,1fr)_minmax(0,12rem)]"
            >
              <span className="text-lead tabular-nums">{i + 1}</span>
              <span className="text-lead">{item.name}</span>
              <span className="col-start-2 text-small text-muted sm:col-start-3">{item.note}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
