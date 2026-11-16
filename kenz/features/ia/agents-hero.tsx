"use client";

/**
 * L'arrivée de /agents (agents.html, « Une phrase forte ») : la phrase monte mot à mot (la première en retrait),
 * la lumière s'allume derrière, puis l'invitation à choisir un cas. Pas un chapitre du fil.
 */
import { Container } from "@/design-system/components/container";
import { Section } from "@/design-system/components/section";
import { Words } from "@/design-system/components/words";
import { usePageEntrance } from "@/features/passages";
import { useLanguage } from "@/i18n/language-provider";
import styles from "./agents-hero.module.css";

/** L'écart entre deux mots qui montent (celui de <Words>). */
const WORD_STAGGER_S = 0.07;

export function AgentsHero() {
  const { t } = useLanguage();
  // Juste après le premier affichage (60 ms), ou quand le voile du passage se lève.
  const arrived = usePageEntrance({ delay: 60 }).entered;
  // La seconde phrase continue la cascade de la première, comme un seul titre.
  const leadWords = t.agents.hero.lead.trim().split(/[ \t\n\r]+/).length;

  return (
    <Section
      id="top"
      chapter={false}
      className={styles.hero}
      data-in={arrived ? "" : undefined}
      aria-labelledby="top-t"
    >
      <div className={styles.light} aria-hidden="true" />
      <Container className={styles.inner}>
        <h1 id="top-t" className={styles.title}>
          <Words as="span" text={{ k: "agents.hero.lead" }} play={arrived} className={styles.lead} />{" "}
          <Words
            as="span"
            text={{ k: "agents.hero.title" }}
            glow
            play={arrived}
            delay={Number((leadWords * WORD_STAGGER_S).toFixed(2))}
          />
        </h1>
        <p className={styles.sub}>{t.agents.hero.sub}</p>
      </Container>
    </Section>
  );
}
