import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kenzenbien.fr"),
  title: "Kenz | Mobile Developer & Content Creator",
  description:
    "Portfolio of Kenz - Mobile Developer, Travel Content Creator and Digital Explorer. Discover my apps and adventures.",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        {children}
      </body>
    </html>
  );
}
