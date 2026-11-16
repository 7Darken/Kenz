/**
 * « Infos pratiques » : six cartes (visa, paiement, internet, se déplacer, quand partir, la langue), puis
 * « Ma checklist », gardée sur l'appareil.
 */
import type { Itinerary } from "@/content/itineraries";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { SweepTitle } from "@/design-system/components/sweep-title";
import bezel from "@/design-system/styles/bezel.module.css";
import page from "@/design-system/styles/univers-page.module.css";
import { T } from "@/i18n/text";
import { Checklist } from "./checklist";
import styles from "./essentials.module.css";
import { TripIcon } from "./icons";

export function Essentials({ itinerary }: { itinerary: Itinerary }) {
  return (
    <Section id="infos" aura="droite" className={page.chapter} aria-labelledby="infos-title">
      <Container>
        <SweepTitle id="infos-title" text={{ k: "itineraire.essentials.title" }} className={`${page.title} ${styles.title}`} />
        <div className={styles.grid}>
          {itinerary.essentials.map((item, index) => (
            <Reveal key={item.icon} as="article" index={index % 3} className={`${bezel.bezel} ${styles.card}`}>
              <div className={`${bezel.core} ${styles.core}`}>
                <span className={styles.icon}>
                  <TripIcon name={item.icon} />
                </span>
                <h3 className={styles.cardTitle}>
                  <T value={item.title} />
                </h3>
                <p className={styles.text}>
                  <T value={item.text} />
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal className={`${bezel.bezel} ${styles.checklist}`} index={1}>
            <Checklist slug={itinerary.slug} items={itinerary.checklist} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
