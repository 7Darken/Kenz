/**
 * Le chapitre « contact » (pro.html A4, agents.html) : la phrase, GitHub et LinkedIn, le formulaire.
 * Composant serveur ; seul le formulaire est un composant client. Contrat : ./index.ts.
 */
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { Words } from "@/design-system/components/words";
import { socialsOf } from "@/content/socials";
import type { DictKey } from "@/i18n/dictionaries";
import { ContactForm, type ContactVariant } from "./contact-form";
import styles from "./contact-section.module.css";

export interface ContactSectionProps {
  variant?: ContactVariant;
}

const TITLE_ID = "contact-t";

const TITLES: Readonly<Record<ContactVariant, DictKey>> = {
  pro: "pro.contact.pro.title",
  agents: "pro.contact.agents.title",
};

export function ContactSection({ variant = "pro" }: ContactSectionProps) {
  return (
    <Section id="contact" tabIndex={-1} aura="bas" className={styles.contact} aria-labelledby={TITLE_ID}>
      <Container className={styles.split}>
        <div className={styles.side}>
          <Words as="h2" id={TITLE_ID} text={{ k: TITLES[variant] }} glow className={styles.say} />
          <Reveal variant="fade" className={styles.links}>
            {socialsOf("pro").map((social) => (
              <Button key={social.id} href={social.href} external variant="ghost" size="sm">
                {social.label}
              </Button>
            ))}
          </Reveal>
        </div>
        <Reveal variant="card">
          <ContactForm variant={variant} labelledBy={TITLE_ID} />
        </Reveal>
      </Container>
    </Section>
  );
}
