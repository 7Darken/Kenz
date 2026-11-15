"use client";

/**
 * « Et chez vous ? » (maquettes/v6/shared/ia.js, `chezVous`) : de grandes cartes, un besoin de tous les jours
 * chacune ; au choix, une réponse simple (ce que la machine ferait, ce qui reste à vous) et l'action vers le contact.
 * La réponse tient la dernière case de la grille ; sur téléphone, elle se glisse sous la carte touchée.
 */
import { useId, useState, type MouseEvent } from "react";

import { IA_NEEDS } from "@/content/ia";
import { Button } from "@/design-system/components/button";
import { useMotion } from "@/features/motion/motion-provider";
import { useMediaQuery } from "@/features/motion/use-media-query";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { IaPictogram } from "./ia-picto";
import styles from "./ia-needs.module.css";

/** La section du formulaire de contact de la page (ids attendus par la nav : voir CONVENTIONS.md). */
const CONTACT_ID = "contact";

export function IaNeeds() {
  const { t, lang } = useLanguage();
  const { scrollTo } = useMotion();
  const answerId = useId();
  const single = useMediaQuery("(max-width: 719px)");
  const [chosen, setChosen] = useState(-1);
  // Chaque choix rejoue l'apparition de la réponse, même sur la même carte.
  const [round, setRound] = useState(0);
  const n = t.agents.needs;
  const need = IA_NEEDS[chosen];

  const choose = (index: number) => {
    setChosen(index);
    setRound((value) => value + 1);
  };

  // Le lien garde son ancre (sans JS, il marche) ; avec JS, le défilement doux et le focus du formulaire.
  const toContact = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(CONTACT_ID);
    if (!target) return;
    event.preventDefault();
    scrollTo(target);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => target.focus({ preventScroll: true }), reduced ? 0 : 900);
  };

  const answer = (
    <div
      key="answer"
      className={styles.answer}
      id={answerId}
      role="region"
      aria-live="polite"
      aria-label={n.region}
      data-chosen={need ? "" : undefined}
    >
      <div key={round} className={styles.answerCore} data-in={need ? "" : undefined}>
        {need ? (
          <>
            <p className={styles.label}>{n.machineDoes}</p>
            <p className={styles.text}>{localize(need.machineDoes, lang)}</p>
            <p className={styles.label}>{n.leftToYou}</p>
            <p className={styles.text}>{localize(need.leftToYou, lang)}</p>
            <Button href={`#${CONTACT_ID}`} icon="arrow-right" className={styles.cta} onClick={toContact}>
              {n.cta}
            </Button>
          </>
        ) : (
          <p className={styles.prompt}>{n.prompt}</p>
        )}
      </div>
    </div>
  );
  const cards = IA_NEEDS.map((item, index) => (
    <button
      key={index}
      className={styles.need}
      type="button"
      aria-expanded={index === chosen}
      aria-controls={answerId}
      data-on={index === chosen ? "" : undefined}
      onClick={() => choose(index)}
    >
      <span className={styles.picto}>
        <IaPictogram name={item.picto} />
      </span>
      <span className={styles.needText}>{localize(item.need, lang)}</span>
    </button>
  ));
  // Sur téléphone, la réponse se glisse sous la carte touchée ; sinon, elle tient la dernière case (même nœud, déplacé).
  cards.splice(single && need ? chosen + 1 : cards.length, 0, answer);

  return <div className={styles.grid}>{cards}</div>;
}
