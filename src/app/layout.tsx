import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/providers/query.provider";
import { AnimeStoreProvider } from "@/providers/store.provider";
import Background from "@/components/Background";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Main from "@/components/Main";

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
        <ClerkProvider>
          <Header />
          {children}
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
