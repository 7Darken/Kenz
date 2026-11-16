/**
 * 4. « L'IA, en clair » : la chaîne de l'app, ou (Croc) le choix de s'en passer ; pour Escapades Libres,
 * « Mon rôle » en quatre étapes imagées et sa ligne de synthèse. Puis « Sous le capot ».
 */
import type { App } from "@/content/apps";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { SweepTitle } from "@/design-system/components/sweep-title";
import { Words } from "@/design-system/components/words";
import { T } from "@/i18n/text";
import { AiChain } from "./ai-chain";
import styles from "./ai-chapter.module.css";
import page from "./app-detail.module.css";
import { Engine } from "./engine";

const TITLE_ID = "ia-titre";

function Body({ app }: { app: App }) {
  if (app.kind === "web") {
    const { role } = app.story;
    return (
      <>
        <AiChain steps={role.steps} illustrated />
        <Words className={`${page.say} ${styles.end}`} text={role.end} />
      </>
    );
  }
  const { ai } = app.story;
  if (ai.kind === "none") {
    return (
      <>
        <Words className={`${page.say} ${styles.say}`} text={ai.statement} />
        <Reveal variant="fade" as="p" index={4} className={styles.sub}>
          <T value={ai.detail} />
        </Reveal>
      </>
    );
  }
  return <AiChain steps={ai.steps} />;
}

export function AiChapter({ app }: { app: App }) {
  const web = app.kind === "web";
  return (
    <Section id="ia" className={web ? `${styles.ai} ${styles.role}` : styles.ai} aura="gauche" aria-labelledby={TITLE_ID}>
      <Container>
        <SweepTitle variant="pro" id={TITLE_ID} className={`${page.h2} ${styles.title}`}>
          {web ? <T value={app.story.role.title} /> : <T k="apps.ai.title" />}
        </SweepTitle>
        <Body app={app} />
        <Engine engine={app.story.engine} />
      </Container>
    </Section>
  );
}
