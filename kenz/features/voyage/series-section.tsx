"use client";

/**
 * « Mes séries » (voyage.html, `#series`) : la liste dans l'ordre réel ; la série au milieu de l'écran s'allume
 * (les autres s'effacent un peu, sauf en mouvement réduit), et la bille, épinglée à côté, se tourne vers son pays
 * (./series-focus → ./voyage-bille). Sur ordinateur, le nom du pays (et son nom local) s'affiche sous la bille.
 */
import { useEffect, useRef, useState } from "react";

import { ESCALES, SERIES, SERIES_IDS } from "@/content/series";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { useReducedMotion } from "@/features/motion/use-reduced-motion";
import page from "@/features/univers/page.module.css";
import { SweepTitle } from "@/features/univers/sweep-title";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { setActiveSeries } from "./series-focus";
import { SeriesRow } from "./series-row";
import styles from "./series-section.module.css";

export function SeriesSection() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { lang, t } = useLanguage();
  const [active, setActive] = useState(-1);

  // La série la plus proche du milieu de l'écran (son milieu : le haut de la ligne, au plus 60 % d'écran plus bas).
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = Array.from(list.children) as HTMLElement[];
    let mids: number[] = [];
    let raf = 0;
    const measure = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      mids = rows.map((row) => {
        const r = row.getBoundingClientRect();
        return r.top + y + Math.min(r.height, vh * 0.6) / 2;
      });
    };
    const frame = () => {
      raf = 0;
      const center = window.scrollY + window.innerHeight * 0.5;
      let index = 0;
      let best = Infinity;
      mids.forEach((mid, k) => {
        const d = Math.abs(mid - center);
        if (d < best) {
          best = d;
          index = k;
        }
      });
      setActive(index);
      setActiveSeries(SERIES_IDS[index]);
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const resize = new ResizeObserver(() => {
      measure();
      request();
    });
    resize.observe(document.body);
    measure();
    request();
    window.addEventListener("scroll", request, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      window.removeEventListener("scroll", request);
      setActiveSeries(null);
    };
  }, []);

  const current = SERIES[SERIES_IDS[Math.max(0, active)]];
  const escale = ESCALES[current.escale];
  const country = localize(escale.country, lang);

  return (
    <Section
      id="series"
      aura="gauche"
      className={page.chapter}
      aria-labelledby="series-title"
      data-scrub={reduced ? undefined : ""}
    >
      <Container>
        <header>
          <SweepTitle id="series-title" text={{ k: "voyage.series.title" }} className={page.title} />
          <Reveal variant="fade" as="p" className={styles.sub}>
            {t.voyage.series.sub}
          </Reveal>
        </header>
        <div className={styles.grid}>
          <div className={styles.side}>
            <div className={styles.pin}>
              <div className={styles.bille} data-bille="series" aria-hidden="true" />
              <p key={current.escale} className={styles.country} aria-hidden="true">
                <span className={styles.countryName}>{country}</span>
                <span className={styles.countryLocal} lang={escale.nativeName?.lang}>
                  {escale.nativeName?.text}
                </span>
              </p>
            </div>
          </div>
          <ol ref={listRef} className={styles.list} role="list">
            {SERIES_IDS.map((id, index) => (
              <SeriesRow key={id} series={SERIES[id]} index={index} active={index === active} />
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
