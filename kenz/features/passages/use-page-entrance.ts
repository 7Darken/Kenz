"use client";

/**
 * Le moment de jouer l'entrée d'une page (son hero, sa nav) : une seule règle pour tout le site.
 * - Après un passage : quand le voile se lève (`ready`), une image plus tard ; `maxWait` borne l'attente.
 * - Sinon, avec `waitFonts` : une fois les polices prêtes (le titre se mesure juste), 0,7 s au plus, deux images plus tard.
 * - Sinon : une image après le montage, puis `delay` ms.
 * L'entrée vaut pour le chemin courant : un composant qui reste monté d'une page à l'autre (la nav) la rejoue.
 */
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { PassageKind } from "./passage-state";
import { usePassageArrival } from "./use-passage-arrival";

/** Sans passage, on n'attend pas les polices plus longtemps (comme la maquette). */
const FONTS_MAX_MS = 700;

export interface PageEntranceOptions {
  /** Faux : rien à jouer, l'entrée est faite tout de suite. */
  enabled?: boolean;
  /** Sans passage : attendre les polices. */
  waitFonts?: boolean;
  /** Sans passage ni polices : le délai après la première image (ms). */
  delay?: number;
  /** Après un passage : l'entrée se joue au plus tard `maxWait` ms après l'arrivée, même si le voile tarde. */
  maxWait?: number;
}

export interface PageEntrance {
  /** Vrai quand l'entrée se joue. */
  entered: boolean;
  /** Comment on est arrivé (null : chargement ou lien ordinaire) : l'entrée est plus courte après un passage. */
  via: PassageKind | null;
  /** Faux tant que le voile d'un passage couvre la page. */
  ready: boolean;
}

export function usePageEntrance({ enabled = true, waitFonts = false, delay = 0, maxWait }: PageEntranceOptions = {}): PageEntrance {
  const pathname = usePathname();
  const { via, ready } = usePassageArrival();
  const [enteredPath, setEnteredPath] = useState<string | null>(null);
  const entered = !enabled || enteredPath === pathname;

  useEffect(() => {
    if (entered) return;
    let dead = false;
    let frame = 0;
    const timers: number[] = [];
    const enter = () => {
      if (!dead) setEnteredPath(pathname);
    };

    if (via !== null) {
      if (ready) frame = requestAnimationFrame(enter);
      else if (maxWait !== undefined) timers.push(window.setTimeout(enter, maxWait));
    } else if (waitFonts) {
      let started = false;
      const go = () => {
        if (started || dead) return;
        started = true;
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(enter);
        });
      };
      timers.push(window.setTimeout(go, FONTS_MAX_MS));
      void document.fonts?.ready.then(go);
    } else {
      frame = requestAnimationFrame(() => {
        if (delay > 0) timers.push(window.setTimeout(enter, delay));
        else enter();
      });
    }

    return () => {
      dead = true;
      timers.forEach(window.clearTimeout);
      cancelAnimationFrame(frame);
    };
  }, [entered, pathname, via, ready, waitFonts, delay, maxWait]);

  return { entered, via, ready };
}
