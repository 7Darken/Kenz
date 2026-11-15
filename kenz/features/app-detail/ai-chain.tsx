"use client";

/**
 * La chaîne de l'IA (ou les étapes de « Mon rôle ») : un fil lumineux qui se trace au défilement, chaque étape
 * s'allume quand il l'atteint ; l'étape faite par un modèle d'IA porte une étincelle. Mouvement réduit :
 * tout est allumé, rien ne bouge.
 */
import { useRef, type CSSProperties } from "react";

import type { AppStep } from "@/content/apps";
import { ScrollTrigger } from "@/features/motion/gsap";
import { useGsap } from "@/features/motion/use-gsap";
import { useReducedMotion } from "@/features/motion/use-reduced-motion";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./ai-chapter.module.css";
import { RoleIllustration } from "./role-illustrations";

const SPARK =
  "M8 1.2c.4 3.2 1.6 4.4 4.8 4.8-3.2.4-4.4 1.6-4.8 4.8-.4-3.2-1.6-4.4-4.8-4.8C6.4 5.6 7.6 4.4 8 1.2zM12.6 10.4c.2 1.4.7 1.9 2.1 2.1-1.4.2-1.9.7-2.1 2.1-.2-1.4-.7-1.9-2.1-2.1 1.4-.2 1.9-.7 2.1-2.1z";

interface AiChainProps {
  steps: readonly AppStep[];
  /** Avec les dessins de « Mon rôle ». */
  illustrated?: boolean;
}

export function AiChain({ steps, illustrated = false }: AiChainProps) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { lang } = useLanguage();

  useGsap(
    () => {
      const chain = ref.current;
      if (reduced || !chain) return;
      const items = Array.from(chain.children);
      const n = items.length;
      const update = (self: ScrollTrigger) => {
        const p = self.progress;
        chain.style.setProperty("--cp", p.toFixed(3));
        items.forEach((item, i) => item.toggleAttribute("data-lit", p >= 0.04 + (i / Math.max(1, n - 1)) * 0.88));
      };
      chain.setAttribute("data-driven", "");
      chain.style.setProperty("--cp", "0");
      ScrollTrigger.create({ trigger: chain, start: "top 78%", end: "bottom 52%", scrub: 0.5, onUpdate: update, onRefresh: update });
      return () => {
        chain.removeAttribute("data-driven");
        chain.style.removeProperty("--cp");
        items.forEach((item) => item.removeAttribute("data-lit"));
      };
    },
    ref,
    [reduced, steps],
  );

  return (
    <ol ref={ref} className={styles.chain} style={{ "--n": steps.length } as CSSProperties}>
      {steps.map((step, index) => (
        <li key={index} className={step.ai ? `${styles.step} ${styles.isAi}` : styles.step}>
          <span className={styles.node} aria-hidden="true">
            {step.ai ? (
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
                <path d={SPARK} />
              </svg>
            ) : null}
          </span>
          {illustrated ? (
            <span className={styles.ill} aria-hidden="true">
              <RoleIllustration index={index} />
            </span>
          ) : null}
          <p>{localize(step.text, lang)}</p>
        </li>
      ))}
    </ol>
  );
}
