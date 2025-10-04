"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { BreadcrumbProvider } from "@/context/breadcrumb-context";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <BreadcrumbProvider>{children}</BreadcrumbProvider>
        </ThemeProvider>
      </NuqsAdapter>
    </SessionProvider>
  );
}
