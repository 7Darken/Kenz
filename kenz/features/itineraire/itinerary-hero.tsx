"use client";

/**
 * L'arrivée de l'itinéraire : le titre qui se découvre, la phrase mot à mot, les étapes, « Explorer l'itinéraire »
 * et la vidéo ; à droite, l'affiche de la vidéo ; dessous, le voyage en bref (jours, villes, activités, budget).
 * Le nom chinois du pays veille en filigrane.
 */
import Image from "next/image";
import type { CSSProperties } from "react";

import type { Itinerary } from "@/content/itineraries";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Section } from "@/design-system/components/section";
import { Words } from "@/design-system/components/words";
import bezel from "@/design-system/styles/bezel.module.css";
import { usePageEntrance } from "@/features/passages";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { dayRange } from "./format";
import { PlayIcon } from "./icons";
import styles from "./itinerary-hero.module.css";
import { cityStops, tripStats, videoUrls } from "./trip";
import { PLANNER_ID } from "./use-day-hash";

export function ItineraryHero({ itinerary }: { itinerary: Itinerary }) {
  const { lang, t } = useLanguage();
  const s = t.itineraire;
  const { entered, via } = usePageEntrance({ waitFonts: true });
  const porte = via !== null;
  const title = localize(itinerary.title, lang);
  const stats = tripStats(itinerary);
  const stops = cityStops(itinerary);
  const { watch } = videoUrls(itinerary);

  return (
    <Section
      id="top"
      aura="droite"
      className={styles.hero}
      aria-labelledby="itineraire-title"
      data-played={entered ? "" : undefined}
      data-porte={porte ? "" : undefined}
    >
      <span className={styles.watermark} lang="zh" aria-hidden="true">
        {itinerary.hanzi}
      </span>
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <h1 id="itineraire-title" className={styles.title}>
            <span className={styles.main}>{title}</span>
          </h1>
          <Words
            as="p"
            className={styles.lead}
            text={itinerary.description}
            play={entered}
            delay={porte ? 0.2 : 0.9}
          />
          <ol className={`${styles.route} ${styles.anim}`} aria-label={s.hero.route}>
            {stops.map((stop) => (
              <li key={stop.city.id} style={{ "--c": stop.city.color } as CSSProperties}>
                <span className={styles.dot} aria-hidden="true" />
                {localize(stop.city.name, lang)}
                <span className={styles.hanzi} lang="zh">
                  {stop.city.hanzi}
                </span>
                <span className={styles.range}>{dayRange(stop, s.planner.dayShort)}</span>
              </li>
            ))}
          </ol>
          <div className={`${styles.actions} ${styles.anim}`}>
            <Button href={`#${PLANNER_ID}`} icon="arrow-down">
              {s.hero.explore}
            </Button>
            <Button href={watch} external variant="ghost">
              {s.hero.watch}
            </Button>
          </div>
        </div>

        <figure className={`${bezel.bezel} ${styles.poster}`}>
          <div className={`${bezel.core} ${styles.core}`}>
            <a className={styles.link} href={watch} target="_blank" rel="noopener" aria-label={format(s.hero.watchLabel, { title })}>
              <Image
                className={styles.image}
                src={itinerary.thumbnail.src}
                alt=""
                fill
                sizes="(min-width: 900px) 46vw, 100vw"
                priority
              />
              <span className={`${bezel.glass} ${styles.play}`} aria-hidden="true">
                <PlayIcon />
              </span>
            </a>
          </div>
        </figure>

        <dl className={`${styles.facts} ${styles.anim}`} aria-label={s.hero.facts}>
          <div>
            <dt>{s.stats.days}</dt>
            <dd>{stats.days}</dd>
          </div>
          <div>
            <dt>{s.stats.cities}</dt>
            <dd>{stats.cities}</dd>
          </div>
          <div>
            <dt>{s.stats.activities}</dt>
            <dd>{stats.activities}</dd>
          </div>
          <div className={styles.budget}>
            <dt>
              {s.stats.budget} · {s.budgetNote}
            </dt>
            <dd>≈&nbsp;{format(s.euroRange, { min: stats.budgetMin, max: stats.budgetMax })}</dd>
          </div>
        </dl>
      </Container>
    </Section>
  );
}
