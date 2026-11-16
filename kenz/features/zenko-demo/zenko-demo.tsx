/**
 * La mini-animation de Zenko, une seule fois pour tout le site : le budget glisse de 40 à 25, et le matin,
 * l'après-midi et le soir se recomposent, moins chers (données d'exemple : content/app-scenes.ts). Le biscuit (le
 * logo) et les pictogrammes des moments sont ceux de l'app.
 * Deux habillages la montent : la fiche de l'accueil Pro (features/apps-space) et « Comment ça marche »
 * (features/app-detail). Chacun passe ses classes (`skin`) et ses textes ; ./zenko-timeline la joue.
 * Composant pur : l'état final est celui du CSS de l'habillage.
 */
import Image from "next/image";
import type { CSSProperties } from "react";

import { ZENKO_SAMPLE } from "@/content/app-scenes";

/** Les classes d'un habillage (CSS Module de la fiche ou de la scène). `budget` : le bloc du curseur, s'il a un style. */
export interface ZenkoSkin {
  budget?: string;
  head: string;
  /** Le libellé du budget, avec le logo devant. */
  label: string;
  logo: string;
  value: string;
  rollWindow: string;
  roll: string;
  track: string;
  fill: string;
  knobWrap: string;
  knob: string;
  ends: string;
  day: string;
  card: string;
  act: string;
  moment: string;
  text: string;
  when: string;
  cost: string;
}

/** Les textes (`apps.scenes.zenko` ou `pro.space.scene`). `amount` : « {n} € », l'unité reste en petit. */
export interface ZenkoTexts {
  budget: string;
  amount: string;
  min: string;
  max: string;
  morning: string;
  afternoon: string;
  evening: string;
}

export function ZenkoDemo({ texts, skin }: { texts: ZenkoTexts; skin: ZenkoSkin }) {
  // La devise autour du montant, selon la langue (« 40 € », « €40 ») : plus petite que le chiffre.
  const [before = "", after = ""] = texts.amount.split("{n}");
  return (
    <>
      <div className={skin.budget}>
        <div className={skin.head}>
          <span className={skin.label}>
            <Image className={skin.logo} src={ZENKO_SAMPLE.logo.src} width={ZENKO_SAMPLE.logo.width} height={ZENKO_SAMPLE.logo.height} alt="" sizes="40px" />
            {texts.budget}
          </span>
          <span className={skin.value}>
            {before.trim() ? <small>{before.trim()}</small> : null}
            <span className={skin.rollWindow}>
              <span className={skin.roll} data-zk-roll="">
                {ZENKO_SAMPLE.budget.map((n) => (
                  <b key={n}>{n}</b>
                ))}
              </span>
            </span>
            {after.trim() ? <small>{after.trim()}</small> : null}
          </span>
        </div>
        <div className={skin.track}>
          <i className={skin.fill} data-zk-fill="" />
          <span className={skin.knobWrap} data-zk-knobwrap="">
            <i className={skin.knob} data-zk-knob="" />
          </span>
        </div>
        <div className={skin.ends}>
          <span>{texts.min}</span>
          <span>{texts.max}</span>
        </div>
      </div>
      <ol className={skin.day}>
        {ZENKO_SAMPLE.moments.map(({ key, icon, share }) => (
          <li
            key={key}
            className={skin.card}
            data-zk-card=""
            data-before={share.before}
            data-after={share.after}
            style={{ "--c2": share.after } as CSSProperties}
          >
            <span className={skin.act} data-zk-act="">
              <Image className={skin.moment} src={icon.src} width={icon.width} height={icon.height} alt="" sizes="48px" />
            </span>
            <span className={skin.text}>
              <span className={skin.when}>{texts[key]}</span>
              <span className={skin.cost}>
                <i data-zk-cost="" />
              </span>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
