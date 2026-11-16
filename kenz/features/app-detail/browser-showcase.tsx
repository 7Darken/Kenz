"use client";

/**
 * 5. En vrai (Escapades Libres) : la plateforme en ligne, dans une grande fenêtre de navigateur. Le haut de la
 * landing d'abord, puis la landing entière défile dedans ; la page du test en vignette, au second plan.
 * - Ordinateur : le chapitre est épinglé, le défilement fait défiler la landing.
 * - Mobile : la landing défile pendant que la fenêtre traverse l'écran.
 * - Mouvement réduit : la fenêtre se fait défiler à la main (défilement natif) ; elle est alors une région nommée,
 *   atteignable au clavier (Safari ne rend pas focalisable une zone qui défile).
 * La loupe grossit la landing qui défile (`data-loupe-source`), ou le haut de la landing tant qu'il est visible.
 */
import { useLayoutEffect, useRef } from "react";

import type { WebApp } from "@/content/apps";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { SweepTitle } from "@/design-system/components/sweep-title";
import { gsap } from "@/design-system/motion/gsap";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import page from "./app-detail.module.css";
import styles from "./browser-showcase.module.css";
import { ContentImage } from "./content-image";

const PIN_QUERY = "(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";
const TITLE_ID = "vrai-titre";

function Dots() {
  return (
    <span className={styles.dots} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export function BrowserShowcase({ app }: { app: WebApp }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLImageElement>(null);
  const { lang, t } = useLanguage();
  const { browser, site } = app.story;
  const host = site.replace(/^https?:\/\//, "");
  const viewLabel = format(t.apps.real.view, { app: app.name });

  useLayoutEffect(() => {
    const pin = pinRef.current;
    const section = pin?.parentElement;
    const view = viewRef.current;
    const landing = pageRef.current;
    const hero = heroRef.current;
    if (!pin || !section || !view || !landing || !hero) return;

    const mm = gsap.matchMedia(pin);
    mm.add({ pin: PIN_QUERY, reduced: "(prefers-reduced-motion: reduce)", all: "(min-width: 0px)" }, (context) => {
      const { pin: pinned, reduced } = context.conditions as { pin: boolean; reduced: boolean };
      if (reduced) return;
      // Animée, la fenêtre ne défile plus à la main : ni région ni arrêt du clavier.
      const scrollable = { tabindex: "0", role: "region", "aria-label": viewLabel };
      Object.keys(scrollable).forEach((name) => view.removeAttribute(name));
      view.setAttribute("data-anim", "");
      view.removeAttribute("data-lenis-prevent");
      view.scrollTop = 0;
      if (pinned) section.setAttribute("data-pin", "");
      const maxY = () => Math.max(0, landing.offsetHeight - view.clientHeight);
      const [fadeAt, scrollAt] = pinned ? [0.015, 0.05] : [0.1, 0.16];
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: pinned
            ? {
                trigger: pin,
                start: "top top",
                end: () => `+=${Math.round(Math.min(maxY() * 0.5, window.innerHeight * 3.4))}`,
                pin: true,
                scrub: 0.8,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              }
            : { trigger: view, start: "top 72%", end: "bottom 12%", scrub: 0.6, invalidateOnRefresh: true },
        })
        .to(hero, { opacity: 0, duration: scrollAt - fadeAt }, fadeAt)
        .fromTo(landing, { y: 0 }, { y: () => -maxY(), duration: 1 - scrollAt }, scrollAt);
      return () => {
        section.removeAttribute("data-pin");
        view.removeAttribute("data-anim");
        view.setAttribute("data-lenis-prevent", "");
        Object.entries(scrollable).forEach(([name, value]) => view.setAttribute(name, value));
      };
    });
    return () => mm.revert();
  }, [lang, viewLabel]);

  return (
    <Section className={styles.real} aura="droite" aria-labelledby={TITLE_ID}>
      <div ref={pinRef} className={styles.pin}>
        <Container>
          <SweepTitle variant="pro" id={TITLE_ID} className={`${page.h2} ${styles.title}`}>
            {t.apps.real.title}
          </SweepTitle>
          <div className={styles.zone}>
            <Reveal as="figure" className={styles.window}>
              <div className={styles.in}>
                <div className={styles.bar}>
                  <Dots />
                  <span className={styles.url}>
                    <span className={styles.address}>
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true" focusable="false">
                        <rect x="2.5" y="5.2" width="7" height="5" rx="1.2" />
                        <path d="M4.2 5.2V4a1.8 1.8 0 0 1 3.6 0v1.2" />
                      </svg>
                      {host}
                    </span>
                  </span>
                  <span className={styles.state}>{t.apps.real.online}</span>
                </div>
                <div
                  ref={viewRef}
                  className={styles.view}
                  tabIndex={0}
                  role="region"
                  aria-label={viewLabel}
                  data-lenis-prevent=""
                  data-loupe=""
                >
                  <div ref={pageRef} className={styles.page} data-loupe-source="">
                    <ContentImage className={styles.landing} image={browser.page} sizes="(min-width: 900px) 900px, 100vw" />
                  </div>
                  <ContentImage ref={heroRef} className={styles.hero} image={browser.hero} sizes="(min-width: 900px) 900px, 100vw" loupe />
                </div>
              </div>
            </Reveal>
            <Reveal as="figure" className={`${styles.window} ${styles.mini}`} index={3}>
              <div className={styles.in}>
                <div className={styles.bar}>
                  <Dots />
                </div>
                <ContentImage className={styles.miniImg} image={browser.detail} sizes="(min-width: 900px) 320px, 58vw" loupe />
              </div>
            </Reveal>
          </div>
        </Container>
      </div>
    </Section>
  );
}
