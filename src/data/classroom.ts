/*
 * Copy and data for /classroom. Kept here so the section components stay layout-only.
 * Links marked TODO point at /contact until the real destinations exist.
 */

export const classroomLinks = {
  collective: "/contact", // TODO: Copperplate Collective course portal
  miniCourse: "/contact", // TODO: free mini course sign-up
  waitingList: "/contact?subject=Workshop%20waiting%20list",
  privateClasses: "/contact?subject=Private%20classes",
  shareWork: "/contact?subject=Share%20my%20work",
};

export const classroomStats = ["60K+ online community", "1,000+ students taught", "Since 2018"];

export const courseModules = [
  "Welcome to the course & portal",
  "Copperplate: history, tools & supplies",
  "Fundamentals",
  "Warm-up drills",
  "Lowercase basic strokes",
  "Lowercase letterforms",
  "Connections & word formation",
  "Uppercase basic strokes",
  "Uppercase letterforms",
];

export const courseFacts = [
  { value: "9", label: "modules" },
  { value: "6+", label: "hours of video" },
  { value: "100+", label: "page workbook" },
  { value: "24", label: "months of access" },
];

export interface Workshop {
  slug: string;
  date: string;
  mode: "In the studio" | "Live online";
  title: string;
  /** *Words between asterisks* are set in the italic flourish */
  description: string;
  details: string[];
  price: number;
  seatsLeft: number;
  seats: number;
}

export const workshops: Workshop[] = [
  {
    slug: "copperplate-for-beginners",
    date: "Sat 15 – Sun 16 Nov",
    mode: "In the studio",
    title: "Copperplate for Beginners",
    description: "Two days at the studio table, from your first *hairline* to your *first word*.",
    details: ["Two days, 10 am – 4 pm", "Beginner, no experience needed", "Kit included, yours to keep"],
    price: 9500,
    seatsLeft: 8,
    seats: 12,
  },
  {
    slug: "brush-lettering",
    date: "Tue 25 – Wed 26 Nov",
    mode: "Live online",
    title: "Brush Lettering",
    description: "Two evenings with a brush pen, from *basic strokes* to *bouncing letters* you can write anywhere.",
    details: ["Two evenings, 7 – 9 pm IST", "All levels welcome", "Supply list sent ahead"],
    price: 4500,
    seatsLeft: 14,
    seats: 30,
  },
  {
    slug: "creative-entrepreneurship",
    date: "Sat 6 Dec",
    mode: "In the studio",
    title: "Creative Entrepreneurship",
    description: "For calligraphers building a practice: *pricing, clients* and the business of *beautiful letters*.",
    details: ["One day, 11 am – 5 pm", "For working calligraphers", "Taught by Sanjana"],
    price: 7500,
    seatsLeft: 3,
    seats: 12,
  },
];

export const privateClassSubjects = [
  "Copperplate calligraphy",
  "Brush lettering",
  "Devnagari lettering",
  "Creative entrepreneurship",
];

export const communityPosts = [
  { image: "/images/classroom/community_images/img1.jpg", label: "Behind the desk", alt: "The studio desk mid-lesson" },
  {
    image: "/images/classroom/community_images/img2.jpg",
    label: "Live class / Studio",
    alt: "A live class in the studio",
  },
  {
    image: "/images/classroom/community_images/img3.jpg",
    label: "Tutorial / Copperplate",
    alt: "Sanjana demonstrating Copperplate",
  },
  {
    image: "/images/classroom/community_images/img5.jpg",
    label: "Unboxing / The kit",
    alt: "Unboxing the calligraphy kit",
  },
  { image: "/images/classroom/community_images/img4.jpg", label: "Tips / The nib", alt: "Close-up of a nib on paper" },
];

export const classroomFaqs = [
  {
    question: "Can I join even though I have never done calligraphy?",
    answer: "Yes. Everything starts from the basics, so no prior experience is needed.",
  },
  {
    question: "Are tools and supplies included?",
    answer:
      "Studio workshops include a kit that's yours to keep. For online classes we send a supply list ahead, and the kits are available in the Store.",
  },
  {
    question: "Do I need to be in India to join?",
    answer: "Not for the online course or live online workshops: students join from all over the world.",
  },
  {
    question: "If I can't attend a live session, are recordings available?",
    answer: "Yes. Live online sessions are recorded and shared with everyone who booked.",
  },
  {
    question: "How can I clear my doubts?",
    answer:
      "Ask during class, or share your practice sheets afterwards and Sanjana will send corrections. Course students also get the community portal.",
  },
  {
    question: "I've been doing calligraphy for a while. Will this help me?",
    answer:
      "Yes. The fundamentals and drills sharpen consistency at any level, and private classes can focus on exactly what you want to improve.",
  },
];
