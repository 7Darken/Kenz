/**
 * Le retour vers la landing Créateur, en bas des pages d'univers (voyage.html et sport.html, `.retour`) :
 * une grande pastille « Toute ma création de contenu », qui part avec la transition Passage.
 * `variant` : "terre" (Melodrama, l'icône en couleur de bouton) ou "k15ze" (Inter gras, l'icône discrète).
 */
import Link from "next/link";

import { passageAttributes, ROUTES } from "@/content/site";
import { Container } from "@/design-system/components/container";
import { Icon } from "@/design-system/components/icon";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import type { DictKey } from "@/i18n/dictionaries";
import { T } from "@/i18n/text";
import styles from "./return-door.module.css";

interface ReturnDoorProps {
  variant: "terre" | "k15ze";
  /** Le nom de la section (lecteurs d'écran). */
  label: DictKey;
  /** Le texte de la porte. */
  door: DictKey;
}

export function ReturnDoor({ variant, label, door }: ReturnDoorProps) {
  return (
    <Section
      id="retour"
      aura="calme"
      fil="center"
      className={`${styles.retour} ${styles[variant]}`}
      aria-labelledby="retour-label"
    >
      <span id="retour-label" className="sr">
        <T k={label} />
      </span>
      <Container className={styles.inner}>
        <Reveal variant="card">
          <Link className={styles.door} href={ROUTES.createur} {...passageAttributes("createur")}>
            <span className={styles.icon} aria-hidden="true">
              <Icon name="arrow-left" />
            </span>
            <T k={door} />
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
