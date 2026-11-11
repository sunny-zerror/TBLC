import type { NavItem } from "@/types";

/* The header splits its links around the centred monogram */
export const navLeft: NavItem[] = [
  { label: "Expertise", href: "/expertise" },
  { label: "Store", href: "/shop" },
  { label: "Classroom", href: "/classroom" },
];

export const navRight: NavItem[] = [
  { label: "Studio", href: "/studio" },
  { label: "Blog", href: "/blog" },
];

/** Every top-level link, for the mobile menu */
export const mainNav: NavItem[] = [...navLeft, ...navRight];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Store", href: "/shop" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My account", href: "/account" },
      { label: "Orders", href: "/account?tab=orders" },
      { label: "Your cart", href: "/cart" },
    ],
  },
];
