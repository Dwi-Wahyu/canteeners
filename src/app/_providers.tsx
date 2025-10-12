"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { BreadcrumbProvider } from "@/context/breadcrumb-context";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/theme-provider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <BreadcrumbProvider>
              {children}
              {/* <ReactQueryDevtools
                initialIsOpen={false}
                buttonPosition="top-right"
              /> */}
            </BreadcrumbProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </QueryClientProvider>
    </SessionProvider>
  );
}
