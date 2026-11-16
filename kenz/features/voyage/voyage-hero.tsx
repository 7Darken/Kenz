"use client";

/**
 * L'arrivée de /createur/voyage (voyage.html, `.vh`) : la bille de cristal en petit (l'emplacement libre, l'Asie
 * face à nous), « Kenz en Asie » qui se découvre avec son fantôme flou, la phrase mot par mot, puis
 * « Voir la dernière vidéo ».
 */
import { Container } from "@/design-system/components/container";
import { Icon } from "@/design-system/components/icon";
import { Section } from "@/design-system/components/section";
import { Words } from "@/design-system/components/words";
import { usePageEntrance } from "@/features/passages";
import { useLanguage } from "@/i18n/language-provider";
import styles from "./voyage-hero.module.css";

export function VoyageHero() {
  const { t } = useLanguage();
  // Après le voile du passage (`porte` : une entrée plus courte), sinon une fois les polices prêtes.
  const { entered: played, via } = usePageEntrance({ waitFonts: true });
  const porte = via !== null;
  const hero = t.voyage.hero;
  const title = (
    <>
      <span className={styles.line}>{hero.titleTop}</span> <span className={styles.line}>{hero.titleBottom}</span>
    </>
  );

  return (
    <Section
      id="top"
      aura="droite"
      className={styles.hero}
      aria-labelledby="voyage-hero-title"
      data-played={played ? "" : undefined}
      data-porte={porte ? "" : undefined}
    >
      <Container className={styles.inner}>
        <div className={styles.bille} data-bille="libre" aria-hidden="true" />
        <div>
          <h1 id="voyage-hero-title" className={styles.title}>
            <span className={`${styles.ttl} ${styles.main}`}>{title}</span>
            <span className={`${styles.ttl} ${styles.ghost}`} aria-hidden="true">
              {title}
            </span>
          </h1>
          <Words
            as="p"
            className={styles.phrase}
            text={{ k: "voyage.hero.line" }}
            glow
            play={played}
            delay={porte ? 0.2 : 1.05}
          />
          <a className={`${styles.down} ${styles.anim}`} href="#derniere">
            <span className={styles.downIcon} aria-hidden="true">
              <Icon name="arrow-down" />
            </span>
            {hero.down}
          </a>
        </div>
      </Container>
    </Section>
  );
}
