"use client";

/**
 * 3. Comment ça marche : la grande animation de l'app, en trois temps légendés (app.html).
 * - Ordinateur (≥ 900 × 600, sans mouvement réduit) : le chapitre est épinglé ; les trois temps glissent à
 *   l'horizontale le long du fil, et chaque nœud qui passe fait avancer l'animation.
 * - Ailleurs : l'animation se joue une fois à l'entrée à l'écran, la légende suit ; « Rejouer » à la fin.
 * - Mouvement réduit : l'état final, tout de suite.
 */
import { useLayoutEffect, useRef } from "react";

import type { App } from "@/content/apps";
import { Container } from "@/design-system/components/container";
import { Icon } from "@/design-system/components/icon";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { gsap, ScrollTrigger } from "@/features/motion/gsap";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import page from "./app-detail.module.css";
import styles from "./how-it-works.module.css";
import kit from "./scenes/scene.module.css";
import { SCENES } from "./scenes/registry";
import { SweepTitle } from "./sweep-title";

const PIN_QUERY = "(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

export function HowItWorks({ app }: { app: App }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const winRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);
  const replayAction = useRef<(() => void) | null>(null);
  const { lang, t } = useLanguage();
  const entry = SCENES[app.slug];
  const { Content } = entry;
  const beats = app.story.beats;

  useLayoutEffect(() => {
    const pin = pinRef.current;
    const section = pin?.parentElement;
    const win = winRef.current;
    const track = trackRef.current;
    const list = listRef.current;
    const scene = sceneRef.current;
    const core = coreRef.current;
    const replay = replayRef.current;
    if (!pin || !section || !win || !track || !list || !scene || !core || !replay) return;
    const times = beats.map((beat) => beat.at);
    const captions = Array.from(list.children);
    const setCaption = (k: number) => captions.forEach((li, i) => li.toggleAttribute("data-on", i === k));

    const mm = gsap.matchMedia(pin);
    mm.add({ pin: PIN_QUERY, reduced: "(prefers-reduced-motion: reduce)", all: "(min-width: 0px)" }, (context) => {
      const { pin: pinned, reduced } = context.conditions as { pin: boolean; reduced: boolean };
      const tl = entry.build(core);
      if (reduced) {
        tl.progress(1, true);
        return;
      }
      list.setAttribute("data-driven", "");
      setCaption(0);

      if (pinned) {
        section.setAttribute("data-pin", "");
        let segment = -1;
        let tween: gsap.core.Tween | null = null;
        // Chaque temps atteint fait avancer l'animation jusqu'au début du suivant (en arrière, plus vite).
        const go = (k: number) => {
          if (k === segment) return;
          const back = k < segment;
          const jump = Math.max(1, Math.abs(k - segment));
          segment = k;
          setCaption(Math.max(0, k));
          const target = k < 0 ? 0 : k >= times.length - 1 ? tl.duration() : (times[k + 1] ?? tl.duration());
          tween?.kill();
          const distance = Math.abs(tl.time() - target);
          if (distance < 0.01) return;
          tween = tl.tweenTo(target, { duration: back ? Math.min(0.8, distance * 0.45) : distance / jump, ease: "none" });
        };
        // Les trois temps glissent à l'horizontale le long du fil.
        const travel = () => Math.max(0, track.scrollWidth - win.clientWidth);
        gsap.to(track, {
          x: () => -travel(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${Math.max(travel() * 1.45, window.innerHeight * 1.7)}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              track.style.setProperty("--hp", self.progress.toFixed(4));
              go(self.progress < 0.28 ? 0 : self.progress < 0.72 ? 1 : 2);
            },
          },
        });
        ScrollTrigger.create({
          trigger: pin,
          start: "top 55%",
          onEnter: () => {
            if (segment < 0) go(0);
          },
          onLeaveBack: () => go(-1),
        });
        return () => {
          tween?.kill();
          section.removeAttribute("data-pin");
          list.removeAttribute("data-driven");
          track.style.removeProperty("--hp");
        };
      }

      // Mobile : joué à l'entrée à l'écran, la légende suit le temps ; « Rejouer » à la fin.
      scene.setAttribute("data-tl", "");
      tl.eventCallback("onUpdate", () => {
        const now = tl.time();
        let k = 0;
        times.forEach((at, i) => {
          if (now >= at - 0.001) k = i;
        });
        setCaption(k);
      });
      tl.eventCallback("onComplete", () => replay.setAttribute("data-on", ""));
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e?.isIntersecting) return;
          io.disconnect();
          gsap.delayedCall(0.8, () => tl.play(0));
        },
        { threshold: 0.5 },
      );
      io.observe(scene);
      replayAction.current = () => {
        replay.removeAttribute("data-on");
        tl.pause(0);
        setCaption(0);
        gsap.delayedCall(0.5, () => tl.play(0));
      };
      return () => {
        io.disconnect();
        replayAction.current = null;
        replay.removeAttribute("data-on");
        scene.removeAttribute("data-tl");
        list.removeAttribute("data-driven");
      };
    });
    return () => {
      mm.revert();
      captions.forEach((li) => li.removeAttribute("data-on"));
    };
  }, [entry, beats, lang]);

  return (
    <Section id="comment" className={styles.how} aura="droite" aria-labelledby="comment-titre">
      <div ref={pinRef} className={styles.pin}>
        <Container className={styles.inner}>
          <SweepTitle id="comment-titre" className={`${page.h2} ${styles.title}`}>
            {t.apps.how.title}
          </SweepTitle>
          <div ref={winRef} className={styles.win}>
            <div ref={trackRef} className={styles.track}>
              <ol ref={listRef} className={styles.beats}>
                {beats.map((beat) => (
                  <li key={beat.at} className={styles.beat}>
                    <span className={styles.knot} aria-hidden="true" />
                    <span className={styles.beatText}>{localize(beat.text, lang)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <Reveal variant="card" className={styles.stage}>
            <div ref={sceneRef} className={`${kit.sc} ${styles.scene} ${entry.className}`}>
              <div className={kit.view}>
                <div ref={coreRef} className={kit.core} role="img" aria-label={localize(app.story.demoAlt, lang)}>
                  <Content />
                  {entry.sample ? (
                    <span className={entry.sample === "top" ? `${kit.ex} ${kit.exTop}` : kit.ex}>{t.apps.scenes.sample}</span>
                  ) : null}
                </div>
              </div>
              <button ref={replayRef} className={kit.replay} type="button" onClick={() => replayAction.current?.()}>
                <Icon name="replay" />
                {t.common.actions.replay}
              </button>
            </div>
          </Reveal>
        </Container>
      </div>
    </Section>
  );
}
