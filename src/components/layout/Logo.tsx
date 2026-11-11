import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/cn";

/** The BL monogram, linking home. Size it with a height class: h-10, h-13… */
export default function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" aria-label={`${siteConfig.name} — home`} className={cn("block h-10 md:h-13", className)}>
      <Image src={siteConfig.logo} alt="" width={777} height={646} priority={priority} className="h-full w-auto" />
    </Link>
  );
}
