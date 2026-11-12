/*
 * Copy and data for /classroom. Kept here so the section components stay layout-only.
 * Links marked TODO point at /contact until the real destinations exist.
 * Workshops aren't z-commerce products yet, so their dates, seats and prices live here too.
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

/** One run of a workshop — the booking page lets the student pick between them */
export interface WorkshopSession {
  /** ISO date of the first day — also identifies the session */
  startDate: string;
  /** "Sat 15 & Sun 16 Nov 2026" */
  dates: string;
  /** "10 am – 4 pm" */
  time: string;
  /** Short, for the booking cards and ticket: "The studio, Colaba" */
  place: string;
  seatsLeft: number;
}

/** A lesson in the plan; null leaves that day's cell empty */
type Lesson = { title: string; text: string } | null;

export interface LessonPlan {
  days: { label: string; weekday: string }[];
  /** A slot either holds one lesson per day, or a break that runs across every day */
  slots: { time: string; lessons?: Lesson[]; break?: string }[];
}

export interface WorkshopKit {
  image: string;
  alt: string;
  /** Numbered markers on the photo: x / y are percentages of its width / height */
  items: { name: string; note: string; x: number; y: number }[];
}

export interface Workshop {
  slug: string;
  /** Short date for the ticket cards: "Sat 15 – Sun 16 Nov" */
  date: string;
  mode: "In the studio" | "Live online";
  title: string;
  /** The title as lettered on its page; *words between asterisks* are set in the italic flourish */
  heading: string;
  /** *Words between asterisks* are set in the italic flourish */
  description: string;
  details: string[];
  /** Price per seat */
  price: number;
  /** Desks at the table */
  seats: number;
  image: { src: string; alt: string };
  /** The rows under the title on its page: When, Time, Where, Level */
  facts: { label: string; value: string }[];
  /** Under the price: "per seat, kit included" */
  priceNote: string;
  /** On the booking ticket */
  kitIncluded: boolean;
  /** Soonest first; the first is the one shown on cards and pre-selected when booking */
  sessions: WorkshopSession[];
  lessonPlan?: LessonPlan;
  kit?: WorkshopKit;
}

