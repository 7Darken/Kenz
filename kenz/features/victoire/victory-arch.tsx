/**
 * Temps 3 : le couloir d'arches (la porte du hero, répétée), la dernière étant le cadre de la photo des bras
 * levés (en paysage, haut arrondi, 3:2), sa couronne de lauriers en étoiles, les étoiles filantes, les deux
 * petits tirages posés sur le bord du cadre (la loupe les grossit), l'éclat et ses étincelles.
 */
import Image from "next/image";
import type { CSSProperties } from "react";

import type { ImageAsset } from "@/content/types";
import styles from "./victoire.module.css";
import { CROWN, CROWN_BOX, DOORS, SPARKS } from "./victoire-geometry";

interface Photo {
  image: ImageAsset;
  alt: string;
}

interface VictoryArchProps {
  win: Photo;
  team: Photo;
  check: Photo;
  credit: string;
}

const STAR_CLASS = { "": styles.st, haut: `${styles.st} ${styles.stTop}`, feuille: `${styles.st} ${styles.stLeaf}` } as const;

export function VictoryArch({ win, team, check, credit }: VictoryArchProps) {
  return (
    <div className={styles.portal}>
      <span className={styles.doors} aria-hidden="true" data-kv="doors">
        {Array.from({ length: DOORS }, (_, i) => (
          <i key={i} className={styles.door} data-kv="door" />
        ))}
      </span>
      <figure className={styles.arch} data-kv="arch">
        <i className={styles.archHalo} aria-hidden="true" data-kv="halo" />
        <i className={styles.archLum} aria-hidden="true" data-kv="lum" />
        <span className={styles.archIn} data-kv="arch-in">
          <Image
            className={styles.archImg}
            src={win.image.src}
            width={win.image.width}
            height={win.image.height}
            alt={win.alt}
            sizes="(min-width: 900px) 61vw, 100vw"
            data-kv="arch-img"
          />
          <i className={styles.ray} aria-hidden="true" data-kv="ray" />
        </span>
        <figcaption className={styles.credit} data-kv="credit">
          {credit}
        </figcaption>
      </figure>
      <span className={styles.cons} aria-hidden="true">
        <svg className={styles.consLinks} viewBox={`0 0 ${CROWN_BOX.w} ${CROWN_BOX.h}`} focusable="false" data-kv="links">
          {CROWN.links.map(([a, b], i) => {
            const from = CROWN.stars[a];
            const to = CROWN.stars[b];
            return from && to ? (
              <line
                key={i}
                pathLength={1}
                x1={from.x.toFixed(2)}
                y1={from.y.toFixed(2)}
                x2={to.x.toFixed(2)}
                y2={to.y.toFixed(2)}
                data-outer={to.outer ? "" : undefined}
              />
            ) : null;
          })}
        </svg>
        {CROWN.stars.map((star, n) => (
          <i
            key={n}
            className={STAR_CLASS[star.kind]}
            data-kv="star"
            data-outer={star.outer ? "" : undefined}
            style={
              {
                left: `${((star.x / CROWN_BOX.w) * 100).toFixed(2)}%`,
                top: `${((star.y / CROWN_BOX.h) * 100).toFixed(2)}%`,
                "--d": `${(2.4 + ((n * 37) % 17) / 10).toFixed(2)}s`,
                "--dd": `-${(((n * 53) % 23) / 10).toFixed(2)}s`,
              } as CSSProperties
            }
          >
            <b className={styles.twinkle} />
          </i>
        ))}
        <i className={`${styles.shoot} ${styles.shoot1}`} data-kv="shoot" />
        <i className={`${styles.shoot} ${styles.shoot2}`} data-kv="shoot" />
        <i className={`${styles.shoot} ${styles.shoot3}`} data-kv="shoot" />
      </span>
      <span className={styles.prints}>
        <figure className={`${styles.print} ${styles.printTeam}`} data-kv="print-team">
          <span className={styles.printImg} data-loupe="">
            <Image src={team.image.src} width={team.image.width} height={team.image.height} alt={team.alt} sizes="(min-width: 900px) 180px, 16vw" />
          </span>
        </figure>
        <figure className={`${styles.print} ${styles.printCheck}`} data-kv="print-check">
          <span className={styles.printImg} data-loupe="">
            <Image src={check.image.src} width={check.image.width} height={check.image.height} alt={check.alt} sizes="(min-width: 900px) 270px, 22vw" />
          </span>
        </figure>
      </span>
      <i className={styles.flash} aria-hidden="true" data-kv="flash" />
      <span className={styles.sparks} aria-hidden="true">
        {SPARKS.map((_, i) => (
          <i key={i} data-kv="spark" />
        ))}
      </span>
    </div>
  );
}
