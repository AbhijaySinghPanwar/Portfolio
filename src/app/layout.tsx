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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07080A" },
    { media: "(prefers-color-scheme: light)", color: "#F5F3EE" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // The inline script below stamps data-theme before React hydrates, so
      // the attribute legitimately differs from the server markup. Scoped to
      // this element only; mismatches anywhere else still surface.
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable} ${generalSans.variable}`}
    >
      <head>
        {/* Runs before first paint. Without it a stored light preference
            would flash the dark default for a frame on every load. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
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
