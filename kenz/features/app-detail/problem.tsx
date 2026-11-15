/** 2. Le problème : une phrase, un écran ; pour les apps mobiles, à qui elle s'adresse. */
import type { App } from "@/content/apps";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { T } from "@/i18n/text";
import page from "./app-detail.module.css";
import styles from "./problem.module.css";
import { ProblemTitle } from "./problem-title";

export function Problem({ app }: { app: App }) {
  return (
    <Section id="probleme" className={styles.problem} aura="gauche" aria-labelledby="probleme-titre">
      <Container>
        <ProblemTitle
          id="probleme-titre"
          text={app.story.problem}
          className={app.kind === "web" ? `${styles.title} ${styles.long}` : styles.title}
        />
        {app.kind === "mobile" ? (
          <Reveal variant="fade" as="p" index={3} className={`${page.cap} ${styles.caption}`}>
            <T value={app.story.audience} />
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}
