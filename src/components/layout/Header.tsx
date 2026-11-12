"use client";

import { RiMenuLine, RiShoppingBag3Line } from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/layout/Logo";
import MobileMenu from "@/components/layout/MobileMenu";
import { navLeft, navRight } from "@/config/navigation";
import { useCart } from "@/hooks/useCart";
import type { NavItem } from "@/types";
import { cn } from "@/utils/cn";

const linkClass = "link-line py-1 text-cta";

function NavLinks({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return (
    <ul className="flex gap-10 xl:gap-14">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(linkClass, active ? "text-accent" : "text-ink hover:text-accent")}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      {/* Named so page view transitions (globals.css) leave it still while the content fades */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper [view-transition-name:site-header]">
        <div className="container grid h-header grid-cols-[1fr_auto_1fr] items-center gap-6">
          <div className="flex items-center">
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="-ml-2 p-2 md:hidden">
              <RiMenuLine className="size-5" />
            </button>
            <nav aria-label="Main" className="hidden md:block">
              <NavLinks items={navLeft} pathname={pathname} />
            </nav>
          </div>

          <Logo priority />

          <div className="flex items-center justify-end gap-6 xl:gap-10">
            <nav aria-label="More" className="hidden md:block">
              <NavLinks items={navRight} pathname={pathname} />
            </nav>
            <Link
              href="/cart"
              aria-label={`Your cart, ${count} ${count === 1 ? "item" : "items"}`}
              className="-mr-2 flex items-center gap-1.5 p-2 text-small transition-colors hover:text-accent"
            >
              <RiShoppingBag3Line className="size-4" />
              <span aria-hidden="true">({count})</span>
            </Link>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
