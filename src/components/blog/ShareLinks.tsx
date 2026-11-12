"use client";

import { siteConfig } from "@/config/site";
import { toast } from "@/store/toast-store";
import { absoluteUrl } from "@/utils/url";

const linkClass = "link-line text-caption";

/** Share the post on Pinterest / Facebook or copy its link; Instagram has no share URL, so it opens the profile */
export default function ShareLinks({ path, title, image }: { path: string; title: string; image?: string }) {
  const url = absoluteUrl(path);
  const links = [
    siteConfig.socials.instagram && { label: "Instagram", href: siteConfig.socials.instagram },
    {
      label: "Pinterest",
      href: `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}${image ? `&media=${encodeURIComponent(absoluteUrl(image))}` : ""}`,
    },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  ].filter(Boolean) as { label: string; href: string }[];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy the link — copy it from the address bar instead.");
    }
  }

  return (
    <ul className="flex flex-col items-start gap-1.5">
      {links.map((link) => (
        <li key={link.label}>
          <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {link.label}
          </a>
        </li>
      ))}
      <li>
        <button type="button" onClick={copy} className={linkClass}>
          Copy link
        </button>
      </li>
    </ul>
  );
}
