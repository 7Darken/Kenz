import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { SiteHeader } from "@/components/site/header";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kenzenbien.fr"),
  title: "Kenz.",
  description:
    "Kenz en Bien. Toujours dans le bon. Créateur de contenu, ingénieur développeur d'application pour aider et facilité le quotidien des gens. Oui, on peut dire philanthrope.",
  icons: {
    icon: [
      { url: "/images/KzLogo.png", type: "image/png", sizes: "32x32" },
      { url: "/images/KzLogo.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/images/KzLogo.png",
    apple: "/images/KzLogo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Kenz.",
    description:
      "Kenz en Bien. Toujours dans le bon. Créateur de contenu, ingénieur développeur d'application pour aider et facilité le quotidien des gens. Oui, on peut dire philanthrope.",
    url: "https://kenzenbien.fr",
    siteName: "Kenz.",
    images: [
      {
        url: "/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Kenz ",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenz.",
    description: "Full stack engineer crafting modern SaaS, fintech and AI products.",
    creator: "@kenzEnBien",
    images: ["/og-cover.png"],
  },
  keywords: [
    "Full Stack Developer",
    "Next.js",
    "React",
    "TailwindCSS",
    "Framer Motion",
    "Portfolio",
    "TypeScript",
  ],
  authors: [{ name: "Kenz" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden`}>
        <ThemeProvider>
          <div className="relative mx-auto min-h-screen w-full max-w-[1200px] px-4 pb-16 pt-6 sm:px-8 lg:px-10">
            <SiteHeader />
            <main className="pt-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
