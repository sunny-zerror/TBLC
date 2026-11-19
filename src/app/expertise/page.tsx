import type { Metadata } from "next";
import ExpertiseFaq from "@/components/sections/expertise/ExpertiseFaq";
import ExpertiseHero from "@/components/sections/expertise/ExpertiseHero";
import ExpertiseProcess from "@/components/sections/expertise/ExpertiseProcess";
import ServicesSlider from "@/components/sections/expertise/ServicesSlider";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("/expertise");

export default function ExpertisePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Our Expertise", path: "/expertise" }])} />
      <ExpertiseHero />
      <ServicesSlider />
      <ExpertiseProcess />
      <ExpertiseFaq />
    </>
  );
}
