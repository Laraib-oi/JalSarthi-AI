import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";

import  Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { SITE } from "@/constants/site";

// Suppress TS error for side-effect CSS import in the app directory
// Type declarations for CSS imports are not present in this project.
// @ts-ignore
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE.name} | ${SITE.tagline}`,
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B5ED7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-body-sm focus:font-semibold focus:text-primary-700 focus:shadow-card"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
