"use client";

/**
 * La phrase du problème : ses mots s'allument un à un au défilement (de .12 à 1). En mouvement réduit,
 * la phrase monte mot à mot à l'entrée à l'écran, en fondu (comme les autres phrases du site).
 */
import { Fragment, useRef } from "react";

import { Rich } from "@/design-system/components/rich";
import { Words } from "@/design-system/components/words";
import { gsap } from "@/features/motion/gsap";
import { useGsap } from "@/features/motion/use-gsap";
import { useReducedMotion } from "@/features/motion/use-reduced-motion";
import type { Localized } from "@/i18n/localize";
import { useText } from "@/i18n/text";
import styles from "./problem.module.css";

interface ProblemTitleProps {
  id: string;
  text: Localized<string>;
  className: string;
}

export function ProblemTitle({ id, text, className }: ProblemTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const resolved = useText(text);

  useGsap(
    () => {
      const title = ref.current;
      if (reduced || !title) return;
      gsap.fromTo(
        title.querySelectorAll(`.${styles.scrubWord}`),
        { opacity: 0.12 },
        { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: title, start: "top 80%", end: "bottom 42%", scrub: 0.6 } },
      );
    },
    ref,
    [reduced, resolved],
  );

  if (reduced) return <Words as="h2" id={id} className={className} text={text} glow />;

  // On coupe sur les espaces ordinaires ; un mot mis en valeur garde sa ponctuation (« *jamais*. »).
  const words = resolved.split(/ +/);
  return (
    <h2 ref={ref} id={id} className={className}>
      {words.map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? " " : null}
          <span className={styles.scrubWord}>
            <Rich text={word} glow />
          </span>
        </Fragment>
      ))}
    </h2>
  );
}
