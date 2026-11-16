"use client";

/**
 * La mini-animation de Zenko au format téléphone, dans la fiche (shared/apps.js, SC.zenko) : celle de
 * features/zenko-demo (partagée avec « Comment ça marche »), avec l'habillage de la fiche et la mention « exemple ».
 * Décorative (la fiche est aria-hidden). ./space-preview la joue en boucle.
 */
import { ZenkoDemo, type ZenkoSkin } from "@/features/zenko-demo";
import { useTranslation } from "@/i18n/language-provider";
import styles from "./zenko-scene.module.css";

const SKIN: ZenkoSkin = {
  head: styles.head,
  label: styles.label,
  logo: styles.logo,
  value: styles.value,
  rollWindow: styles.rollWindow,
  roll: styles.roll,
  track: styles.track,
  fill: styles.fill,
  knobWrap: styles.knobWrap,
  knob: styles.knob,
  ends: styles.ends,
  day: styles.day,
  card: styles.card,
  act: styles.act,
  moment: styles.moment,
  text: styles.txt,
  when: styles.when,
  cost: styles.cost,
};

export function ZenkoScene() {
  const s = useTranslation().pro.space.scene;
  return (
    <div className={styles.scene} aria-hidden="true">
      <div className={styles.col}>
        <ZenkoDemo texts={s} skin={SKIN} />
      </div>
      <span className={styles.example}>{s.example}</span>
    </div>
  );
}
