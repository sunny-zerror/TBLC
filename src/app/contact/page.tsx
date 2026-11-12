import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import ContactDetails from "@/components/sections/contact/ContactDetails";
import ContactForm from "@/components/sections/contact/ContactForm";
import JoinTeam from "@/components/sections/contact/JoinTeam";
import StudioMap from "@/components/sections/contact/StudioMap";
import { breadcrumbSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("/contact");

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />

      <section className="container pt-section pb-stack">
        <h1 data-heading-effect className="text-display">
          Get <em className="text-flourish text-accent">in touch.</em>
        </h1>

        {/* Form first on phones; details beside it, vertically centred, from md up */}
        <div className="mt-stack grid gap-stack md:mt-section md:grid-cols-2 md:gap-x-24">
          <ContactDetails className="order-last md:order-first md:self-center" />
          <div className="flex flex-col gap-stack">
            <p className="max-w-xl text-title-sm text-flourish text-accent">
              Have a project in mind or a question for us? We&apos;d love to hear from you.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      <StudioMap />
      <JoinTeam />
    </>
  );
}
