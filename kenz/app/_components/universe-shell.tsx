/**
 * L'ossature d'un univers, montée par le layout de chaque groupe de routes : `data-univers` (les jetons
 * de l'univers s'appliquent à toute la page), l'aura, le fil, la loupe, la nav et le pied de page.
 * Emplacements pour features/passages : `navDot` (le cordon du logo) et `sky` (le ciel du pied de page Créateur).
 */
import type { ReactNode } from "react";

import type { NavApp } from "@/content/apps";
import type { Universe } from "@/content/site";
import { Aura } from "@/design-system/components/aura";
import { Fil } from "@/design-system/components/fil";
import { Loupe } from "@/design-system/components/loupe";
import { SkipLink } from "@/design-system/components/skip-link";
import { Footer } from "@/features/footer/footer";
import { Nav } from "@/features/nav/nav";
import { PassageRoot } from "@/features/passages";
import styles from "./universe-shell.module.css";

const MAIN_ID = "contenu";

interface UniverseShellProps {
  universe: Universe;
  navDot?: ReactNode;
  sky?: ReactNode;
  /** Pro : les apps vues par la nav (voir `navApps`). */
  navApps?: Readonly<Record<string, NavApp>>;
  children: ReactNode;
}

export function UniverseShell({ universe, navDot, sky, navApps, children }: UniverseShellProps) {
  return (
    <div data-univers={universe}>
      <SkipLink target={MAIN_ID} />
      <Aura />
      <Fil />
      <Loupe />
      <Nav variant={universe} dot={navDot} apps={navApps} />
      <main id={MAIN_ID} className={styles.main} tabIndex={-1}>
        {children}
      </main>
      <Footer variant={universe} sky={sky} />
      <PassageRoot />
    </div>
  );
}
