import Link from "next/link";
import PostCover from "@/components/blog/PostCover";
import { type BlogPostSummary, blogHref } from "@/data/blog";
import { formatDate } from "@/utils/format";

/** The newest post as a band: details on grained accent beside its cover, full bleed */
export default function FeaturedPost({ post }: { post: BlogPostSummary }) {
  return (
    <section aria-labelledby="featured-post" className="grid bg-accent grain text-cream md:grid-cols-2">
      <div className="flex flex-col justify-center px-gutter py-section md:pr-16 lg:pl-[max(var(--spacing-gutter),5vw)]">
        <h2 id="featured-post" data-heading-effect className="text-title-lg">
          Featured post
        </h2>
        <div className="mt-stack max-w-md">
          <p className="flex flex-wrap gap-x-3 text-eyebrow text-cream/70">
            <span>{post.categories[0]}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
          </p>
          <h3 className="mt-3 text-title-sm text-flourish">{post.title}</h3>
          <p className="mt-4 line-clamp-4 text-caption text-cream/80">{post.excerpt}</p>
          <Link
            href={blogHref(post.slug)}
            className="mt-8 inline-block rounded-full border border-cream px-5 py-2 text-eyebrow transition-colors duration-300 hover:bg-cream hover:text-accent"
          >
            Keep reading
            <span className="sr-only">: {post.title}</span>
          </Link>
        </div>
      </div>

      <div data-image-reveal className="relative aspect-4/3 overflow-hidden md:aspect-auto md:min-h-136">
        <PostCover cover={post.cover} title={post.title} sizes="(min-width: 48rem) 50vw, 100vw" />
      </div>
    </section>
  );
}
