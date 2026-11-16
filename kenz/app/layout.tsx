/**
 * Layout racine : polices, jetons et base du design system, scripts du thème et du niveau de qualité (avant
 * l'affichage, sans éclair), providers (langue, thème, mouvement). Chaque univers a ensuite son layout
 * (groupes (pro) et (createur)).
 */
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/design-system/tokens.css";
import "@/design-system/base.css";
import { SITE_NAME, SITE_URL } from "@/content/site";
import { qualityScript } from "@/design-system/motion/quality-script";
import { arrivalScript } from "@/features/passages";
import { themeScript } from "@/design-system/theme/theme-script";
import { getDictionary } from "@/i18n/server";
import { fontVariables } from "./fonts";
import { Providers } from "./providers";

const t = getDictionary();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: t.pro.meta.title,
  description: t.pro.meta.description,
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: qualityScript }} />
        <script dangerouslySetInnerHTML={{ __html: arrivalScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
