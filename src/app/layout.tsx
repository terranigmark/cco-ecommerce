import type { Metadata } from "next";
import { Anton, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Ticker } from "@/components/chrome/ticker";
import { Header } from "@/components/chrome/header";
import { Footer } from "@/components/chrome/footer";
import { MobileTabBar } from "@/components/chrome/mobile-tab-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CCO · Colectivo Cervecero de Oriente",
  description:
    "Distribución de cerveza artesanal mexicana para bares, restaurantes y tiendas. Cardera y Cervecería 308. Arma tu pedido, lo cotizamos, pagas al recibir.",
};

const themeScript = `try{var p=JSON.parse(localStorage.getItem('cco.prefs')||'{}');document.documentElement.dataset.theme=p.theme==='light'?'light':'dark';document.documentElement.lang=p.lang==='en'?'en':'es'}catch(e){document.documentElement.dataset.theme='dark'}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      data-theme="dark"
      className={`${anton.variable} ${plexMono.variable} ${instrument.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain min-h-full">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Ticker />
            <Header />
            {children}
            <Footer />
          </div>
          <MobileTabBar />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
