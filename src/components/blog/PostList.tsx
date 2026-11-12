import Link from "next/link";
import PostCover from "@/components/blog/PostCover";
import { type BlogPostSummary, blogHref } from "@/data/blog";
import { formatDate } from "@/utils/format";

/** The posts as hairline-separated rows: date · cover · title, excerpt and "Read". Each row is one link. */
export default function PostList({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <ul className="border-t border-line">
      {posts.map((post) => (
        <li
          key={post.slug}

          className="group relative grid gap-x-12 gap-y-4 border-b border-line py-8 md:grid-cols-[9rem_minmax(0,15rem)_minmax(0,1fr)] md:py-10"
        >
          <p className="flex gap-3 text-small text-muted md:flex-col md:gap-0.5">
            <time dateTime={post.date} className="text-caption text-ink">
              {formatDate(post.date)}
            </time>
            <span>{post.readingTime} min read</span>
          </p>
          <div className="relative aspect-3/2 overflow-hidden rounded-sm bg-surface">
            <PostCover
              cover={post.cover}
              title={post.title}
              sizes="(min-width: 48rem) 15rem, 100vw"
              className="transition-transform duration-700 ease-out-expo group-hover:scale-105"
            />
          </div>
          <div>
            <h2 className="text-title-sm">
              {/* Stretched over the row, so the date and image are part of the same link */}
              <Link
                href={blogHref(post.slug)}
                className="transition-colors group-hover:text-accent after:absolute after:inset-0"
              >
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 line-clamp-2 max-w-2xl text-caption text-muted">{post.excerpt}</p>
            <span aria-hidden="true" className="mt-3 inline-block text-eyebrow underline underline-offset-4">
              Read
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
