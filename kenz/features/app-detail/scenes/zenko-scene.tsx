"use client";

/**
 * Zenko : le curseur du budget glisse de 40 € à 25 €, et le matin, l'après-midi et le soir se recomposent (exemple).
 * La mini-animation est celle de features/zenko-demo (partagée avec la fiche de l'accueil Pro) ; ici, son habillage
 * d'écran et son tempo.
 */
import type { App } from "@/content/apps";
import { ZenkoDemo, zenkoTimeline, type ZenkoSkin } from "@/features/zenko-demo";
import { useTranslation } from "@/i18n/language-provider";
import kit from "./scene.module.css";
import type { SceneBuilder } from "./scene-kit";
import { HowItWorks } from "../how-it-works";
import styles from "./zenko-scene.module.css";

const SKIN: ZenkoSkin = {
  budget: styles.budget,
  head: styles.head,
  label: styles.label,
  value: styles.value,
  rollWindow: kit.rollW,
  roll: `${kit.roll} ${styles.roll}`,
  track: styles.track,
  fill: styles.fill,
  knobWrap: styles.knobWrap,
  knob: styles.knob,
  ends: styles.ends,
  day: styles.day,
  card: styles.card,
  act: styles.act,
  icon: styles.icon,
  iconBefore: styles.iconBefore,
  text: styles.text,
  when: styles.when,
  cost: styles.cost,
};

function ZenkoScene() {
  return <ZenkoDemo texts={useTranslation().apps.scenes.zenko} skin={SKIN} />;
}

const buildZenko: SceneBuilder = (el) => zenkoTimeline(el, 0.2).pause();

/** « Comment ça marche » de Zenko, monté autour de son écran (chargé à part : ./registry). */
export default function ZenkoChapter({ app }: { app: App }) {
  return (
    <HowItWorks app={app} build={buildZenko} tint={styles.scene} sample={"bottom"}>
      <ZenkoScene />
    </HowItWorks>
  );
}