export const workshops: Workshop[] = [
  {
    slug: "copperplate-for-beginners",
    date: "Sat 15 – Sun 16 Nov",
    mode: "In the studio",
    title: "Copperplate for Beginners",
    heading: "Copperplate *for Beginners*",
    description: "Two days at the studio table, from your first *hairline* to your *first word*.",
    details: ["Two days, 10 am – 4 pm", "Beginner, no experience needed", "Kit included, yours to keep"],
    price: 9500,
    seats: 12,
    image: { src: "/images/classroom/hero.jpg", alt: "Sanjana lettering Copperplate at the studio table" },
    facts: [
      { label: "When", value: "Sat 15 & Sun 16 Nov 2026" },
      { label: "Time", value: "10 am – 4 pm, both days" },
      { label: "Where", value: "The studio, Doli Chambers, Colaba, Mumbai" },
      { label: "Level", value: "Beginner, no experience needed" },
    ],
    priceNote: "per seat, kit included",
    kitIncluded: true,
    sessions: [
      {
        startDate: "2026-11-15",
        dates: "Sat 15 & Sun 16 Nov 2026",
        time: "10 am – 4 pm",
        place: "The studio, Colaba",
        seatsLeft: 8,
      },
      {
        startDate: "2027-01-17",
        dates: "Sat 17 & Sun 18 Jan 2027",
        time: "10 am – 4 pm",
        place: "The studio, Colaba",
        seatsLeft: 12,
      },
    ],
    lessonPlan: {
      days: [
        { label: "Day one", weekday: "Saturday" },
        { label: "Day two", weekday: "Sunday" },
      ],
      slots: [
        {
          time: "10:00",
          lessons: [
            {
              title: "Introduction to Copperplate · tools and supplies",
              text: "Learn about the rich history of Copperplate and the tools and supplies used.",
            },
            {
              title: "Lowercase letterforms",
              text: "Combine the basic strokes to form lowercase letters, divided group-wise, and learn to critique your work.",
            },
          ],
        },
        {
          time: "11:00",
          lessons: [
            {
              title: "Understanding the fundamentals",
              text: "Get a good grip of the 11 fundamental concepts and set a strong foundation.",
            },
            {
              title: "Connections and word formation",
              text: "Connect your letters to form words and learn various ways to practise these connections.",
            },
          ],
        },
        { time: "12:30", break: "Lunch break · both days" },
        {
          time: "13:30",
          lessons: [
            {
              title: "Warm-up drills",
              text: "Loosen up your muscles and prepare your hands for the motion of writing.",
            },
            {
              title: "Uppercase basic strokes",
              text: "Tackle the uppercase letterforms, divided into 12 groups to give you a solid understanding of their forms.",
            },
          ],
        },
        {
          time: "15:00",
          lessons: [
            {
              title: "Lowercase basic strokes",
              text: "Master the 8 basic strokes which make up all the lowercase letters.",
            },
            {
              title: "Uppercase letterforms",
              text: "Build the uppercase letters stroke by stroke, group by group, until you can write the full alphabet.",
            },
          ],
        },
      ],
    },
    kit: {
      // TODO: swap for a flat-lay of the boxed kit when it's shot
      image: "/images/classroom/community_images/img5.jpg",
      alt: "Pen holder, nib, ink and guide sheets laid out on the studio desk",
      items: [
        { name: "Oblique pen holder", note: "set for a right- or left-handed grip", x: 70, y: 84 },
        { name: "Nibs", note: "a beginner's nib and a spare", x: 63, y: 95 },
        { name: "Ink", note: "one bottle, ready to write", x: 80, y: 76 },
        { name: "Workbook & guide sheets", note: "ruled at the Copperplate slant", x: 48, y: 76 },
      ],
    },
  },
  {
    slug: "brush-lettering",
    date: "Tue 25 – Wed 26 Nov",
    mode: "Live online",
    title: "Brush Lettering",
    heading: "Brush *Lettering*",
    description: "Two evenings with a brush pen, from *basic strokes* to *bouncing letters* you can write anywhere.",
    details: ["Two evenings, 7 – 9 pm IST", "All levels welcome", "Supply list sent ahead"],
    price: 4500,
    seats: 30,
    image: { src: "/images/classroom/community_images/img3.jpg", alt: "Sanjana demonstrating lettering on camera" },
    facts: [
      { label: "When", value: "Tue 25 & Wed 26 Nov 2026" },
      { label: "Time", value: "7 – 9 pm IST, both evenings" },
      { label: "Where", value: "Live online" },
      { label: "Level", value: "All levels welcome" },
    ],
    priceNote: "per seat, supply list sent ahead",
    kitIncluded: false,
    sessions: [
      {
        startDate: "2026-11-25",
        dates: "Tue 25 & Wed 26 Nov 2026",
        time: "7 – 9 pm IST",
        place: "Live online",
        seatsLeft: 14,
      },
    ],
  },
  {
    slug: "creative-entrepreneurship",
    date: "Sat 6 Dec",
    mode: "In the studio",
    title: "Creative Entrepreneurship",
    heading: "Creative *Entrepreneurship*",
    description: "For calligraphers building a practice: *pricing, clients* and the business of *beautiful letters*.",
    details: ["One day, 11 am – 5 pm", "For working calligraphers", "Taught by Sanjana"],
    price: 7500,
    seats: 12,
    image: { src: "/images/classroom/community_images/img1.jpg", alt: "The studio desk mid-lesson" },
    facts: [
      { label: "When", value: "Sat 6 Dec 2026" },
      { label: "Time", value: "11 am – 5 pm" },
      { label: "Where", value: "The studio, Doli Chambers, Colaba, Mumbai" },
      { label: "Level", value: "For working calligraphers" },
    ],
    priceNote: "per seat, lunch included",
    kitIncluded: false,
    sessions: [
      {
        startDate: "2026-12-06",
        dates: "Sat 6 Dec 2026",
        time: "11 am – 5 pm",
        place: "The studio, Colaba",
        seatsLeft: 3,
      },
    ],
  },
];

export const getWorkshop = (slug: string) => workshops.find((w) => w.slug === slug);

export const workshopHref = (slug: string) => `/classroom/${slug}`;
export const bookingHref = (slug: string) => `/classroom/${slug}/book`;

/** The enquiry link under "Book a SEAT" */
export const workshopQuestionHref = (w: Workshop) =>
  `/contact?subject=${encodeURIComponent(`Question: ${w.title} (${w.date})`)}`;

export const pointedPenExperience = ["Never", "A little", "Yes, regularly"];

export const bookingPaymentMethods = ["UPI", "Credit or debit card", "Net banking", "International cards"];

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
