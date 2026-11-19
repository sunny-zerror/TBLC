import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetail from "@/components/sections/expertise/ServiceDetail";
import JsonLd from "@/components/seo/JsonLd";
import { getService, serviceHref, services } from "@/data/expertise";
import { breadcrumbSchema } from "@/lib/schema";
import { createMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

// Every service is prerendered; any other slug is a real 404
export const dynamicParams = false;
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) notFound();
  return createMetadata({
    title: service.title,
    description: `${service.intro} ${service.story[0]}`,
    path: serviceHref(service.slug),
    image: service.gallery[0].src,
    imageAlt: service.gallery[0].alt,
  });
}

export default async function ServicePage({ params }: { params: Params }) {
  const service = getService((await params).slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Our Expertise", path: "/expertise" },
          { name: service.title, path: serviceHref(service.slug) },
        ])}
      />
      <ServiceDetail service={service} />
    </>
  );
}
