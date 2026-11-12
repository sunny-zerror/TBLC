import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // z-commerce serves product media from the client's asset CDN.
    // Tighten this to that host once it's known (e.g. "assets.brand.com").
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // Posts lived at /post/<slug> on the old Wix site: keep those links (and their rankings) working
  async redirects() {
    return [
      { source: "/post/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/blog/categories/:category", destination: "/blog?category=:category", permanent: true },
    ];
  },
};

export default nextConfig;
