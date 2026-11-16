/**
 * « Me suivre » côté voyage (voyage.html, `#suivre`) : le paysage de Kuala Lumpur à la tombée de la nuit derrière,
 * le portrait dans l'arche, le nombre d'abonnés, et seulement les comptes du voyage, en icônes.
 */
import Image from "next/image";

import { FOLLOW_MEDIA } from "@/content/series";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { SocialLinks } from "@/design-system/components/social-links";
import { SweepTitle } from "@/design-system/components/sweep-title";
import page from "@/features/univers/page.module.css";
import { Followers, FollowPortrait } from "./follow-bio";
import styles from "./follow-section.module.css";

export function FollowSection() {
  const { landscape } = FOLLOW_MEDIA;
  return (
    <Section id="suivre" aura="calme" className={styles.links} aria-labelledby="suivre-title">
      <div className={styles.background} aria-hidden="true">
        <Image src={landscape.src} alt="" fill sizes="100vw" />
      </div>
      <Container>
        <div className={styles.bio}>
          <Reveal variant="fade">
            <FollowPortrait />
          </Reveal>
          <SweepTitle id="suivre-title" text={{ k: "voyage.suivre.title" }} className={`${page.title} ${styles.name}`} />
          <Reveal variant="fade" as="p" index={1} className={styles.sub}>
            <Followers />
          </Reveal>
          <SocialLinks universe="voyage" tone="glass" label={{ k: "voyage.suivre.accounts" }} className={styles.socials} />
        </div>
      </Container>
    </Section>
  );
}
