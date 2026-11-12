import type { Metadata } from "next";
import Link from "next/link";
import BlogHeader from "@/components/blog/BlogHeader";
import FeaturedPost from "@/components/blog/FeaturedPost";
import PostList from "@/components/blog/PostList";
import StudioReel from "@/components/blog/StudioReel";
import { ButtonLink } from "@/components/ui/Button";
import { blogListingHref, categoryBySlug, findPosts } from "@/data/blog";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("/blog");

const PAGE_SIZE = 7;

type SearchParams = Promise<{ category?: string; q?: string; page?: string }>;

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = categoryBySlug(params.category)?.slug;
  const q = params.q?.trim() || undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const posts = findPosts({ category, q });
  // The newest post is featured on the unfiltered blog; filtering or searching lists everything that matches
  const featured = !category && !q ? posts[0] : undefined;
  const rest = featured ? posts.slice(1) : posts;
  const shown = rest.slice(0, page * PAGE_SIZE);

  return (
    <>
      <BlogHeader count={posts.length} category={category} q={q} />
      {featured && <FeaturedPost post={featured} />}

      <section aria-label="Posts" className="container py-section">
        {shown.length > 0 ? (
          <PostList posts={shown} />
        ) : (
          <div className="flex flex-col items-start gap-6 border-t border-line pt-stack">
            <p className="text-title">
              Nothing here <em className="text-flourish text-accent">yet.</em>
            </p>
            <p className="text-body text-muted">No posts match that search. Try another word, or browse them all.</p>
            <ButtonLink href="/blog" variant="paper" size="lg">
              <em className="text-flourish">All</em> POSTS
            </ButtonLink>
          </div>
        )}

        {shown.length < rest.length && (
          <div className="mt-stack text-center">
            {/* A link, not a button: more posts arrive as a server render, and each page has its own URL */}
            <ButtonLink
              href={blogListingHref({ category, q, page: page + 1 })}
              scroll={false}
              variant="paper"
              size="lg"
              className="px-14"
            >
              <em className="text-flourish">Load more</em> POSTS
            </ButtonLink>
          </div>
        )}
        {q && shown.length > 0 && (
          <p className="mt-8 text-center text-caption text-muted">
            Showing posts matching “{q}”.{" "}
            <Link href={blogListingHref({ category })} className="text-accent underline underline-offset-4">
              Clear search
            </Link>
          </p>
        )}
      </section>

      <StudioReel />
    </>
  );
}
