/** Univers Pro (`/`, `/apps/[slug]`, `/agents`) : l'espace, la nav Pro, le pied de page Pro. */
import type { ReactNode } from "react";

import { navApps } from "@/content/apps";
import { BRAND_LOGO, PORTRAITS, SITE_NAME, SITE_URL } from "@/content/site";
import { socialsOf } from "@/content/socials";
import { UniverseShell } from "../_components/universe-shell";

/**
 * Données structurées (schema.org) : le site (son nom dans les résultats de Google) et la personne derrière, avec
 * son portrait, son monogramme et ses comptes pro uniquement (rien qui relie l'univers Créateur).
 */
const abs = (path: string) => new URL(path, SITE_URL).href;
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "fr-FR",
      publisher: { "@id": `${SITE_URL}/#kenz` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#kenz`,
      name: SITE_NAME,
      url: SITE_URL,
      image: abs(PORTRAITS.pro.src),
      brand: {
        "@type": "Brand",
        name: SITE_NAME,
        logo: { "@type": "ImageObject", url: abs(BRAND_LOGO.src), width: BRAND_LOGO.width, height: BRAND_LOGO.height },
      },
      sameAs: socialsOf("pro").map((social) => social.href),
    },
  ],
};

export default function ProLayout({ children }: { children: ReactNode }) {
  return (
    <UniverseShell universe="pro" navApps={navApps()}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </UniverseShell>
  );
}
