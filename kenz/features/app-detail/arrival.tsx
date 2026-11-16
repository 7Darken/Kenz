"use client";

/**
 * 1. L'arrivée sous l'arche (app.html) : la couleur de l'app remplit l'écran, puis se rétracte dans l'icône
 * (ou, pour Escapades Libres, en pilule autour du motif) pendant que le fil dessine l'arche de lumière ;
 * le nom se révèle en balayage, l'accroche monte mot à mot. Au défilement, le tout s'efface doucement.
 * Arrivée par un passage (features/passages) : c'est son voile qui se rétracte dans l'arche, l'icône y est posée ;
 * l'arrivée se joue quand il se lève.
 */
import { useEffect, useRef, useState } from "react";

import type { App } from "@/content/apps";
import { Arch } from "@/design-system/components/arch";
import { EscapadesMark } from "@/design-system/components/escapades-mark";
import { Icon } from "@/design-system/components/icon";
import { Section } from "@/design-system/components/section";
import { Words } from "@/design-system/components/words";
import { shownImage, ThemedImage } from "@/design-system/components/themed-image";
import { gsap } from "@/design-system/motion/gsap";
import { CSS_EASE } from "@/design-system/motion/easings";
import { useGsap } from "@/design-system/motion/use-gsap";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import { usePassageArrival } from "@/features/passages";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import page from "./app-detail.module.css";
import styles from "./arrival.module.css";

const NAME_ID = "app-nom";

/** Le rectangle d'un élément, en `inset()` de l'écran (arrondi selon la forme). */
function rectInset(r: DOMRect, radius: number) {
  const c = (v: number) => Math.max(0, Math.round(v));
  return `inset(${c(r.top)}px ${c(window.innerWidth - r.right)}px ${c(window.innerHeight - r.bottom)}px ${c(r.left)}px round ${radius}px)`;
}

export function Arrival({ app }: { app: App }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const floodRef = useRef<HTMLDivElement>(null);
  const [arrived, setArrived] = useState(false);
  const passage = usePassageArrival();
  const reduced = useReducedMotion();
  const { lang, t } = useLanguage();
  const web = app.kind === "web";

  // Arrivée par un passage : son voile couvre déjà l'écran, la couleur de la page n'a pas à le faire.
  useEffect(() => {
    if (passage.via) floodRef.current?.setAttribute("data-off", "");
  }, [passage.via]);

  // L'arrivée : tout de suite après le premier rendu (ou quand le voile du passage se lève).
  useEffect(() => {
    if (arrived || (passage.via && !passage.ready)) return;
    const flood = floodRef.current;
    let cancelled = false;
    let frame = 0;
    let timer = 0;
    const floodOff = () => {
      flood?.getAnimations().forEach((a) => a.cancel());
      flood?.setAttribute("data-off", "");
    };
    const contract = () => {
      if (!flood || flood.hasAttribute("data-off") || getComputedStyle(flood).display === "none") return floodOff();
      const target = shownImage<HTMLElement>(innerRef.current, "[data-passage-icone]")?.getBoundingClientRect();
      const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (motionReduced || !target?.width) {
        flood.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, fill: "forwards" }).onfinish = floodOff;
        return;
      }
      // La forme d'arrivée : l'icône (coins à 23 %) ou une pilule autour du motif.
      const radius = Math.round(web ? target.height / 2 : target.width * 0.23);
      const shrink = flood.animate([{ clipPath: "inset(0px 0px 0px 0px round 0px)" }, { clipPath: rectInset(target, radius) }], {
        duration: 1050,
        easing: "cubic-bezier(.76,0,.24,1)",
        fill: "forwards",
      });
      shrink.onfinish = () => {
        flood.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: CSS_EASE.expo, fill: "forwards" }).onfinish = floodOff;
      };
    };
    const go = () => {
      if (cancelled) return;
      setArrived(true);
      if (passage.via) floodOff();
      else contract();
    };
    if (passage.via) frame = requestAnimationFrame(go);
    else {
      // La position de l'icône dépend de la police du nom : on l'attend un instant.
      frame = requestAnimationFrame(() => {
        timer = window.setTimeout(() => {
          Promise.race([document.fonts?.ready, new Promise((resolve) => window.setTimeout(resolve, 700))]).then(go, go);
        }, 140);
      });
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [arrived, passage.via, passage.ready, web]);

  // Au défilement, l'arrivée s'efface et remonte un peu.
  useGsap(
    () => {
      const inner = innerRef.current;
      if (reduced || !inner) return;
      gsap.to(inner, {
        yPercent: -9,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: inner.parentElement, start: "top top", end: "bottom top", scrub: true },
      });
    },
    innerRef,
    [reduced],
  );

  const nameText = web ? app.nameLines.map((line) => (
    <span key={line} className={styles.nameLine}>
      {line}
    </span>
  )) : app.name;

  return (
    <>
      <div ref={floodRef} className={styles.flood} aria-hidden="true" />
      <Section
        className={styles.arrival}
        aura="haut"
        aria-labelledby={NAME_ID}
        data-arrived={arrived ? "" : undefined}
      >
        <div className={styles.light} aria-hidden="true" />
        <Arch
          className={styles.arche}
          variant="lumiere"
          trace={{ traced: arrived }}
          traceGap={26}
          traceDuration={2.6}
          floor
          floorOverhang={34}
          aria-hidden="true"
          data-passage-arche=""
        />
        <div ref={innerRef} className={styles.inner}>
          {app.kind === "mobile" ? (
            <ThemedImage
              className={styles.icon}
              src={app.icon.src}
              darkSrc={app.iconDark?.src}
              width={app.icon.width}
              height={app.icon.height}
              alt={app.icon.alt ? localize(app.icon.alt, lang) : ""}
              sizes="150px"
              // Une seule version : préchargée. Deux : chargement différé, la version cachée n'est pas téléchargée.
              priority={!app.iconDark}
              data-passage-icone=""
            />
          ) : (
            <span
              className={`${styles.icon} ${styles.markBox}`}
              role="img"
              aria-label={localize(app.mark.label, lang)}
              data-passage-icone=""
            >
              <EscapadesMark className={page.mark} />
            </span>
          )}
          <h1 className={web ? `${styles.name} ${styles.webName}` : styles.name} id={NAME_ID} tabIndex={-1}>
            <span className={`${styles.title} ${styles.main}`}>{nameText}</span>
          </h1>
          <Words className={web ? `${styles.line} ${styles.webLine}` : styles.line} text={app.story.hook} delay={1.3} play={arrived} />
        </div>
        <a className={styles.cue} href="#probleme" aria-label={t.apps.arrival.scrollDown}>
          <Icon name="arrow-down" />
        </a>
      </Section>
    </>
  );
}
