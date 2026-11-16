"use client";

/**
 * Le débord du fond k15ze (`.sport::after`, 22vh au-dessus et au-dessous du chapitre) : caché tant que le chapitre
 * est loin, montré quand il approche (à 60 % d'écran). Caché, il n'est pas compté comme un décalage de mise en page
 * quand le chapitre saute d'un coup près de l'écran (le voyage « vu une fois », au-dessus, retire son épinglage) :
 * il apparaît alors en fondu. En défilant, il est montré bien avant d'être à l'écran : rien ne change.
 */
import { useCallback } from "react";

export function SportBleed() {
  const attach = useCallback((node: HTMLSpanElement | null) => {
    const section = node?.closest("section");
    if (!section) return;
    let first = true;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          // Déjà proche au premier regard (chargement sur #sport) : montré tout de suite, sans fondu.
          section.setAttribute("data-near", first ? "now" : "fade");
          io.disconnect();
        }
        first = false;
      },
      { rootMargin: "60% 0px 60% 0px" },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return <span ref={attach} hidden />;
}
