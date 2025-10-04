import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

import NextTopLoader from "nextjs-toploader";
import { Providers } from "./_providers";

const figtree = Figtree({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CANTEENERS",
  description: "Kemudahan Berbelanja di Kantin",
  creator: "Mahasiswa Sistem Informasi UH",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${figtree.className} antialiased`}>
        <NextTopLoader
          color="#2299DD"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          zIndex={1600}
          showAtBottom={false}
          showSpinner={false}
        />

        <Toaster richColors position="top-right" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
