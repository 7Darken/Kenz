/** « Et chez vous ? » sur /agents : un chapitre du fil (l'aura à gauche), le titre et les besoins. */
import { Container } from "@/design-system/components/container";
import { Section } from "@/design-system/components/section";
import { T } from "@/i18n/text";
import { IaNeeds } from "./ia-needs";
import { SectionTitle } from "./section-title";
import styles from "./needs-section.module.css";

export function NeedsSection() {
  return (
    <Section id="chez-vous" aura="gauche" className={styles.section} aria-labelledby="chez-vous-t">
      <Container>
        <SectionTitle id="chez-vous-t" className={styles.title}>
          <T k="agents.needs.title" />
        </SectionTitle>
        <IaNeeds />
      </Container>
    </Section>
  );
}
