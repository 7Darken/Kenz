/**
 * C2 « Le sport » (#sport) : l'univers k15ze, en un écran. Le vert annonce qu'on change d'univers (un seul mot, avec
 * une lueur douce) ; les deux courses côte à côte (features/courses, variante `landing`), puis « Entrer dans le sport ».
 * Le fond k15ze arrive en fondu depuis la page (aucune frontière visible) et reste opaque : la Terre fixe est cachée.
 */
import { CREATEUR_COURSE_IDS } from "@/content/courses";
import { passageAttributes, ROUTES } from "@/content/site";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { Words } from "@/design-system/components/words";
import { Courses } from "@/features/courses";
import { T } from "@/i18n/text";
import styles from "./sport-section.module.css";

const TITLE_ID = "sport-t";

export function SportSection() {
  return (
    <Section id="sport" aura="gauche" fil="none" aria-labelledby={TITLE_ID} className={styles.sport}>
      <Container className={styles.inner}>
        <header className={styles.head}>
          <Reveal variant="fade" as="p" className={styles.universe}>
            <T k="createur.sport.universe" />
          </Reveal>
          <Words as="h2" id={TITLE_ID} text={{ k: "createur.sport.title" }} className={styles.title} />
        </header>
        <div className={styles.cards}>
          <Courses ids={CREATEUR_COURSE_IDS} variant="landing" />
        </div>
        <Button href={ROUTES.sport} icon="arrow-right" className={styles.door} {...passageAttributes("sport")}>
          <T k="createur.sport.door" />
        </Button>
      </Container>
    </Section>
  );
}
