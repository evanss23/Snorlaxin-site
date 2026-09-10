import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getSession } from "@/lib/auth";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", weight: ["400", "500", "600", "700"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: "Snorlaxin · Pokémon merch for serious nappers", template: "%s · Snorlaxin" },
  description:
    "Handmade and hand-picked Pokémon merchandise with a dreamy Snorlax theme. Plush, apparel, pins, custom epoxy and tufted rugs.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <CartProvider>
            <Nav signedIn={!!session} />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
