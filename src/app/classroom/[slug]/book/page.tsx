import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import BookingHeader from "@/components/booking/BookingHeader";
import BookingView from "@/components/booking/BookingView";
import { bookingHref, getWorkshop, workshopHref, workshops } from "@/data/classroom";
import { createMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;
export const generateStaticParams = () => workshops.map((w) => ({ slug: w.slug }));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const workshop = getWorkshop((await params).slug);
  if (!workshop) notFound();
  return createMetadata({ title: `Book: ${workshop.title}`, path: bookingHref(workshop.slug), noIndex: true });
}

// The site header and footer are hidden here (see SiteChrome) — booking draws its own
export default async function BookingPage({ params }: { params: Params }) {
  const workshop = getWorkshop((await params).slug);
  if (!workshop) notFound();
  // Every session full: back to the class page, which offers the waiting list
  if (!workshop.sessions.some((s) => s.seatsLeft > 0)) redirect(workshopHref(workshop.slug));

  return <BookingView workshop={workshop} header={<BookingHeader slug={workshop.slug} />} />;
}
