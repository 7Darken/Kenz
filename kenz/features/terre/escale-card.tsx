/**
 * Une escale du trajet : son rang, le pays (et son nom local), la période, la série, une vraie vignette ;
 * la dernière, en préparation : le nom en contour, « Prochaine escale », puis la porte du voyage.
 */
import type { Escale } from "@/content/series";
import { passageAttributes, ROUTES } from "@/content/site";
import { Button } from "@/design-system/components/button";
import { T } from "@/i18n/text";
import { EscaleMedia } from "./escale-media";
import { SeriesLine } from "./series-line";
import styles from "./voyage-section.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

interface EscaleCardProps {
  escale: Escale;
  rank: number;
  total: number;
}

export function EscaleCard({ escale, rank, total }: EscaleCardProps) {
  const { country, nativeName, dates, series, media, upcoming } = escale;
  return (
    <li className={upcoming ? `${styles.stop} ${styles.upcoming}` : styles.stop}>
      <p className={styles.rank} aria-hidden="true">
        {pad(rank)}
        <span>/ {pad(total)}</span>
      </p>
      <h3 className={styles.name}>
        <T value={country} />
      </h3>
      {nativeName ? (
        <p className={styles.local} lang={nativeName.lang}>
          {nativeName.text}
        </p>
      ) : null}
      {upcoming ? (
        <p className={styles.next}>
          <T k="createur.voyage.next" />
        </p>
      ) : dates ? (
        <p className={styles.when}>{dates.label}</p>
      ) : null}
      {series ? (
        <p className={styles.series}>
          <SeriesLine line={series} />
        </p>
      ) : null}
      {media ? <EscaleMedia media={media} country={country} /> : null}
      {upcoming ? (
        <Button href={ROUTES.voyage} icon="arrow-right" className={styles.door} {...passageAttributes("voyage")}>
          <T k="createur.voyage.door" />
        </Button>
      ) : null}
    </li>
  );
}
