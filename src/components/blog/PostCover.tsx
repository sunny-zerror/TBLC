import Image from "next/image";
import type { BlogImage } from "@/data/blog";
import { cn } from "@/utils/cn";

interface PostCoverProps {
  cover: BlogImage | null;
  title: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** A post's cover, filling its (sized, positioned) parent; posts without one get the monogram on blush paper */
export default function PostCover({ cover, title, sizes, priority, className }: PostCoverProps) {
  if (!cover) {
    return (
      <div aria-hidden="true" className={cn("absolute inset-0 center bg-surface grain", className)}>
        <Image src="/monogram_logo.svg" alt="" width={120} height={100} className="w-1/4 max-w-24 opacity-40" />
      </div>
    );
  }
  return (
    <Image
      src={cover.src}
      alt={title}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
