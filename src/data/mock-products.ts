/*
 * Demo catalogue used while z-commerce isn't configured (see isApiConfigured),
 * shaped exactly like the API's data so pages don't care where it came from.
 * Names, prices and photos are TBLC's, from the website design; once .env.local
 * points at the store, z-commerce's own products and media replace all of this.
 */
import type { Asset, Category, Product, Variant } from "@/types";

export const mockCategories: Category[] = [
  {
    _id: "cat-stationery",
    name: "Stationery & Paper",
    slug: "stationery-paper",
    description: "Embossed, foiled and hand-finished paper for notes worth keeping.",
  },
  {
    _id: "cat-home",
    name: "Home & Gifting",
    slug: "home-gifting",
    description: "Lettered keepsakes for the table, the shelf and the people you love.",
  },
  {
    _id: "cat-writing",
    name: "Writing & Calligraphy",
    slug: "writing-calligraphy",
    description: "Nibs, inks and kits to start your own practice at the desk.",
  },
  {
    _id: "cat-personalised",
    name: "Personalised",
    slug: "personalised",
    description: "Names, dates and words, lettered by hand and made only for you.",
  },
];

const [stationery, home, writing, personalised] = mockCategories;

const LETTERING_STYLES = ["Classic", "Devnagari", "Whimsical"];

const image = (file: string, altText: string, extra: Partial<Asset> = {}): Asset => ({
  path: `/images/products/${file}.jpg`,
  type: "image",
  altText,
  ...extra,
});

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

interface Spec {
  name: string;
  price: number;
  categories: Category[];
  photo: string;
  ribbon?: string;
  /** offered in the three lettering styles */
  lettered?: boolean;
  /** offered in these colours (when not lettered) */
  colours?: string[];
  gallery?: Asset[];
  description?: string;
  additionalInfo?: Product["additionalInfo"];
}

let index = 0;
const make = ({ name, price, categories, photo, ribbon, lettered, colours, gallery = [], ...rest }: Spec): Product => {
  const id = `demo-${++index}`;
  const optionName = lettered ? "Lettering style" : "Colour";
  const choices = lettered ? LETTERING_STYLES : (colours ?? []);
  const variants: Variant[] = choices.length
    ? choices.map((choice) => ({
        _id: `${id}-${slugify(choice)}`,
        selectedOptions: [choice],
        variantPrice: price,
        stockStatus: "IN_STOCK",
      }))
    : [{ _id: `${id}-default`, selectedOptions: [], variantPrice: price, stockStatus: "IN_STOCK" }];

  return {
    _id: id,
    name,
    slug: slugify(name),
    price,
    discountedPrice: null,
    assets: [image(photo, name, { isFeatured: true }), ...gallery],
    ribbon: ribbon ? { name: ribbon } : null,
    categoryIds: categories.map((c) => c._id),
    categories,
    productOptions: choices.length ? [{ optionName, choices: choices.map((name) => ({ name })) }] : [],
    variants,
    status: "PUBLISHED",
    ...rest,
  };
};

export const mockProducts: Product[] = [
  make({
    name: "The Bloom Collection",
    price: 10500,
    categories: [stationery, personalised],
    photo: "bloom-collection",
    ribbon: "Best seller",
    lettered: true,
    gallery: [
      image("bloom-collection-detail", "Close-up of the blind-embossed floral pattern with gold foil"),
      image("bloom-collection-2", "The Bloom Collection — embossed envelopes, cards and tag"),
      image("bloom-collection-3", "The Bloom Collection — money envelope"),
      image("bloom-collection-4", "The Bloom Collection — folding card"),
      image("bloom-collection-5", "The Bloom Collection — acrylic box with satin ribbon"),
    ],
    description:
      "A set of personal stationery for the elegant, floral lover, worked in a heavy 3D blind-embossed floral pattern. Each piece combines blind emboss, gold foil and screen print, and every item is customised to go from your desk to your very special ones.",
    additionalInfo: [
      { title: "Processes", description: "Heavy 3D blind emboss<br>Gold foil<br>Screen print" },
      { title: "Envelopes", description: "Printed inner liner, sealed with an embossed flower sticker" },
      { title: "Packaging", description: "Acrylic box with satin ribbon" },
      {
        title: "Sizes",
        description:
          "Money envelope 18.25 × 9 cm<br>Gift tag 8.25 × 6 cm<br>Folding card 8.25 × 12 cm (folded)<br>Card envelope 12.75 × 9 cm",
      },
    ],
  }),
  make({
    name: "Noor Gift Card & Envelope Set",
    price: 2400,
    categories: [stationery],
    photo: "noor-gift-card-set",
    colours: ["Kraft", "Ivory"],
    ribbon: "New arrival",
  }),
  make({ name: "Calligraphy Starter Kit", price: 3000, categories: [writing], photo: "calligraphy-starter-kit" }),
  make({
    name: "Calligraphy Nameplates",
    price: 8950,
    categories: [home, personalised],
    photo: "calligraphy-nameplates",
    ribbon: "Best seller",
    lettered: true,
  }),
  make({ name: "Gayatri Mantra", price: 1650, categories: [home], photo: "gayatri-mantra" }),
  make({
    name: "Wedding Vow Booklets",
    price: 1500,
    categories: [stationery, personalised],
    photo: "wedding-vow-booklets",
    ribbon: "New addition",
    lettered: true,
  }),
  make({
    name: "Undated Planner",
    price: 1999,
    categories: [stationery],
    photo: "undated-planner",
    colours: ["Blush", "Ink"],
  }),
  make({
    name: "Ziller Inks — Sterling Silver",
    price: 999,
    categories: [writing],
    photo: "ziller-ink-sterling-silver",
  }),
  make({
    name: "Engraved Champagne Flutes",
    price: 1950,
    categories: [home, personalised],
    photo: "engraved-champagne-flutes",
    lettered: true,
  }),
  make({
    name: "Personalised Pocket Mirror",
    price: 600,
    categories: [home, personalised],
    photo: "pocket-mirror",
    lettered: true,
  }),
  make({
    name: "TBLC Tote Bag",
    price: 499,
    categories: [home],
    photo: "tblc-tote-bag",
    colours: ["Natural", "Black"],
    ribbon: "Best seller",
  }),
  make({
    name: "Letterospective — Achyut Palav",
    price: 1200,
    categories: [writing],
    photo: "letterospective",
    ribbon: "Limited edition",
  }),
  make({
    name: "The Aurelia Collection",
    price: 8000,
    categories: [stationery, personalised],
    photo: "aurelia-collection",
    lettered: true,
  }),
];
