import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/providers/query.provider";
import { AnimeStoreProvider } from "@/providers/store.provider";
import Background from "@/components/Background";
import Glass from "@/components/Glass";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Luffer Anime",
  description: "Website about anime",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <AnimeStoreProvider>
          <QueryProvider>
            <ClerkProvider>
              <Background />
              <Glass />
              <Header />
              {children}
              <Footer />
            </ClerkProvider>
          </QueryProvider>
        </AnimeStoreProvider>
      </body>
    </html>
  );
}
