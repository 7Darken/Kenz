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
  metadataBase: new URL("https://kenz.dev"),
  title: "Kenz.",
  description:
    "Full stack engineer specializing in immersive product experiences, realtime architectures and delightful interfaces.",
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
      "Explore projects, philosophy and contact details for Kenz, a full stack engineer crafting future-ready products.",
    url: "https://kenz.dev",
    siteName: "Kenz Portfolio",
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
    title: "Kenz · Full Stack Developer Portfolio",
    description: "Full stack engineer crafting modern SaaS, fintech and AI products.",
    creator: "@kenzdev",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}>
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
