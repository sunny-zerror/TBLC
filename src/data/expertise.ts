/*
 * The /expertise hero: the services line under the heading, and the studio photos that drift
 * through the canvas behind it. Photos from the old site's studio page
 * (public/images/expertise/hero/gallery/, 640px WebP).
 */
export const expertiseServices = [
  "Luxury invitations, paper goods, stationery & calligraphy",
  "branding & packaging",
  "custom made gifting solutions",
];

export interface ServiceImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface Service {
  slug: string;
  title: string;
  /** The short list on the slider card and under the intro on the service page */
  tags: string[];
  /** The slider card's photo (public/images/expertise/services/) */
  image: string;
  alt: string;
  intro: string;
  /** The "The story" and "The design" tabs: paragraphs */
  story: string[];
  design: string[];
  /** The "What we offer" tab */
  offer: string[];
  /** Service page photos (public/images/expertise/<slug>/): the first is framed on the mat, the
   *  next four fill the 2 × 2 grid, and a sixth (optional) runs full width */
  gallery: ServiceImage[];
}

const img = (slug: string, n: number, width: number, height: number, alt: string): ServiceImage => ({
  src: `/images/expertise/${slug}/${String(n).padStart(2, "0")}.jpg`,
  width,
  height,
  alt,
});

/*
 * The four practices: the "Our services & expertise" slider and the /expertise/<slug> pages.
 * Copy and photos from the old site's studio page, which splits the work into six practices —
 * weddings, celebrations, branding, specialty books, letters, personalisation and on-site — folded
 * here into four. TODO: the on-site "What we offer" list isn't on the old site; confirm it with the studio.
 */
