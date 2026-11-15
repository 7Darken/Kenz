/**
 * `/` : l'accueil Pro, dans l'ordre de pro.html : le hero, les apps dans l'espace, les 54 heures,
 * « Pour votre équipe » (la phrase et l'aperçu de la machine), le contact.
 */
import { Container } from "@/design-system/components/container";
import { Section } from "@/design-system/components/section";
import { Words } from "@/design-system/components/words";
import { AppsSpace } from "@/features/apps-space";
import { ContactSection } from "@/features/contact";
import { Hero } from "@/features/hero";
import { IaPreview } from "@/features/ia";
import { Victoire } from "@/features/victoire";
import { pageMetadata } from "@/i18n/metadata";
import { getDictionary } from "@/i18n/server";
import styles from "./page.module.css";

const { meta } = getDictionary().pro;

export const metadata = pageMetadata({ ...meta, path: "/", universe: "pro" });

const TEAM_TITLE_ID = "equipe-q";

export default function ProHomePage() {
  return (
    <>
      <Hero variant="pro" />
      <AppsSpace />
      <Victoire />
      <Section id="equipe" aura="gauche" className={styles.team} aria-labelledby={TEAM_TITLE_ID}>
        <Container className={styles.grid}>
          <div className={styles.copy}>
            <Words as="h2" id={TEAM_TITLE_ID} text={{ k: "pro.team.title" }} glow className={styles.question} />
          </div>
          <IaPreview caseId="recette" />
        </Container>
      </Section>
      <ContactSection />
    </>
  );
}
