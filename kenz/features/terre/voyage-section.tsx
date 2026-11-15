/**
 * C1 « Le voyage » (#voyage) : le trajet épinglé sur le globe, d'escale en escale, dans l'ordre réel des séries
 * (content/series.ts → ESCALES), jusqu'à la prochaine escale et la porte du voyage.
 * Sans épinglage (mouvement réduit, sans JS) : une liste, et le globe en image fixe sous le titre.
 * À poser sous `<TerreScene>`, après le hero qui porte `TerreLayer`.
 */
import Image from "next/image";

import { ESCALE_IDS, ESCALES } from "@/content/series";
import { Reveal } from "@/design-system/components/reveal";
import { T } from "@/i18n/text";
import { EscaleCard } from "./escale-card";
import { SweepTitle } from "./sweep-title";
import { VoyageJourney } from "./voyage-journey";
import styles from "./voyage-section.module.css";

const TITLE_ID = "voyage-t";
/** Les pays déjà filmés (la prochaine escale n'en est pas un). */
const FILMED = ESCALE_IDS.filter((id) => !ESCALES[id].upcoming).length;

export function VoyageSection() {
  return (
    <VoyageJourney
      titleId={TITLE_ID}
      head={
        <header className={styles.head} data-voyage-head="">
          <SweepTitle id={TITLE_ID} text={{ k: "createur.voyage.title" }} className={styles.title} />
          <Reveal variant="fade" as="p" className={styles.sub}>
            <T k="createur.voyage.sub" vars={{ count: FILMED }} />
          </Reveal>
          <Image
            className={`${styles.still} ${styles.stillNight}`}
            src="/assets/terre/globe-nuit.webp"
            alt=""
            width={1024}
            height={1024}
            sizes="(max-width: 600px) 74vw, 440px"
          />
          <Image
            className={`${styles.still} ${styles.stillDay}`}
            src="/assets/terre/globe-jour.webp"
            alt=""
            width={1024}
            height={1024}
            sizes="(max-width: 600px) 74vw, 440px"
          />
        </header>
      }
      stops={ESCALE_IDS.map((id, index) => (
        <EscaleCard key={id} escale={ESCALES[id]} rank={index + 1} total={ESCALE_IDS.length} />
      ))}
      route={
        <ol className={styles.route} data-voyage-route="" aria-hidden="true">
          {ESCALE_IDS.map((id) => (
            <li key={id} />
          ))}
        </ol>
      }
    />
  );
}
