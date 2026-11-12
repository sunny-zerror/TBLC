import { siteConfig } from "@/config/site";

/** The "I'm enquiring about" chips — the chosen one is sent as the message subject */
export const enquiryTopics = [
  "Weddings & celebrations",
  "Branding & packaging",
  "Gifting",
  "Classes & workshops",
  "Something else",
];

const { street, city, postalCode, geo } = siteConfig.address;

/** One line: "Doli Chambers, …, Colaba, Mumbai 400005" */
export const studioAddress = [street, [city, postalCode].filter(Boolean).join(" ")].filter(Boolean).join(", ");

/** The studio pinned on Google Maps */
export const locationUrl = `https://www.google.com/maps/search/?api=1&query=${geo.lat},${geo.lng}`;
