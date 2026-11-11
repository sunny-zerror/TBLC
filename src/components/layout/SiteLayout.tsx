import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SiteChrome from "@/components/layout/SiteChrome";
import AppProviders from "@/components/providers/AppProviders";

/** Chrome shared by every page: providers, header, footer and the cart drawer */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-paper focus:p-3"
      >
        Skip to content
      </a>
      <SiteChrome>
        <Header />
      </SiteChrome>
      <main id="main">{children}</main>
      <SiteChrome>
        <Footer />
      </SiteChrome>
      <CartDrawer />
    </AppProviders>
  );
}
