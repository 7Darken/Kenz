/**
 * La mini-animation de Zenko, une seule fois pour tout le site : le budget glisse de 40 à 25, et le matin,
 * l'après-midi et le soir se recomposent avec des activités moins chères (données d'exemple : content/app-scenes.ts).
 * Deux habillages la montent : la fiche de l'accueil Pro (features/apps-space) et « Comment ça marche »
 * (features/app-detail). Chacun passe ses classes (`skin`) et ses textes ; ./zenko-timeline la joue.
 * Composant pur : l'état final est celui du CSS de l'habillage.
 */
import type { CSSProperties } from "react";

import { ZENKO_SAMPLE, type ZenkoMoment } from "@/content/app-scenes";

/** Les pictos au trait de chaque moment : l'activité d'avant, puis la moins chère. */
const ICONS: Readonly<Record<ZenkoMoment["key"], readonly [before: string, after: string]>> = {
  morning: [
    "M5 16.5h14M4.5 16.5v-3.2l1.8-4.6a2 2 0 0 1 1.9-1.2h7.6a2 2 0 0 1 1.9 1.2l1.8 4.6v3.2M7 16.5v2M17 16.5v2M7.5 13h.01M16.5 13h.01",
    "M8.5 4.5c1.6 0 2.5 1.6 2.5 3.6S10 12 8.5 12 6 10.1 6 8.1s.9-3.6 2.5-3.6zM7.8 14.5h1.6M15.5 9.5c1.6 0 2.5 1.6 2.5 3.6S17 17 15.5 17 13 15.1 13 13.1s.9-3.6 2.5-3.6zM14.8 19.5h1.6",
  ],
  afternoon: [
    "M3.5 9 12 4.5 20.5 9M5.5 9.5v7M10 9.5v7M14 9.5v7M18.5 9.5v7M3.5 19.5h17",
    "M12 20.5V15M12 15c-3.6 0-5.5-2.3-5.5-5S8.9 4 12 4s5.5 3.3 5.5 6-1.9 5-5.5 5z",
  ],
  evening: [
    "M4 16.5h16M5.5 16.5a6.5 6.5 0 0 1 13 0M12 10V8M10.5 8h3M3.5 19.5h17",
    "M4 12.5h16a8 8 0 0 1-16 0zM13.5 4l-3 6.5M18 5l-5 5.5",
  ],
};

/** Les classes d'un habillage (CSS Module de la fiche ou de la scène). `budget` : le bloc du curseur, s'il a un style. */
export interface ZenkoSkin {
  budget?: string;
  head: string;
  label: string;
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
  icon: string;
  iconBefore: string;
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
          <span className={skin.label}>{texts.budget}</span>
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
        {ZENKO_SAMPLE.moments.map(({ key, share }) => (
          <li
            key={key}
            className={skin.card}
            data-zk-card=""
            data-before={share.before}
            data-after={share.after}
            style={{ "--c2": share.after } as CSSProperties}
          >
            <span className={skin.act}>
              {ICONS[key].map((d, i) => (
                <svg
                  key={d}
                  className={i === 0 ? `${skin.icon} ${skin.iconBefore}` : skin.icon}
                  data-zk-icon={i === 0 ? "before" : "after"}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d={d} />
                </svg>
              ))}
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
