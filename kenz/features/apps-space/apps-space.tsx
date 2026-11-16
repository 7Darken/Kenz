/**
 * Le chapitre « Mes apps » (pro.html A1) : six apps, six astres dans une nuit plein cadre.
 * Composant serveur : il lit le contenu (content/apps.ts) et le passe à la scène (client).
 */
import { apps, APPS_TOTAL_USERS, CONSTELLATION_CODE, SPACE_ORDER } from "@/content/apps";
import { PORTRAITS } from "@/content/site";
import { Section } from "@/design-system/components/section";
import { SpaceScene, type SpaceApp } from "./space-scene";
import styles from "./apps-space.module.css";

const TITLE_ID = "apps-title";

export function AppsSpace() {
  const items: SpaceApp[] = SPACE_ORDER.map((slug) => {
    const app = apps[slug];
    return { slug, name: app.name, color: app.colors.tint, icon: app.icon, iconDark: app.iconDark, card: app.space };
  });
  // Le code secret, en index des astres (un slug absent de la scène le rendrait impossible : il est ignoré).
  const code = CONSTELLATION_CODE.map((slug) => SPACE_ORDER.indexOf(slug)).filter((i) => i >= 0);

  return (
    <Section id="apps" aura="calme" className={styles.space} tabIndex={-1} aria-labelledby={TITLE_ID}>
      <SpaceScene apps={items} code={code} portrait={PORTRAITS.pro} titleId={TITLE_ID} users={APPS_TOTAL_USERS.value} />
    </Section>
  );
}
