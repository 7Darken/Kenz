/**
 * « Ce que je partage » (sport.html, `#partage`) : le format (15–45 s, des Shorts et des carrousels) et les
 * sujets observés, chacun dans un cadre de Short (content/courses.ts, K15ZE_TOPICS).
 */
import { K15ZE_TOPICS } from "@/content/courses";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import page from "@/features/univers/page.module.css";
import { SweepTitle } from "@/features/univers/sweep-title";
import { T } from "@/i18n/text";
import styles from "./partage-section.module.css";
import { ShortCard } from "./short-card";
import k15ze from "./sport.module.css";

export function PartageSection() {
  return (
    <Section
      id="partage"
      tabIndex={-1}
      aura="gauche"
      className={`${page.chapter} ${page.screen}`}
      aria-labelledby="partage-title"
    >
      <Container>
        <div className={styles.head}>
          <SweepTitle id="partage-title" text={{ k: "sport.partage.title" }} className={k15ze.title} />
          <Reveal variant="fade" as="p" className={styles.format}>
            <span className={styles.duration}>
              <T k="sport.partage.duration" />
            </span>
            <span className={styles.formats}>
              <T k="sport.partage.formats" />
            </span>
          </Reveal>
        </div>
        <ul className={styles.shorts} role="list">
          {K15ZE_TOPICS.map((topic, index) => (
            <ShortCard key={topic.drawing} topic={topic} index={index} />
          ))}
        </ul>
      </Container>
    </Section>
  );
}
