import { RiArrowRightLine } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import InkLine from "@/components/sections/expertise/InkLine";
import { ButtonLink } from "@/components/ui/Button";
import { processSteps } from "@/data/expertise";
import { cn } from "@/utils/cn";

const NUMERALS = ["I", "II", "III", "IV"];

/*
 * The illustrations are palette PNGs served as-is (`unoptimized`): AVIF's lossy alpha leaves a faint
 * tinted box around line drawings on paper.
 */

/** "The process": four illustrated steps, zig-zagging down the page along an ink line drawn from a dip pen */
export default function ExpertiseProcess() {
  return (
    <section aria-labelledby="process-title" className="relative overflow-hidden py-section">
      <InkLine />

      {/* Bleeds off the right edge; the ink line starts at its nib */}
      <div
        data-ink="nib"
        data-image-reveal
        className="absolute top-8 right-0 hidden aspect-1180/938 w-[42%] max-w-176 lg:block"
      >
        <Image src="/images/expertise/process/pen.png" alt="" fill unoptimized className="object-contain" />
      </div>

      <div className="relative container">
        <header className="max-w-4xl lg:mt-16">
          <p className="text-eyebrow text-muted">The process</p>
          <h2 id="process-title" className="mt-6 text-title-xl uppercase">
            <span data-heading-effect className="block">
              If you can dream it,
            </span>
            <em data-heading-effect data-delay="0.2" className="block text-flourish text-accent normal-case">
              we can create it.
            </em>
          </h2>
          <p className="mt-4 max-w-md text-body text-ink-soft">
            We bring together our design expertise, trusted vendors, and the finest materials &amp; techniques to
            deliver the absolute best with honesty, ease, and fluency.
          </p>
        </header>

        <ol className="mt-section flex flex-col gap-20 md:gap-28 lg:mt-48 lg:gap-36">
          {processSteps.map((step, i) => (
            <li
              key={step.word}
              data-ink="step"
              className={cn(
                "grid w-fit grid-cols-[auto_auto_auto] items-center gap-x-4 md:gap-x-8",
                i % 2 === 0 ? "md:ml-[5%]" : "md:ml-[30%]",
              )}
            >
              <h3 className="col-span-3 grid grid-cols-subgrid items-center text-title uppercase md:text-title-lg">
                <span>The</span>
                <span data-image-reveal className="block">
                  <Image
                    src={step.image.src}
                    alt=""
                    width={step.image.width}
                    height={step.image.height}
                    unoptimized
                    className="h-20 w-auto md:h-36 lg:h-48"
                  />
                </span>
                <span>{step.word}</span>
              </h3>

              <div className="col-span-3 mt-4 max-w-sm md:col-span-2 md:col-start-2">
                <p className="text-lead text-flourish text-accent-soft">{NUMERALS[i]}.</p>
                <p className="mt-3 text-body text-ink-soft">{step.text}</p>
                <Link href={step.link.href} className="mt-3 inline-flex items-center gap-1 link-line text-cta">
                  {step.link.label}
                  <RiArrowRightLine aria-hidden="true" className="size-3.5" />
                </Link>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-24 flex justify-center lg:mt-32">
          <ButtonLink href="/contact" variant="paper" size="lg" data-ink="end" data-fade>
            <em className="text-flourish">Begin your</em> COMMISSION
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