export const services: Service[] = [
  {
    slug: "weddings-celebrations",
    title: "Weddings & Celebrations",
    tags: ["Invitations", "Day-of details", "Signage", "Gifting & personalisation"],
    image: "/images/expertise/services/weddings.jpg",
    alt: "Blush wedding envelopes sealed with gold wax, beside a floral invitation suite",
    intro: "No two couples are the same, and neither are our creations.",
    story: [
      "If you can dream it, we can create it. At our studio, we layer your story, vision, and wild little dreams with our own touch of storytelling to create one-of-a-kind invitations that are unmistakably yours.",
    ],
    design: [
      "From custom calligraphy and watercolour illustrations, to quality paper finishes and unique constructions, every element of your suite is carefully imagined and crafted to honour your special day and the enduring sentiment it carries.",
      "Whether you’re honouring a landmark birthday, graduation, or simply a sit-down dinner, we collaborate with you to craft beautiful stationery that respects the sanctity of your event.",
    ],
    offer: [
      "Save-the-dates",
      "Wedding invitation suites",
      "Day-of stationery: menus, place cards & seating charts",
      "Event signage & welcome letters",
      "Gift tags, gift bags & thank-you cards",
      "Wedding websites",
    ],
    gallery: [
      img(
        "weddings-celebrations",
        1,
        1400,
        787,
        "Blush envelopes with a gold wax seal, opened on a floral-lined invitation",
      ),
      img("weddings-celebrations", 2, 1080, 1350, "An ivory invitation lettered in gold on deckle-edged paper"),
      img("weddings-celebrations", 3, 719, 900, "A pink and green floral invitation suite with an illustrated tree"),
      img("weddings-celebrations", 4, 1400, 904, "Embossed white invitations with hand-painted leaves"),
      img("weddings-celebrations", 5, 720, 900, "A gold invitation tied with ribbon, beside a calligraphed card"),
      img("weddings-celebrations", 6, 1080, 1080, "A navy wedding box with a gold monogram and its invitation suite"),
    ],
  },
  {
    slug: "branding-lettering",
    title: "Branding & Lettering",
    tags: ["Branding & identity", "Packaging", "Specialty books", "Custom lettering"],
    image: "/images/expertise/services/branding.jpg",
    alt: "A stationery suite in deep green and ivory, styled with ceramic vases",
    intro:
      "Signature, creative identities to define your brand and shape how your audience sees, remembers, and connects with you.",
    story: [
      "We offer individuals, start-ups, and organisations cohesive visual branding services that range from logo design & brand identity, to beautifully crafted packaging that distinguishes itself against competition and helps you achieve your goals.",
    ],
    design: [
      "Our specialty books are designed to honour the story you have to tell. Whether you’re capturing a journey, marking a milestone, or presenting an idea, we shape each project with purposeful storytelling, intentional design, and lasting impact.",
      "From the arc of a story, the texture of a page, or the turning of the cover, every detail is crafted with care, for books that are meant to be kept and shared.",
    ],
    offer: [
      "Logo suite design",
      "Icon & pattern design",
      "Full-service visual brand identity",
      "Brand refreshes",
      "Packaging design",
      "Coffee table books, catalogues & lookbooks",
      "Commemorative editions & custom journals",
    ],
    gallery: [
      img("branding-lettering", 1, 1080, 561, "A gilded wooden nameplate lettered “Sheths”"),
      img("branding-lettering", 2, 600, 900, "Navy and gold brand stationery with a mandala pattern"),
      img("branding-lettering", 3, 900, 601, "Stacked TRYYST packaging boxes in sage and teal"),
      img("branding-lettering", 4, 600, 900, "A specialty book in red, opened on architectural photography"),
      img("branding-lettering", 5, 600, 900, "A linen-bound book debossed with a monogram"),
      img("branding-lettering", 6, 900, 675, "A green and ivory stationery suite styled with ceramic vases"),
    ],
  },
  {
    slug: "bespoke-personal",
    title: "Bespoke & Personal",
    tags: ["Hand-written letters", "Personalised objects", "Etching & engraving"],
    image: "/images/expertise/services/bespoke.jpg",
    alt: "A handwritten Copperplate letter in blue ink on deckle-edged paper",
    intro: "In a digital-first world, hand-scripted letters are profoundly intimate.",
    story: [
      "Through the enduring craft of calligraphy, each stroke carries warmth and intent, transforming words into a memento to hold on to.",
    ],
    design: [
      "Our calligraphy-led personalisation transforms everyday objects, from wine bottles and glassware, to perfumes and accessories into lasting keepsakes.",
      "We specialise in etchings and personalisation with a clean finish on glass, metal, and acrylic that stand the test of time.",
    ],
    offer: [
      "Hand-written letters",
      "Envelope addressing",
      "Decorative art & custom commissions",
      "Etching on glass, metal & acrylic",
      "Personalised bottles, perfumes & accessories",
    ],
    gallery: [
      img("bespoke-personal", 1, 1080, 1350, "Wine glasses etched with a gold monogram"),
      img("bespoke-personal", 2, 719, 899, "A letter written in blue Copperplate on a deckle-edged scroll"),
      img("bespoke-personal", 3, 720, 900, "A hand-lettered note in brown ink on handmade paper"),
      img("bespoke-personal", 4, 900, 900, "Champagne flutes engraved with initials and tied with ribbon"),
      img("bespoke-personal", 5, 720, 900, "A perfume bottle lettered with a name in calligraphy"),
      img("bespoke-personal", 6, 900, 770, "Pocket mirrors engraved with names, among roses"),
    ],
  },
  {
    slug: "on-site-experiences",
    title: "On-Site Experiences",
    tags: ["Live calligraphy", "Engraving", "Events", "Brand activations"],
    image: "/images/expertise/services/on-site.jpg",
    alt: "Sanjana personalising bottles live at a brand event",
    intro: "Our on-site calligraphy & engraving services infuse brand events with refined engagement.",
    story: [
      "We understand that on-site personalisation is more than a service, and is an extension of you as the host. We’re uniquely fluent in both premium craft and the culture of high-touch engagement, understanding the nuance of engaging guests with elegance, discretion, and care.",
    ],
    design: [
      "From corporate events and store launches, to weddings and private parties, guests see their names or personal messages come to life through the delicate art of calligraphy.",
    ],
    offer: [
      "Live calligraphy",
      "On-site engraving & personalisation",
      "Store launches & brand activations",
      "Corporate events",
      "Weddings & private parties",
    ],
    gallery: [
      img("on-site-experiences", 1, 1400, 904, "Two calligraphers lettering cards side by side at an event"),
      img("on-site-experiences", 2, 601, 900, "Sanjana engraving bottles live at a brand activation"),
      img("on-site-experiences", 3, 701, 899, "Sanjana lettering a card against a botanical backdrop"),
      img("on-site-experiences", 4, 900, 900, "Sanjana at a lettering station dressed in red hearts"),
      img("on-site-experiences", 5, 720, 900, "A personalised bottle beside lettered glass candle holders"),
    ],
  },
];

export const serviceHref = (slug: string) => `/expertise/${slug}`;
export const getService = (slug: string) => services.find((s) => s.slug === slug);

/*
 * "The process": four steps down the ink line. Illustrations in public/images/expertise/process/,
 * lifted from the design mockup. TODO: "See the work" should point at /studio once that page exists.
 */
export const processSteps = [
  {
    word: "Story",
    text: "We layer your story, vision, and wild little dreams into every piece, from the very first letter.",
    link: { label: "Write to us", href: "/contact" },
    image: { src: "/images/expertise/process/envelope.png", width: 478, height: 415 },
  },
  {
    word: "Design",
    text: "From custom calligraphy and watercolour illustrations to quality paper finishes and unique constructions, every element is carefully imagined.",
    link: { label: "See the work", href: "#services" },
    image: { src: "/images/expertise/process/book.png", width: 612, height: 394 },
  },
  {
    word: "Craft",
    text: "A mastery of paper and print: multi-level embossing, debossing, screen-printing, laser-cutting and foiling.",
    link: { label: "Meet the studio", href: "/about" },
    image: { src: "/images/expertise/process/ink.png", width: 494, height: 439 },
  },
  {
    word: "Keepsake",
    text: "Transforming words into a memento to hold on to, made to be kept and shared.",
    link: { label: "Visit the store", href: "/shop" },
    image: { src: "/images/expertise/process/gift.png", width: 493, height: 452 },
  },
];

