/** Univers Pro (`/`, `/apps/[slug]`, `/agents`) : l'espace, la nav Pro, le pied de page Pro. */
import type { ReactNode } from "react";

import { SITE_NAME, SITE_URL } from "@/content/site";
import { socialsOf } from "@/content/socials";
import { UniverseShell } from "../_components/universe-shell";

/** Données structurées : la personne derrière le site, et ses comptes pro uniquement. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  sameAs: socialsOf("pro").map((social) => social.href),
};

export default function ProLayout({ children }: { children: ReactNode }) {
  return (
    <UniverseShell universe="pro">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      {children}
    </UniverseShell>
  );
}
