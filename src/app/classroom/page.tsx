import type { Metadata } from "next";
import ClassroomFaq from "@/components/sections/classroom/ClassroomFaq";
import ClassroomHero from "@/components/sections/classroom/ClassroomHero";
import Community from "@/components/sections/classroom/Community";
import CourseFacts from "@/components/sections/classroom/CourseFacts";
import OnlineCourse from "@/components/sections/classroom/OnlineCourse";
import PrivateClasses from "@/components/sections/classroom/PrivateClasses";
import Workshops from "@/components/sections/classroom/Workshops";
import JsonLd from "@/components/seo/JsonLd";
import { classroomFaqs } from "@/data/classroom";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("/classroom");

export default function ClassroomPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Classroom", path: "/classroom" }]), faqSchema(classroomFaqs)]} />
      <ClassroomHero />
      <OnlineCourse />
      <CourseFacts />
      <Workshops />
      <PrivateClasses />
      <Community />
      <ClassroomFaq />
    </>
  );
}
