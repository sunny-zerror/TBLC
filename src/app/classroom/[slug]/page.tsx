import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LessonPlan from "@/components/sections/workshop/LessonPlan";
import MoreWorkshops from "@/components/sections/workshop/MoreWorkshops";
import WorkshopHero from "@/components/sections/workshop/WorkshopHero";
import WorkshopKit from "@/components/sections/workshop/WorkshopKit";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { getWorkshop, workshopHref, workshops } from "@/data/classroom";
import { workshopSchema } from "@/lib/schema";
import { createMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

// Every workshop is prerendered; any other slug is a real 404
export const dynamicParams = false;
export const generateStaticParams = () => workshops.map((w) => ({ slug: w.slug }));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const workshop = getWorkshop((await params).slug);
  if (!workshop) notFound();
  return createMetadata({
    title: `${workshop.title} — ${workshop.mode}`,
    description: `${workshop.description.replace(/\*/g, "")} ${workshop.details.join(". ")}.`,
    path: workshopHref(workshop.slug),
    image: workshop.image.src,
    imageAlt: workshop.image.alt,
  });
}

export default async function WorkshopPage({ params }: { params: Params }) {
  const workshop = getWorkshop((await params).slug);
  if (!workshop) notFound();

  return (
    <>
      <JsonLd data={workshopSchema(workshop)} />
      <div className="container pt-6">
        <Breadcrumbs
          items={[
            { name: "Classroom", path: "/classroom" },
            { name: "Classes & workshops", path: "/classroom#workshops" },
            { name: workshop.title, path: workshopHref(workshop.slug) },
          ]}
        />
      </div>
      <WorkshopHero workshop={workshop} />
      {workshop.lessonPlan && <LessonPlan plan={workshop.lessonPlan} />}
      {workshop.kit && <WorkshopKit kit={workshop.kit} />}
      <MoreWorkshops currentSlug={workshop.slug} />
    </>
  );
}
