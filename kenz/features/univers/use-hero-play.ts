"use client";

/**
 * Le moment de jouer l'arrivée d'une page d'univers (voyage.html, sport.html) : après le voile du passage
 * quand on vient d'une autre page (`porte` : une entrée plus courte), sinon une fois les polices prêtes
 * (deux images plus tard, au plus 700 ms après le montage).
 */
import { useEffect, useState } from "react";

import { usePassageArrival } from "@/features/passages";

export function useHeroPlay(): { played: boolean; porte: boolean } {
  const arrival = usePassageArrival();
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let raf = 0;
    const go = () => {
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => setFontsReady(true));
      });
    };
    const timer = window.setTimeout(go, 700);
    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      window.clearTimeout(timer);
      go();
    });
    return () => {
      alive = false;
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  const porte = arrival.via !== null;
  return { played: porte ? arrival.ready : fontsReady, porte };
}
