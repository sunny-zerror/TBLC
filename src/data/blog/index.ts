/*
 * The journal, migrated from the old Wix blog (bombaylettering.com/post/…).
 * posts.json holds every post's content as typed blocks; images live in public/images/blog/<slug>/.
 * Import from server components only — the full content stays out of the client bundle.
 */
import rawPosts from "./posts.json";

export const blogAuthor = "Sanjana Chatlani";

export const blogCategories = [
  { slug: "tutorials", name: "Tutorials" },
  { slug: "business", name: "Business" },
  { slug: "personal", name: "Personal" },
  { slug: "tools-and-supplies", name: "Tools & supplies" },
] as const;

export type BlogCategory = (typeof blogCategories)[number]["name"];

/** A run of text inside a paragraph or list item */
export interface InlineRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  href?: string;
}

export interface BlogImage {
  src: string;
  width: number;
  height: number;
  caption?: string;
}

export type BlogBlock =
  | { type: "paragraph"; content: InlineRun[] }
  | { type: "heading"; text: string }
  | { type: "list"; ordered: boolean; items: InlineRun[][] }
  | ({ type: "image" } & BlogImage)
  | { type: "gallery"; images: BlogImage[] }
  | { type: "video"; src: string }
  | { type: "button"; label: string; href: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO publish date */
  date: string;
  /** Minutes */
  readingTime: number;
  /** The first is the post's main category */
  categories: BlogCategory[];
  cover: BlogImage | null;
  blocks: BlogBlock[];
}

/** A post without its content — what listings and cards need */
export type BlogPostSummary = Omit<BlogPost, "blocks">;

// Newest first (the scraper sorts them)
const posts = rawPosts as unknown as BlogPost[];

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- blocks is dropped on purpose
const summarise = ({ blocks, ...post }: BlogPost): BlogPostSummary => post;

export const getPosts = (): BlogPostSummary[] => posts.map(summarise);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const blogHref = (slug: string) => `/blog/${slug}`;

/** /blog with its filters: ?category=business&q=pricing&page=2 */
export function blogListingHref({ category, q, page }: { category?: string; q?: string; page?: number }) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export const categoryBySlug = (slug?: string) => blogCategories.find((c) => c.slug === slug);
export const categorySlugOf = (name: BlogCategory) => blogCategories.find((c) => c.name === name)?.slug;

/** Posts in a category and/or matching a search across titles, excerpts and headings */
export function findPosts({ category, q }: { category?: string; q?: string }): BlogPostSummary[] {
  const name = categoryBySlug(category)?.name;
  const terms = q?.toLowerCase().split(/\s+/).filter(Boolean) ?? [];
  return posts
    .filter((p) => !name || p.categories.includes(name))
    .filter((p) => {
      if (!terms.length) return true;
      const haystack = [
        p.title,
        p.excerpt,
        ...p.categories,
        ...p.blocks.flatMap((b) => (b.type === "heading" ? [b.text] : [])),
      ]
        .join(" ")
        .toLowerCase();
      return terms.every((t) => haystack.includes(t));
    })
    .map(summarise);
}

/** Every picture in a post, cover first and each once — the post's hero gallery */
export function postImages(post: BlogPost): BlogImage[] {
  const all = [
    ...(post.cover ? [post.cover] : []),
    ...post.blocks.flatMap((b) => (b.type === "image" ? [b] : b.type === "gallery" ? b.images : [])),
  ];
  return all.filter((image, i) => all.findIndex((other) => other.src === image.src) === i);
}

/** Other posts for "More from the blog": same category first, then the newest */
export function relatedPosts(post: BlogPost, count = 8): BlogPostSummary[] {
  const others = posts.filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.categories[0] === post.categories[0]);
  const rest = others.filter((p) => p.categories[0] !== post.categories[0]);
  return [...same, ...rest].slice(0, count).map(summarise);
}
