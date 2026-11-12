/*
 * schema.org structured data (JSON-LD) for rich results. Render with <JsonLd />.
 */
import { siteConfig } from "@/config/site";
import { blogAuthor, blogHref, type BlogPostSummary } from "@/data/blog";
import { bookingHref, type Workshop, workshopHref } from "@/data/classroom";
import type { Crumb, Product, ProductSummary } from "@/types";
import { mediaUrl, productImages } from "@/utils/media";
import { displayPrice, isSoldOut } from "@/utils/product";
import { absoluteUrl, productHref } from "@/utils/url";

const ORG_ID = absoluteUrl("/#organization");
const SITE_ID = absoluteUrl("/#website");

export const organizationSchema = () => {
  const sameAs = Object.values(siteConfig.socials).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": ORG_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    logo: absoluteUrl(siteConfig.logo),
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
    ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
    ...(siteConfig.address.city
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.address.street,
            addressLocality: siteConfig.address.city,
            addressRegion: siteConfig.address.state,
            postalCode: siteConfig.address.postalCode,
            addressCountry: siteConfig.address.country,
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
};

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": SITE_ID,
  name: siteConfig.name,
  url: absoluteUrl("/"),
  inLanguage: siteConfig.language,
  publisher: { "@id": ORG_ID },
});

export const breadcrumbSchema = (crumbs: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: absoluteUrl(c.path),
  })),
});

export const productSchema = (product: Product) => {
  const { price } = displayPrice(product);
  const images = productImages(product.assets).map((a) => absoluteUrl(mediaUrl(a.path)));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`${productHref(product.slug)}#product`),
    name: product.name,
    description: product.meta?.description || product.description || undefined,
    sku: product.variants?.[0]?.sku || product._id,
    url: absoluteUrl(productHref(product.slug)),
    image: images,
    brand: { "@type": "Brand", name: siteConfig.name },
    ...(product.categories?.[0] ? { category: product.categories[0].name } : {}),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(productHref(product.slug)),
      priceCurrency: siteConfig.currency,
      price: price.toFixed(2),
      availability: isSoldOut(product) ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORG_ID },
    },
  };
};

export const productListSchema = (products: ProductSummary[], name: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  url: absoluteUrl(path),
  isPartOf: { "@id": SITE_ID },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(productHref(p.slug)),
      name: p.name,
    })),
  },
});

/** FAQ rich result: question / answer pairs shown on the page */
export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});

/** One schema.org Event per session of a workshop, each with its seat offer */
export const workshopSchema = (workshop: Workshop) =>
  workshop.sessions.map((session) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: workshop.title,
    description: workshop.description.replace(/\*/g, ""),
    startDate: session.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      workshop.mode === "Live online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    location:
      workshop.mode === "Live online"
        ? { "@type": "VirtualLocation", url: absoluteUrl(workshopHref(workshop.slug)) }
        : {
            "@type": "Place",
            name: siteConfig.name,
            address: {
              "@type": "PostalAddress",
              streetAddress: siteConfig.address.street,
              addressLocality: siteConfig.address.city,
              postalCode: siteConfig.address.postalCode,
              addressCountry: siteConfig.address.country,
            },
          },
    image: absoluteUrl(workshop.image.src),
    organizer: { "@id": ORG_ID },
    offers: {
      "@type": "Offer",
      price: workshop.price,
      priceCurrency: siteConfig.currency,
      availability: session.seatsLeft > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      url: absoluteUrl(bookingHref(workshop.slug)),
    },
  }));

/** A journal post, with its author and the studio as publisher */
export const blogPostingSchema = (post: BlogPostSummary) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.excerpt,
  datePublished: post.date,
  url: absoluteUrl(blogHref(post.slug)),
  mainEntityOfPage: absoluteUrl(blogHref(post.slug)),
  ...(post.cover ? { image: absoluteUrl(post.cover.src) } : {}),
  ...(post.categories[0] ? { articleSection: post.categories[0] } : {}),
  author: { "@type": "Person", name: blogAuthor },
  publisher: { "@id": ORG_ID },
  inLanguage: siteConfig.language,
});
