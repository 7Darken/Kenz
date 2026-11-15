/**
 * « Mes courses » (sport.html, `#courses`) : le titre, la ligne, puis toutes les courses en variante « page »
 * (une par rangée, en alternance), du module features/courses.
 */
import { COURSE_IDS } from "@/content/courses";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { Courses } from "@/features/courses";
import page from "@/features/univers/page.module.css";
import { SweepTitle } from "@/features/univers/sweep-title";
import { T } from "@/i18n/text";
import styles from "./courses-section.module.css";
import k15ze from "./sport.module.css";

export function CoursesSection() {
  return (
    <Section id="courses" tabIndex={-1} aura="droite" className={page.chapter} aria-labelledby="courses-title">
      <Container>
        <header className={styles.head}>
          <SweepTitle id="courses-title" text={{ k: "sport.courses.title" }} className={k15ze.title} />
          <Reveal variant="fade" as="p" className={styles.sub}>
            <T k="sport.courses.sub" />
          </Reveal>
        </header>
        <Courses ids={COURSE_IDS} variant="page" />
      </Container>
    </Section>
  );
}
