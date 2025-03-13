import { Header } from "@/components/Header";
import { getItemsForSearch } from "@/utils/search";
import type { Metadata, Viewport } from "next";
import { Baloo_Chettan_2 } from "next/font/google";
import { PropsWithChildren } from "react";
import "./globals.css";

const balooChettan2 = Baloo_Chettan_2({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokemon",
  description: "Grant and Luca's Pokedex",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const { allPokemon, allTypes } = await getItemsForSearch();

  return (
    <html lang="en">
      <body className={`${balooChettan2.className} antialiased`}>
        <header className="flex justify-between gap-2 max-w-content mx-auto content-x-padding py-3 sm:py-6 mb-16 z-1 sticky sm:relative top-0 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm">
          <Header allTypes={allTypes} allPokemon={allPokemon} />
        </header>

        <main className="mx-auto max-w-content content-x-padding pb-16">
          {children}
        </main>
      </body>
    </html>
  );
}
