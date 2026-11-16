/**
 * Le hero partagé (pro.html A0, createur.html C0) : du fond vers l'avant, le paysage de Kuala Lumpur et son voile,
 * le calque `behind` (côté Créateur : l'horizon de la Terre), puis la scène (objets 3D, halo, arche de lumière,
 * portrait détouré) et le texte (« Kenz. », la phrase, le lien vers le premier chapitre).
 * Composant serveur ; l'arrivée et le défilement sont pilotés par <HeroDirector> (client). Contrat : ./index.ts.
 */
import Image from "next/image";
import type { ReactNode } from "react";

import { Icon } from "@/design-system/components/icon";
import { Section } from "@/design-system/components/section";
import { T } from "@/i18n/text";
import { HeroArch } from "./hero-arch";
import { HeroDepth } from "./hero-depth";
import { HeroDirector } from "./hero-director";
import { HeroLine } from "./hero-line";
import { HeroPortrait } from "./hero-portrait";
import { HERO_VARIANTS, type HeroVariant } from "./hero-variants";
import styles from "./hero.module.css";

export interface HeroProps {
  variant: HeroVariant;
  /** Un calque entre le paysage et l'arche (ex. l'horizon de la Terre côté Créateur). */
  behind?: ReactNode;
}

const TITLE_ID = "hero-title";

export function Hero({ variant, behind }: HeroProps) {
  const config = HERO_VARIANTS[variant];

  return (
    <Section id="top" aura="droite" fil="none" className={`${styles.hero} ${styles[variant]}`} aria-labelledby={TITLE_ID}>
      <HeroDirector variant={variant}>
        <div className={styles.bg} data-hero-bg="" aria-hidden="true">
          <div className={styles.bgIn}>
            <Image
              className={styles.land}
              src={config.landscape.src}
              alt=""
              width={config.landscape.width}
              height={config.landscape.height}
              sizes="108vw"
              priority
            />
            <i className={styles.wash} />
          </div>
          {/* Créateur : le voile suit le paysage (il glisse et s'efface avec lui, sous l'horizon de la Terre). */}
          {variant === "createur" ? <i className={styles.shade} /> : null}
        </div>
        {/* Pro : le voile passe sur le portrait (son haut s'assombrit, son bas fond dans la page). */}
        {variant === "pro" ? <div className={styles.shade} aria-hidden="true" /> : null}
        {behind !== undefined ? <div className={styles.behind}>{behind}</div> : null}

        <div className={styles.layout}>
          <div className={styles.copy} data-hero-copy="">
            <h1 className={styles.title} id={TITLE_ID} data-hero-avoid="">
              <span className={`${styles.ttl} ${styles.ttlMain}`}>
                <T k={config.title} />
                <span className={styles.dot} aria-hidden="true" />
              </span>
              <span className={`${styles.ttl} ${styles.ttlGhost}`} aria-hidden="true">
                <T k={config.title} />
                <span className={styles.dot} />
              </span>
            </h1>
            <HeroLine textKey={config.line} className={styles.line} />
            <a className={styles.down} href={`#${config.next}`} data-hero-avoid="">
              <span className={styles.downIco} aria-hidden="true">
                <Icon name="arrow-down" />
              </span>
              <T k={config.down} />
            </a>
          </div>

          <div className={styles.stage}>
            <div className={styles.scene} data-hero-scene="">
              <HeroDepth variant={variant} />
              <i className={styles.glow} aria-hidden="true" />
              <HeroArch className={styles.arch} />
              <div className={styles.fig} data-hero-fig="">
                <HeroPortrait image={config.portrait} altKey={config.portraitAlt} className={styles.portrait} />
              </div>
            </div>
          </div>
        </div>
      </HeroDirector>
    </Section>
  );
}
