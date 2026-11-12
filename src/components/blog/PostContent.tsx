import Image from "next/image";
import Link from "next/link";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import type { BlogBlock, BlogImage, InlineRun } from "@/data/blog";

const linkClass = "text-accent underline underline-offset-4 transition-colors hover:text-ink";
const isInternal = (href: string) => href.startsWith("/");

/** One run of text with its bold / italic / link */
function Run({ run }: { run: InlineRun }) {
  let node: React.ReactNode = run.text;
  if (run.italic) node = <em>{node}</em>;
  if (run.bold) node = <strong className="font-medium text-ink">{node}</strong>;
  if (run.href) {
    node = isInternal(run.href) ? (
      <Link href={run.href} className={linkClass}>
        {node}
      </Link>
    ) : (
      <a href={run.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {node}
      </a>
    );
  }
  return node;
}

const Runs = ({ runs }: { runs: InlineRun[] }) => runs.map((run, i) => <Run key={i} run={run} />);

function Figure({ image, alt }: { image: BlogImage; alt: string }) {
  return (
    <figure className="my-6">
      <Image
        src={image.src}
        alt={image.caption || alt}
        width={image.width}
        height={image.height}
        sizes="(min-width: 64rem) 48rem, 92vw"
        className="h-auto w-full rounded-sm bg-surface"
      />
      {image.caption && <figcaption className="mt-3 text-small text-muted">{image.caption}</figcaption>}
    </figure>
  );
}

/** A post's body: paragraphs, serif-italic subheads, lists, photos, galleries, video and call-to-action buttons */
export default function PostContent({ blocks, title }: { blocks: BlogBlock[]; title: string }) {
  let photo = 0;
  const alt = () => `From “${title}”, photo ${++photo}`;

  return (
    <div className="flex flex-col gap-5 text-body text-ink-soft">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={i} className="whitespace-pre-line">
                <Runs runs={block.content} />
              </p>
            );
          case "heading":
            return (
              <h2 key={i} className="mt-6 text-title-sm text-flourish text-accent first:mt-0">
                {block.text}
              </h2>
            );
          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List
                key={i}
                className={`flex flex-col gap-2 pl-5 marker:text-accent-soft ${block.ordered ? "list-decimal" : "list-disc"}`}
              >
                {block.items.map((item, j) => (
                  <li key={j} className="pl-1">
                    <Runs runs={item} />
                  </li>
                ))}
              </List>
            );
          }
          case "image":
            return <Figure key={i} image={block} alt={alt()} />;
          case "gallery":
            return (
              <ul key={i} className="my-6 grid grid-cols-2 gap-2 md:grid-cols-3">
                {block.images.map((image) => (
                  <li key={image.src} className="relative aspect-square overflow-hidden rounded-sm bg-surface">
                    <Image
                      src={image.src}
                      alt={image.caption || alt()}
                      fill
                      sizes="(min-width: 64rem) 16rem, 46vw"
                      className="object-cover"
                    />
                  </li>
                ))}
              </ul>
            );
          case "video":
            return (
              <video
                key={i}
                src={block.src}
                controls
                playsInline
                preload="metadata"
                className="my-6 w-full rounded-sm"
              />
            );
          case "button":
            return isInternal(block.href) ? (
              <ButtonLink
                key={i}
                href={block.href}
                variant="paper"
                size="lg"
                className="my-4 self-start whitespace-normal"
              >
                {block.label}
              </ButtonLink>
            ) : (
              <a
                key={i}
                href={block.href}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass({
                  variant: "paper",
                  size: "lg",
                  className: "my-4 self-start whitespace-normal",
                })}
              >
                {block.label}
              </a>
            );
        }
      })}
    </div>
  );
}
