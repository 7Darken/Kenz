/**
 * Squelette provisoire d'une route : son titre et sa description (dictionnaire ou contenu).
 * Chaque agent remplace le contenu de sa page ; supprimer ce composant quand plus aucune page ne l'utilise.
 */
import type { DictKey } from "@/i18n/dictionaries";
import type { Localized } from "@/i18n/localize";
import { Container } from "@/design-system/components/container";
import { Section } from "@/design-system/components/section";
import { T } from "@/i18n/text";
import styles from "./route-placeholder.module.css";

type Text = { k: DictKey } | { value: Localized<string> };

function Line({ text }: { text: Text }) {
  return "k" in text ? <T k={text.k} /> : <T value={text.value} />;
}

export function RoutePlaceholder({ title, lead }: { title: Text; lead: Text }) {
  return (
    <Section id="top" aura="droite" fil="none" className={styles.placeholder} aria-labelledby="route-title">
      <Container>
        <h1 id="route-title" className={styles.title}>
          <Line text={title} />
        </h1>
        <p className={styles.lead}>
          <Line text={lead} />
        </p>
      </Container>
    </Section>
  );
}
