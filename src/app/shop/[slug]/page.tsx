import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductDetails from "@/components/product/ProductDetails";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import SeeAlso, { SeeAlsoSkeleton } from "@/components/product/SeeAlso";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { productSchema } from "@/lib/schema";
import { createMetadata } from "@/lib/seo";
import { getProduct } from "@/services/catalog";
import { primaryImage } from "@/utils/media";
import { productHref } from "@/utils/url";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  // Thrown here too: metadata resolves before streaming starts for crawlers, so they get a real 404
  if (!product) notFound();

  const image = product.meta?.og?.image || primaryImage(product.assets)?.path;
  const keywords = product.meta?.keywords;
  return createMetadata({
    title: product.meta?.title || product.name,
    description: product.meta?.description || product.description?.slice(0, 160) || undefined,
    path: productHref(product.slug),
    image: image || undefined,
    imageAlt: product.name,
    keywords: Array.isArray(keywords) ? keywords : keywords ? keywords.split(",").map((k) => k.trim()) : undefined,
  });
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const category = product.categories?.[0];

  return (
    <>
      <JsonLd data={productSchema(product)} />
      <div className="container pt-6">
        <Breadcrumbs
          items={[
            { name: "Store", path: "/shop" },
            ...(category ? [{ name: category.name, path: `/shop?category=${category.slug}` }] : []),
            { name: product.name, path: productHref(product.slug) },
          ]}
        />
      </div>

      <section className="container grid items-start gap-x-16 gap-y-stack pt-5 pb-section md:grid-cols-[minmax(0,1fr)_minmax(0,32rem)]">
        <ProductGallery assets={product.assets} name={product.name} />
        {/* Top-aligned with the gallery and sticky under the header while the tall image scrolls */}
        <div className="md:sticky md:top-[calc(var(--spacing-header)+1.5rem)]">
          {product.ribbon?.name && (
            <p data-fade className="mb-6 inline-block bg-surface px-2.5 py-1 text-flourish text-body">
              {product.ribbon.name}
            </p>
          )}
          {/* Keyed so moving between products replaces the split heading rather than editing its text */}
          <h1 key={product._id} data-heading-effect data-delay="0.1">
            {product.name}
          </h1>
          <div data-fade data-delay="0.35">
            <ProductPurchase product={product}>
              {category && <p className="mt-2 text-caption text-muted">{category.name}</p>}
              {product.description && (
                <p className="mt-10 text-body whitespace-pre-line text-ink-soft">{product.description}</p>
              )}
            </ProductPurchase>
          </div>
        </div>
      </section>

      <ProductDetails product={product} />

      {/* Streams in after the product: the 404 check above has already run, so this Suspense
          can't affect the status code (unlike a loading.tsx — see CLAUDE.md "Real 404s") */}
      <Suspense fallback={<SeeAlsoSkeleton />}>
        <SeeAlso product={product} />
      </Suspense>
    </>
  );
}
