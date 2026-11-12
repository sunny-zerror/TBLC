import { RiArrowLeftLine } from "@remixicon/react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MoreFromBlog from "@/components/blog/MoreFromBlog";
import PostContent from "@/components/blog/PostContent";
import PostGallery from "@/components/blog/PostGallery";
import ShareLinks from "@/components/blog/ShareLinks";
import JsonLd from "@/components/seo/JsonLd";
import {
  blogAuthor,
  blogHref,
  blogListingHref,
  categorySlugOf,
  getPost,
  getPosts,
  postImages,
  relatedPosts,
} from "@/data/blog";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { createMetadata } from "@/lib/seo";
import { formatDate } from "@/utils/format";

type Params = Promise<{ slug: string }>;

// Every post is prerendered; any other slug is a real 404
export const dynamicParams = false;
export const generateStaticParams = () => getPosts().map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return createMetadata({
    title: post.title,
    description: post.excerpt.slice(0, 160),
    path: blogHref(post.slug),
    image: post.cover?.src,
    imageAlt: post.title,
    type: "article",
  });
}

const label = "text-eyebrow text-muted";

export default async function PostPage({ params }: { params: Params }) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const category = post.categories[0];
  const images = postImages(post);

  return (
    <>
      <JsonLd
        data={[
          blogPostingSchema(post),
          breadcrumbSchema([
            { name: "Blog", path: "/blog" },
            { name: post.title, path: blogHref(post.slug) },
          ]),
        ]}
      />

      <section className="bg-stripes pt-8 pb-section">
        <div className="container">
          <Link href="/blog" className={`inline-flex items-center gap-2 ${label} link-line`}>
            <RiArrowLeftLine className="size-3.5" aria-hidden="true" />
            All posts
          </Link>
          <h1
            key={post.slug}
            data-heading-effect
            data-delay="0.1"
            className="mx-auto mt-6 max-w-5xl text-center text-title-xl"
          >
            {post.title}
          </h1>
          {images.length > 0 && (
            <div className="mt-stack">
              <PostGallery images={images} title={post.title} />
            </div>
          )}
        </div>
      </section>

      <article className="container grid gap-stack py-section md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] md:gap-x-16 xl:gap-x-24">
        <aside className="flex flex-col gap-8 md:sticky md:top-[calc(var(--spacing-header)+2rem)] md:self-start">
          <div>
            <p className={label}>
              <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingTime} min read
            </p>
            <p className="mt-2 text-lead text-flourish">by {blogAuthor}</p>
          </div>
          {category && (
            <div>
              <p className={label}>Category</p>
              <Link
                href={blogListingHref({ category: categorySlugOf(category) })}
                className="mt-2 inline-block link-line text-caption"
              >
                {category}
              </Link>
            </div>
          )}
          <div>
            <p className={`${label} mb-2`}>Share</p>
            <ShareLinks path={blogHref(post.slug)} title={post.title} image={post.cover?.src} />
          </div>
        </aside>

        <div className="max-w-3xl">
          <PostContent blocks={post.blocks} title={post.title} />
        </div>
      </article>

      <MoreFromBlog posts={relatedPosts(post)} />
    </>
  );
}
