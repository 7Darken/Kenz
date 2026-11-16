"use client";

/**
 * Le fil de la lecture, monté une fois par univers (layout) : le rail fixe et ses nœuds (un par chapitre)
 * sur grand écran, un filet de progression en haut ailleurs, et le trait qui descend en haut de chaque
 * chapitre (révélé ici, sauf au premier). Les chapitres viennent de <Section> ([data-chapitre]).
 */
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { remeasureChapters, subscribeChapters } from "../lib/chapters";
import styles from "./fil.module.css";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function Fil() {
  const railRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const rail = railRef.current;
    const nodesBox = nodesRef.current;
    const progress = progressRef.current;
    if (!rail || !nodesBox || !progress) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let nodes: HTMLElement[] = [];
    let starts: number[] = [];
    let traits: HTMLElement[] = [];
    /** Haut (dans la page) et hauteur de chaque trait, mesurés avec les chapitres : rien à lire pendant le défilement. */
    let traitBoxes: { top: number; height: number }[] = [];
    let drawn: number[] = [];
    let raf = 0;

    // Les traits se dessinent avec un léger retard sur le défilement (lissage), jusqu'au repos.
    const drawTraits = () => {
      raf = 0;
      const vh = window.innerHeight;
      let moving = false;
      const y = window.scrollY;
      traits.forEach((trait, index) => {
        const box = traitBoxes[index];
        if (!box?.height) return;
        const target = clamp01((vh * 0.94 - (box.top - y)) / (vh * 0.46 + box.height));
        let value = reduced.matches ? target : drawn[index] + (target - drawn[index]) * 0.2;
        if (Math.abs(target - value) < 0.002) value = target;
        else moving = true;
        if (value !== drawn[index]) {
          drawn[index] = value;
          trait.style.setProperty("--dp", value.toFixed(3));
        }
      });
      if (moving) raf = requestAnimationFrame(drawTraits);
    };

    const unsubscribe = subscribeChapters({
      onMeasure(boxes) {
        rail.style.setProperty("--rh", `${rail.offsetHeight}px`);
        starts = boxes.map((box) => box.start);
        nodesBox.replaceChildren(
          ...starts.map((start) => {
            const node = document.createElement("i");
            node.className = styles.node;
            node.style.top = `${(start * 100).toFixed(3)}%`;
            return node;
          }),
        );
        nodes = Array.from(nodesBox.children) as HTMLElement[];
        rail.toggleAttribute("data-on", boxes.length > 1);
        traitBoxes = [];
        traits = boxes.flatMap((box, index) => {
          const trait = box.el.querySelector<HTMLElement>(":scope > [data-fil-trait]");
          if (!trait) return [];
          trait.hidden = index === 0;
          // Le trait se place par rapport à son chapitre : on retire le décalage du chapitre dans l'écran,
          // pour qu'il tombe sur --fil-x, dans l'axe exact du rail.
          trait.style.setProperty("--fil-offset", `${box.el.getBoundingClientRect().left}px`);
          if (index === 0) return [];
          // Sa place dans la page : le haut du chapitre (son espaceur s'il est épinglé) plus son décalage dans le chapitre.
          traitBoxes.push({ top: box.top + trait.offsetTop, height: trait.offsetHeight });
          return [trait];
        });
        drawn = traits.map((_, index) => drawn[index] ?? (reduced.matches ? 1 : 0));
      },
      onFrame({ progress: p }) {
        const fp = p.toFixed(4);
        rail.style.setProperty("--fp", fp);
        progress.style.setProperty("--fp", fp);
        nodes.forEach((node, index) => node.toggleAttribute("data-lit", p >= starts[index] - 0.002));
        if (!raf) raf = requestAnimationFrame(drawTraits);
      },
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
    };
  }, []);

  // Nouvelle page : nouveaux chapitres.
  useEffect(() => {
    remeasureChapters();
  }, [pathname]);

  return (
    <>
      <div ref={railRef} className={styles.rail} aria-hidden="true">
        <i className={styles.fill} />
        <span ref={nodesRef} className={styles.nodes} />
        <i className={styles.head} />
      </div>
      <i ref={progressRef} className={styles.progress} aria-hidden="true" />
    </>
  );
}
