import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import Nav from "@/components/ui/Nav";
import Scene from "@/components/scene/Scene";
import SmoothScroll from "@/components/scene/SmoothScroll";
import { site } from "@/data/site";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const generalSans = localFont({
  src: [
    { path: "../fonts/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abhijay Singh Panwar — I build systems that remember",
  description:
    "Retrieval systems, data pipelines and deployed AI products. Final-year IT student at VIT Vellore.",
  authors: [{ name: site.name }],
};

export const viewport: Viewport = {
  themeColor: "#07080A",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable} ${generalSans.variable}`}
    >
      <head>
        {/* If JS never runs, nothing may stay stuck in its pre-reveal state. */}
        <noscript>
          <style>{`[data-hero-line]{transform:none!important}[data-reveal]{opacity:1!important}.reveal-up{clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a className="skip-link mono" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        <Scene />
        <Nav />
        <div className="layer-content">{children}</div>
      </body>
    </html>
  );
}
