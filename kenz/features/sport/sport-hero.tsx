"use client";

/**
 * L'arrivée de /createur/sport (sport.html, `.kh`) : « k15ze » lettre par lettre, Kenz en pleine course (la photo
 * se découvre de bas en haut), puis la promesse mot par mot, le ton, la chaîne YouTube et « Mes courses ».
 */
import Image from "next/image";
import type { CSSProperties } from "react";

import { SPORT_HERO_PHOTO } from "@/content/courses";
import { SOCIALS } from "@/content/socials";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Icon } from "@/design-system/components/icon";
import { Section } from "@/design-system/components/section";
import { Words } from "@/design-system/components/words";
import { usePageEntrance } from "@/features/passages";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./sport-hero.module.css";

export function SportHero() {
  const { lang, t } = useLanguage();
  // Après le voile du passage (`porte` : une entrée plus courte), sinon une fois les polices prêtes.
  const { entered: played, via } = usePageEntrance({ waitFonts: true });
  const porte = via !== null;
  const hero = t.sport.hero;
  const photo = SPORT_HERO_PHOTO;

  return (
    <Section
      id="top"
      aura="droite"
      className={styles.hero}
      aria-labelledby="sport-hero-title"
      data-played={played ? "" : undefined}
      data-porte={porte ? "" : undefined}
    >
      <Container className={styles.inner}>
        <p className={`${styles.cap} ${styles.anim}`}>{hero.cap}</p>
        <h1 id="sport-hero-title" className={styles.mark} aria-label={hero.mark}>
          {Array.from(hero.mark).map((letter, index) => (
            <span key={index} className={styles.letter} aria-hidden="true" style={{ "--i": index } as CSSProperties}>
              {letter}
            </span>
          ))}
        </h1>
        <figure className={styles.photo}>
          <Image
            src={photo.src}
            alt={photo.alt ? localize(photo.alt, lang) : ""}
            fill
            priority
            sizes="(min-width: 900px) 420px, (min-width: 600px) 560px, 100vw"
            data-loupe=""
          />
        </figure>
        <Words as="p" className={styles.promise} text={{ k: "sport.hero.promise" }} glow play={played} delay={0.7} />
        <p className={`${styles.tone} ${styles.anim}`}>{hero.tone}</p>
        <div className={`${styles.actions} ${styles.anim}`}>
          <Button href={SOCIALS["youtube-k15ze"].href} external>
            {hero.youtube}
          </Button>
          <a className={styles.down} href="#courses">
            <Icon name="arrow-down" />
            {hero.toCourses}
          </a>
        </div>
      </Container>
    </Section>
  );
}
