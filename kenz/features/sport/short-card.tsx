"use client";

/**
 * Un sujet, dans un cadre de Short vertical (sport.html, `.short`) : la barre de lecture qui se remplit,
 * le dessin au trait qui se trace, le nom en bas. Il entre à l'écran une fois.
 */
import { useRef, type CSSProperties } from "react";

import type { K15zeTopic } from "@/content/courses";
import { useInView } from "@/design-system/motion/use-in-view";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./partage-section.module.css";
import { TopicDrawing } from "./topic-drawing";

export function ShortCard({ topic, index }: { topic: K15zeTopic; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { threshold: 0.14, rootMargin: "0px 0px -10% 0px" });
  const { lang } = useLanguage();
  return (
    <li ref={ref} className={styles.short} style={{ "--i": index } as CSSProperties} data-in={inView ? "" : undefined}>
      <div className={styles.frame}>
        <span className={styles.bar} aria-hidden="true">
          <i />
        </span>
        <TopicDrawing drawing={topic.drawing} />
        <p className={styles.name}>{localize(topic.name, lang)}</p>
      </div>
    </li>
  );
}