/*
 * "Questions, answered." The first answer is from the design; the rest are drafts.
 * TODO: confirm every answer with the studio before launch (and then add faqSchema to the page).
 */
export const expertiseFaqs = [
  {
    question: "When should we commission our wedding stationery?",
    answer:
      "Ideally four to six months before the date, so there is time for consultation, proofs and hand-lettering every name. Shorter timelines are sometimes possible — ask us.",
  },
  {
    question: "Do you work with clients outside India?",
    answer:
      "Yes. Consultations and proofs happen over email and video calls, and finished pieces are packed carefully and shipped to you.",
  },
  {
    question: "Will we see a proof before anything is made?",
    answer:
      "Always. You approve the design, wording and details on a digital proof before anything goes to print or is lettered by hand.",
  },
  {
    question: "Can you letter in Devnagari and other scripts?",
    answer:
      "Alongside Copperplate and modern calligraphy, we letter in Devnagari and other scripts. Tell us what you have in mind and we'll show you what's possible.",
  },
  {
    question: "How is a bespoke commission priced?",
    answer:
      "Every commission is quoted individually, based on quantities, paper, print techniques and the amount of hand-lettering. Write to us with your date and an idea of the brief for an estimate.",
  },
  {
    question: "Can you letter live at our event outside Mumbai?",
    answer:
      "Yes — our calligraphers travel for weddings, launches and brand activations. Travel and stay are quoted alongside the booking.",
  },
];

/** Sized so the canvas can lay out each plane before its texture arrives */
export const expertiseGallery = [
  { src: "/images/expertise/hero/gallery/01.webp", width: 640, height: 640 },
  { src: "/images/expertise/hero/gallery/02.webp", width: 512, height: 640 },
  { src: "/images/expertise/hero/gallery/03.webp", width: 512, height: 640 },
  { src: "/images/expertise/hero/gallery/04.webp", width: 640, height: 360 },
  { src: "/images/expertise/hero/gallery/05.webp", width: 640, height: 427 },
  { src: "/images/expertise/hero/gallery/06.webp", width: 427, height: 640 },
  { src: "/images/expertise/hero/gallery/07.webp", width: 640, height: 480 },
  { src: "/images/expertise/hero/gallery/08.webp", width: 640, height: 640 },
  { src: "/images/expertise/hero/gallery/09.webp", width: 512, height: 640 },
  { src: "/images/expertise/hero/gallery/10.webp", width: 640, height: 548 },
  { src: "/images/expertise/hero/gallery/11.webp", width: 512, height: 640 },
  { src: "/images/expertise/hero/gallery/12.webp", width: 484, height: 640 },
  { src: "/images/expertise/hero/gallery/13.webp", width: 640, height: 640 },
  { src: "/images/expertise/hero/gallery/14.webp", width: 570, height: 640 },
  { src: "/images/expertise/hero/gallery/15.webp", width: 512, height: 640 },
  { src: "/images/expertise/hero/gallery/16.webp", width: 640, height: 427 },
  { src: "/images/expertise/hero/gallery/17.webp", width: 640, height: 427 },
  { src: "/images/expertise/hero/gallery/18.webp", width: 427, height: 640 },
  { src: "/images/expertise/hero/gallery/19.webp", width: 511, height: 640 },
  { src: "/images/expertise/hero/gallery/20.webp", width: 480, height: 640 },
  { src: "/images/expertise/hero/gallery/21.webp", width: 480, height: 640 },
  { src: "/images/expertise/hero/gallery/22.webp", width: 427, height: 640 },
  { src: "/images/expertise/hero/gallery/23.webp", width: 480, height: 640 },
  { src: "/images/expertise/hero/gallery/24.webp", width: 427, height: 640 },
  { src: "/images/expertise/hero/gallery/25.webp", width: 640, height: 511 },
  { src: "/images/expertise/hero/gallery/26.webp", width: 512, height: 640 },
  { src: "/images/expertise/hero/gallery/27.webp", width: 427, height: 640 },
  { src: "/images/expertise/hero/gallery/28.webp", width: 427, height: 640 },
  { src: "/images/expertise/hero/gallery/29.webp", width: 427, height: 640 },
  { src: "/images/expertise/hero/gallery/30.webp", width: 499, height: 640 },
];
