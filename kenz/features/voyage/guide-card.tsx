"use client";

/**
 * La carte du guide Chine (voyage.html, `.gcard`) : le calendrier des 14 jours qui s'allume case par case,
 * le titre, les trois bases, et le bouton. Tant que la page de l'itinéraire n'est pas en ligne
 * (content/series.ts, `page.online`), le bouton ouvre la vidéo du même itinéraire.
 */
import { useRef, type CSSProperties } from "react";

import { CHINA_GUIDE } from "@/content/series";
import { Button } from "@/design-system/components/button";
import { useInView } from "@/design-system/motion/use-in-view";
import bezel from "@/design-system/styles/bezel.module.css";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./guide-section.module.css";

export function GuideCard() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
  const { lang, t } = useLanguage();
  const guide = CHINA_GUIDE;
  const cta = guide.page.online
    ? { href: guide.page.href, label: localize(guide.page.label, lang) }
    : { href: guide.video, label: t.voyage.guide.watch };

  return (
    <article ref={ref} className={`${bezel.bezel} ${styles.card}`} data-in={inView ? "" : undefined}>
      <div className={`${bezel.core} ${styles.core}`}>
        <div className={styles.art} aria-hidden="true">
          <ol className={styles.days}>
            {Array.from({ length: guide.days }, (_, i) => (
              <li key={i} style={{ "--i": i } as CSSProperties}>
                {i + 1}
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>{localize(guide.title, lang)}</h3>
          <ol className={styles.bases} aria-label={t.voyage.guide.bases}>
            {guide.bases.map((base) => (
              <li key={base.name.fr}>
                {localize(base.name, lang)}
                {base.nativeName ? <span lang={base.nativeName.lang}>{base.nativeName.text}</span> : null}
              </li>
            ))}
          </ol>
          <Button href={cta.href} external>
            {cta.label}
          </Button>
        </div>
      </div>
    </article>
  );
}
