/**
 * Le chapitre « Mes apps » (pro.html A1) : six apps, six astres dans une nuit plein cadre.
 * Composant serveur : il lit le contenu (content/apps.ts) et le passe à la scène (client).
 */
import { apps, CONSTELLATION_CODE, SPACE_ORDER } from "@/content/apps";
import { Section } from "@/design-system/components/section";
import { SpaceScene, type SpaceApp } from "./space-scene";
import styles from "./apps-space.module.css";

const TITLE_ID = "apps-title";
const PORTRAIT = { src: "/assets/img/kenz-pro.webp", width: 1080, height: 1920 } as const;

export function AppsSpace() {
  const items: SpaceApp[] = SPACE_ORDER.map((slug) => {
    const app = apps[slug];
    return { slug, name: app.name, color: app.colors.tint, icon: app.icon, card: app.space };
  });
  // Le code secret, en index des astres (un slug absent de la scène le rendrait impossible : il est ignoré).
  const code = CONSTELLATION_CODE.map((slug) => SPACE_ORDER.indexOf(slug)).filter((i) => i >= 0);

  return (
    <Section id="apps" aura="calme" className={styles.space} aria-labelledby={TITLE_ID}>
      <SpaceScene apps={items} code={code} portrait={PORTRAIT} titleId={TITLE_ID} />
    </Section>
  );
}
