/** « Tu pars en Chine ? » (voyage.html, `#guide`) : la phrase, la carte de l'itinéraire de 14 jours, la suite. */
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { Words } from "@/design-system/components/words";
import page from "@/design-system/styles/univers-page.module.css";
import { T } from "@/i18n/text";
import { GuideCard } from "./guide-card";
import styles from "./guide-section.module.css";

export function GuideSection() {
  return (
    <Section id="guide" aura="centre" className={`${page.chapter} ${page.screen}`} aria-labelledby="guide-title">
      <Container className={styles.wrap}>
        <Words as="h2" id="guide-title" className={page.statement} text={{ k: "voyage.guide.title" }} glow />
        <GuideCard />
        <Reveal variant="fade" as="p" className={styles.soon}>
          <T k="voyage.guide.soon" />
        </Reveal>
      </Container>
    </Section>
  );
}
