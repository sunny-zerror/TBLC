import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "lenis/dist/lenis.css";
import "@/styles/globals.css";
import SiteLayout from "@/components/layout/SiteLayout";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { createRootMetadata } from "@/lib/seo";

export const metadata: Metadata = createRootMetadata();

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-motion is set by the script below before hydration, so <html> differs from the server render on purpose
    <html lang={siteConfig.language} className={fontVariables} suppressHydrationWarning>
      {/* Extensions (ColorZilla, Grammarly…) add attributes to <body> before hydration; ignore those, children are still checked */}
      <body suppressHydrationWarning>
        {/* Before first paint: lets globals.css hide what <Motion /> will animate in (skipped for reduced motion) */}
        <Script id="motion-flag" strategy="beforeInteractive">
          {`if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.motion="on"`}
        </Script>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
