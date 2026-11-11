import Image from "next/image";
import type { Product } from "@/types";
import { cn } from "@/utils/cn";
import { mediaUrl, productImages } from "@/utils/media";

/** z-commerce stores rich text in additionalInfo; keep its line breaks, drop the tags */
const plainText = (html: string) =>
  html
    .replace(/<br\s*\/?>|<\/(p|li|div)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();

/** "Made in layers, by hand." — a detail photo beside the product's spec list (additionalInfo) */
export default function ProductDetails({ product }: { product: Product }) {
  const info = product.additionalInfo ?? [];
  const detail = productImages(product.assets)[1];
  if (info.length === 0) return null;

  return (
    // Heading on row 1; the image and spec list share row 2, so they start on the same line.
    // The image is at least 4:3 and stretches to the list's height when the list is longer.
    <section
      aria-labelledby="made-by-hand"
      className="container grid gap-x-26 gap-y-14 md:grid-cols-[minmax(0,35rem)_minmax(0,1fr)]"
    >
      <h2 id="made-by-hand" data-heading-effect className="text-title-xl md:col-start-1">
        Made in layers,
        <br />
        <em className="text-flourish text-accent">by hand.</em>
      </h2>

      {detail && (
        <div
          data-image-reveal
          className="relative aspect-4/3 w-full overflow-hidden bg-surface md:col-start-1 md:row-start-2 md:self-stretch"
        >
          <Image
            src={mediaUrl(detail.path)}
            alt={detail.altText || `${product.name} — detail`}
            fill
            sizes="(min-width: 64rem) 40vw, 100vw"
            data-parallax
            className="object-cover"
          />
        </div>
      )}

      <dl data-stagger className="text-caption text-ink-soft md:col-start-2 md:row-start-2 md:self-start">
        {info.map((item, i) => (
          <div key={item.title} className={cn("flex flex-wrap gap-2 border-b border-line", i === 0 ? "pb-8" : "py-6")}>
            <dt className="shrink-0 basis-50 text-eyebrow text-ink">{item.title}</dt>
            <dd className="flex-1 whitespace-pre-line">{plainText(item.description)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
