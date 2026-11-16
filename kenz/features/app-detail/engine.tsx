"use client";

/**
 * « Sous le capot » : le dépliant technique (la chaîne, le repli, ce que j'en retiens, les défis ou garde-fous).
 * Le dépliant change la hauteur de la page : les déclencheurs plus bas (épinglages) se recalent.
 */
import type { AppEngine } from "@/content/apps";
import { Icon } from "@/design-system/components/icon";
import { Reveal } from "@/design-system/components/reveal";
import { ScrollTrigger } from "@/design-system/motion/gsap";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import page from "./app-detail.module.css";
import styles from "./engine.module.css";

export function Engine({ engine }: { engine: AppEngine }) {
  const { lang, t } = useLanguage();
  const l = t.apps.ai;
  const hasSecond = !!(engine.fallback || engine.takeaway || engine.challenges);
  return (
    <Reveal variant="fade" className={styles.engine}>
      <details className={styles.details} onToggle={() => ScrollTrigger.refresh()}>
        <summary className={styles.summary}>
          <span>{l.engine}</span>
          <span className={styles.plus} aria-hidden="true">
            <Icon name="plus" />
          </span>
        </summary>
        <div className={`${page.bezel} ${styles.body}`}>
          <div className={`${page.bezelCore} ${styles.core}`}>
            <div>
              <p className={styles.label}>{engine.title ? localize(engine.title, lang) : l.chain}</p>
              <ul className={styles.rows}>
                {engine.chain.map((row, i) => (
                  <li key={i}>{localize(row, lang)}</li>
                ))}
              </ul>
            </div>
            {hasSecond ? (
              <div>
                {engine.fallback ? (
                  <>
                    <p className={styles.label}>{l.fallback}</p>
                    <p className={styles.text}>{localize(engine.fallback, lang)}</p>
                  </>
                ) : null}
                {engine.takeaway ? (
                  <>
                    <p className={styles.label}>{l.takeaway}</p>
                    <p className={styles.text}>{localize(engine.takeaway, lang)}</p>
                  </>
                ) : null}
                {engine.challenges ? (
                  <>
                    <p className={styles.label}>{engine.challengesTitle ? localize(engine.challengesTitle, lang) : l.challenges}</p>
                    <ul className={styles.rows}>
                      {engine.challenges.map((row, i) => (
                        <li key={i}>{localize(row, lang)}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </details>
    </Reveal>
  );
}
