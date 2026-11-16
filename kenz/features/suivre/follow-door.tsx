/**
 * Une porte de « Me suivre » : l'arche (l'ambiance de l'univers), le nom en grand, l'accroche, les comptes en icônes
 * et « Entrer dans… ». Toute la composition mène à la page de l'univers (lien étendu) ; les icônes restent cliquables
 * par-dessus. Au survol ou au focus, l'univers s'anime : la Terre de verre se lève (voyage), l'arche s'allume en vert
 * (sport).
 */
import Image from "next/image";
import Link from "next/link";

import { passageAttributes } from "@/content/site";
import { Arch } from "@/design-system/components/arch";
import { Icon } from "@/design-system/components/icon";
import { Reveal } from "@/design-system/components/reveal";
import { SocialLinks } from "@/design-system/components/social-links";
import { T } from "@/i18n/text";
import type { FollowDoorConfig } from "./doors";
import styles from "./suivre-section.module.css";

export function FollowDoor({ door, index }: { door: FollowDoorConfig; index: number }) {
  const { key, socials, href, passage, background } = door;
  const text = `createur.follow.${key}` as const;
  return (
    <Reveal variant="card" index={index} className={key === "sport" ? styles.slotSport : undefined}>
      <article className={`${styles.door} ${styles[key]}`} data-porte={key}>
        <Arch ratio={0.72} className={styles.view} aria-hidden="true">
          <div className={styles.viewIn}>
            <Image
              className={styles.backdrop}
              src={background.src}
              alt=""
              width={background.width}
              height={background.height}
              sizes="(min-width: 1000px) 280px, 180px"
            />
            {key === "voyage" ? (
              <>
                <Image
                  className={`${styles.globe} ${styles.globeNight}`}
                  src="/assets/terre/globe-nuit.webp"
                  alt=""
                  width={1024}
                  height={1024}
                  sizes="(min-width: 1000px) 420px, 270px"
                />
                <Image
                  className={`${styles.globe} ${styles.globeDay}`}
                  src="/assets/terre/globe-jour.webp"
                  alt=""
                  width={1024}
                  height={1024}
                  sizes="(min-width: 1000px) 420px, 270px"
                />
              </>
            ) : (
              <span className={styles.km}>
                <b>
                  <T k="createur.follow.sport.kmValue" />
                </b>
                <T k="createur.follow.sport.kmUnit" />
              </span>
            )}
          </div>
        </Arch>
        <div className={styles.headline}>
          <p className={styles.who}>
            <T k={`${text}.who`} />
          </p>
          <h3 className={styles.name}>
            <T k={`${text}.title`} />
          </h3>
        </div>
        <div className={styles.body}>
          <p className={styles.line}>
            <T k={`${text}.line`} />
          </p>
          <SocialLinks universe={socials} label={{ k: `${text}.accounts` }} size="sm" className={styles.links} />
          <p className={styles.note}>
            <T k={`${text}.note`} />
          </p>
          <Link className={styles.enter} href={href} {...passageAttributes(passage)} data-source={`[data-porte="${key}"]`}>
            <span>
              <T k={`${text}.enter`} />
            </span>
            <i aria-hidden="true">
              <Icon name="arrow-right" />
            </i>
          </Link>
        </div>
      </article>
    </Reveal>
  );
}
