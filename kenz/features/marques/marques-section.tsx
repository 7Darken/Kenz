/**
 * Marques & collaborations (voyage.html, `#marques`) : la phrase, et le formulaire (marque, e-mail ou @, idée,
 * ordre de budget) qui part vers `POST /api/contact` (type « marques »). On y arrive aussi par le lien discret du
 * pied de page.
 */
import { Container } from "@/design-system/components/container";
import { Section } from "@/design-system/components/section";
import { Words } from "@/design-system/components/words";
import page from "@/design-system/styles/univers-page.module.css";
import { BrandForm } from "./brand-form";
import styles from "./marques-section.module.css";

export function MarquesSection() {
  return (
    <Section
      id="marques"
      tabIndex={-1}
      aura="droite"
      className={`${page.chapter} ${page.screen}`}
      aria-labelledby="marques-title"
    >
      <Container className={styles.split}>
        <div className={styles.side}>
          <Words as="h2" id="marques-title" className={page.statement} text={{ k: "voyage.marques.title" }} glow />
        </div>
        <BrandForm labelledBy="marques-title" />
      </Container>
    </Section>
  );
}
