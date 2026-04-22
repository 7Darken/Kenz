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
  title: {
    default: "Kenz Narainen | Développeur Full Stack & Créateur de Contenu",
    template: "%s | Kenz Narainen",
  },
  description:
    "Portfolio de Kenz Narainen (en Bien en Asie) — Développeur Full Stack, créateur d'applications mobiles (Oshii, Zenko, Sago) et créateur de contenu voyage en Asie. Basé à Paris.",
  keywords: [
    "Kenz Narainen",
    "Kenz",
    "en Bien en Asie",
    "enbienasie",
    "7kinze",
    "développeur full stack",
    "développeur mobile",
    "créateur de contenu",
    "créateur de contenu voyage",
    "voyage Asie",
    "vlog voyage",
    "portfolio développeur",
    "applications mobiles",
    "Oshii",
    "Zenko",
    "Sago",
    "React Native",
    "Swift",
    "Next.js",
    "Paris",
    "TikTok",
  ],
  authors: [{ name: "Kenz Narainen", url: "https://kenzenbien.fr" }],
  creator: "Kenz Narainen",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://kenzenbien.fr",
    siteName: "Kenz Narainen",
    title: "Kenz Narainen | Développeur Full Stack & Créateur de Contenu",
    description:
      "Portfolio de Kenz Narainen — Développeur Full Stack, créateur d'applications mobiles et créateur de contenu voyage.",
    images: [
      {
        url: "/images/Pro-pp.webp",
        width: 1200,
        height: 630,
        alt: "Kenz Narainen — Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenz Narainen | Développeur Full Stack & Créateur de Contenu",
    description:
      "Portfolio de Kenz Narainen — Apps mobiles, développement web et création de contenu voyage.",
    images: ["/images/Pro-pp.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/KzLogo.webp", type: "image/webp", sizes: "32x32" },
      { url: "/images/KzLogo.webp", type: "image/webp", sizes: "16x16" },
    ],
    shortcut: "/images/KzLogo.webp",
    apple: "/images/KzLogo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Kenz Narainen",
              url: "https://kenzenbien.fr",
              image: "https://kenzenbien.fr/images/Pro-pp.webp",
              jobTitle: "Full Stack Developer",
              description: "Développeur Full Stack et créateur de contenu voyage (en Bien en Asie) basé à Paris.",
              sameAs: [
                "https://www.tiktok.com/@7kinze",
                "https://www.youtube.com/@7Kinze",
                "https://www.instagram.com/kenz.dev",
                "https://github.com/7Darken",
                "https://www.linkedin.com/in/kenz-narainen",
              ],
              knowsAbout: ["Mobile Development", "Web Development", "Swift", "React Native", "Next.js", "Content Creation"],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Paris",
                addressCountry: "FR",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${bodoni.variable}`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
