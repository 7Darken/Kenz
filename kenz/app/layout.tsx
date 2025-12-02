import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Bodoni_Moda } from "next/font/google";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kenzenbien.fr"),
  title: "Kenz | Mobile Developer & Content Creator",
  description:
    "Portfolio of Kenz - Mobile Developer and Travel Content Creator. Discover my apps and adventures.",
  icons: {
    icon: [
      { url: "/images/KzLogo.png", type: "image/png", sizes: "32x32" },
      { url: "/images/KzLogo.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/images/KzLogo.png",
    apple: "/images/KzLogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${bodoni.variable}`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
