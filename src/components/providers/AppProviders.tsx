"use client";

import { ApolloProvider } from "@/lib/apollo/client";
import Motion from "@/components/providers/Motion";
import SmoothScroll from "@/components/providers/SmoothScroll";
import StoreHydration from "@/components/providers/StoreHydration";
import Toaster from "@/components/ui/Toaster";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider>
      <StoreHydration />
      <SmoothScroll>{children}</SmoothScroll>
      <Motion />
      <Toaster />
    </ApolloProvider>
  );
}
