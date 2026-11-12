import Link from "next/link";
import PostCover from "@/components/blog/PostCover";
import { type BlogPostSummary, blogHref } from "@/data/blog";
import { formatDate } from "@/utils/format";

/** A post as a card: cover, date and reading time, title, "Read" — the whole card is one link */
export default function PostCard({ post, sizes }: { post: BlogPostSummary; sizes: string }) {
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-4/3 overflow-hidden rounded-sm bg-surface">
        <PostCover
          cover={post.cover}
          title={post.title}
          sizes={sizes}
          className="transition-transform duration-700 ease-out-expo group-hover:scale-105"
        />
      </div>
      <p className="mt-4 flex gap-3 text-small text-muted">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">·</span>
        {post.readingTime} min read
      </p>
      <h3 className="mt-1.5 text-lead">
        {/* Stretched over the card, so the image and "Read" are part of the same link */}
        <Link href={blogHref(post.slug)} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      <span
        aria-hidden="true"
        className="mt-2 self-start text-eyebrow underline underline-offset-4 transition-colors group-hover:text-accent"
      >
        Read
      </span>
    </article>
  );
}
