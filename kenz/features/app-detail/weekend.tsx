/**
 * 4 bis. Escapades Libres : le week-end. La 1re place au Startup Weekend Grenoble, parmi de nombreuses équipes
 * (aucun autre projet nommé), et le tirage du chèque sur scène (la loupe le grossit).
 */
import type { WebApp } from "@/content/apps";
import { startupWeekend } from "@/content/startup-weekend";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { SweepTitle } from "@/design-system/components/sweep-title";
import { Words } from "@/design-system/components/words";
import { T } from "@/i18n/text";
import page from "./app-detail.module.css";
import { ContentImage } from "./content-image";
import { WeekendCaption } from "./weekend-caption";
import styles from "./weekend.module.css";

const TITLE_ID = "weekend-titre";

export function Weekend({ app }: { app: WebApp }) {
  const { weekend } = app.story;
  const { rank, ordinal } = startupWeekend.result;
  return (
    <Section id="weekend" className={styles.weekend} aura="centre" aria-labelledby={TITLE_ID}>
      <Container className={styles.inner}>
        <div className={styles.text}>
          <SweepTitle variant="pro" id={TITLE_ID} className={`${page.h2} ${styles.title}`}>
            <span className={styles.slit}>
              <span className={styles.num}>{rank}</span>
            </span>
            <sup>
              <T value={ordinal} />
            </sup>
            <span>
              {" "}
              <T k="apps.weekend.place" />
            </span>
          </SweepTitle>
          <Words className={`${page.say} ${styles.say}`} text={{ k: "apps.weekend.line" }} />
          <Reveal variant="fade" as="p" index={4} className={`${page.cap} ${styles.caption}`}>
            <WeekendCaption dates={weekend.dates} />
          </Reveal>
        </div>
        <Reveal variant="card" as="figure" className={styles.photo}>
          <div className={page.bezel}>
            <div className={`${page.bezelCore} ${styles.core}`}>
              <ContentImage className={styles.img} image={weekend.photo} sizes="(min-width: 900px) 58vw, 100vw" loupe />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
