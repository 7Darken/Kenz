"use client";

/**
 * « La machine » (maquettes/v6/shared/ia.*) : l'entrée réelle → des stations simples → « Vous validez » → la sortie réelle.
 * - `complete` (/agents) : le choix parmi les quatre vrais cas, la machine, « Dans la vraie vie », « Rejouer ».
 *   Elle joue une fois à son entrée à l'écran ; le visiteur valide lui-même.
 * - `preview` (accueil Pro) : un seul cas, joué deux fois tant qu'il est à l'écran, puis « Voir comment ».
 *   Il se joue tout seul : pas de région `aria-live` (les annonces sont pour le mode complet, que le visiteur
 *   déclenche lui-même).
 * Les cas arrivent du serveur (`cases`) : ce composant client n'importe pas content/ia.
 * Le minutage est dans ./machine-story ; ici, le rendu, la géométrie du jeton et les commandes.
 * Disposition par la largeur de la machine (conteneur « kzia ») : verticale sous 420 px, horizontale au-delà.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { IaCase, IaCaseId, IaCaseMap } from "@/content/ia";
import { passageAttributes } from "@/content/site";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Icon } from "@/design-system/components/icon";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Lang } from "@/i18n/config";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { IaInput } from "./ia-input";
import { IaOutput } from "./ia-output";
import { IaPictogram } from "./ia-picto";
import {
  caseOf,
  createMachineStory,
  restingScene,
  type MachineMode,
  type MachineStory,
  type SceneState,
} from "./machine-story";
import { useArrival } from "./use-arrival";
import styles from "./ia-machine.module.css";

interface IaMachineProps {
  mode: MachineMode;
  caseId: IaCaseId;
  /** Les cas jouables, dans l'ordre des choix (aperçu : le seul cas joué). */
  cases: IaCaseMap;
  /** Aperçu : la cible de « Voir comment » (vide : pas de lien). */
  href?: string;
}

const flag = (on: boolean) => (on ? "" : undefined);

export function IaMachine({ mode, caseId, cases, href = "" }: IaMachineProps) {
  const { t, lang } = useLanguage();
  const [scene, setScene] = useState<SceneState>(() => restingScene(caseId));
  const storyRef = useRef<MachineStory | null>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const approveRef = useRef<HTMLButtonElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);
  const tokenAt = useRef(-1);
  const complete = mode === "complete";
  // Mode complet : la colonne entre avec la phrase du hero de /agents.
  const arrived = useArrival(complete);

  // Le récit : branché sur la visibilité de la machine (seuil de 40 %, comme la maquette).
  useEffect(() => {
    const machine = machineRef.current;
    if (!machine) return;
    const story = createMachineStory({
      mode,
      caseId,
      cases,
      update: setScene,
      approveHadFocus: () => {
        const active = document.activeElement;
        return active === null || active === document.body || active === approveRef.current;
      },
    });
    storyRef.current = story;
    let frame = 0;
    let observer: IntersectionObserver | null = null;
    if (mode === "preview" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Mouvement réduit : l'aperçu montre l'état final, sans boucle.
      frame = requestAnimationFrame(story.showFinal);
    } else {
      observer = new IntersectionObserver(
        (entries) => entries.forEach((entry) => story.setVisible(entry.isIntersecting)),
        { threshold: 0.4 },
      );
      observer.observe(machine);
    }
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      story.destroy();
      storyRef.current = null;
    };
  }, [mode, caseId, cases]);

  // Le jeton et la ligne suivent les stations (avant la peinture : pas d'image intermédiaire).
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    placeToken(track, scene.token, scene.instant);
    tokenAt.current = scene.token;
  }, [scene.key, scene.token, scene.instant]);

  // Redimensionnement : la ligne et le jeton se recalent sans glisser.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (trackRef.current) placeToken(trackRef.current, tokenAt.current, true);
      });
    });
    observer.observe(stage);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  // Après une validation au clavier, « Rejouer » reprend le focus.
  useEffect(() => {
    if (scene.replay && scene.focusReplay) replayRef.current?.focus({ preventScroll: true });
  }, [scene.replay, scene.focusReplay]);

  const data = caseOf(cases, scene.caseId);
  const you = data.steps.length;
  const m = t.agents.machine;

  const machine = (
    <div ref={machineRef} className={styles.machine}>
      <div className={styles.core} role="group" aria-label={m.machine}>
        <div ref={stageRef} className={styles.stage}>
          <div
            key={scene.key}
            className={styles.scene}
            data-input={flag(scene.input)}
            data-output={flag(scene.output)}
            data-ending={flag(scene.ending)}
          >
            <figure className={`${styles.zone} ${styles.zoneIn}`}>
              <div className={styles.frame}>
                <IaInput drawing={data.input.drawing} shown={scene.input} read={scene.read} compact={!complete} />
              </div>
              <figcaption className={styles.caption}>{localize(data.input.caption, lang)}</figcaption>
            </figure>

            <div ref={trackRef} className={styles.track} data-on={flag(scene.tokenOn)}>
              <i className={styles.line} data-line="">
                <i className={styles.lineFill} />
              </i>
              <ol className={styles.stations}>
                {data.steps.map((step, index) => (
                  <li key={index} className={styles.station} data-station="" data-state={stationState(index, scene.lit)}>
                    <span className={styles.point}>
                      <IaPictogram name={step.picto} />
                    </span>
                    <span className={styles.verb}>{localize(step.verb, lang)}</span>
                  </li>
                ))}
                <li
                  className={`${styles.station} ${styles.you}`}
                  data-station=""
                  data-state={stationState(you, scene.lit)}
                  data-phase={scene.phase === "waiting" || scene.phase === "done" ? scene.phase : undefined}
                >
                  <span className={styles.point}>
                    <IaPictogram name="vous" className={styles.iconYou} />
                    <IaPictogram name="coche" className={styles.iconCheck} />
                  </span>
                  <span className={styles.verb}>
                    <span className={styles.verbWait}>{m.you}</span>
                    <span className={styles.verbDone}>{m.approved}</span>
                  </span>
                  <button
                    ref={approveRef}
                    className={styles.approve}
                    type="button"
                    tabIndex={complete && scene.phase === "waiting" ? undefined : -1}
                    aria-hidden={complete ? undefined : true}
                    data-pressed={flag(scene.pressed)}
                    onClick={() => storyRef.current?.approve()}
                  >
                    {m.approve}
                  </button>
                </li>
              </ol>
              <i className={styles.token} data-token="" aria-hidden="true" />
            </div>

            <figure className={`${styles.zone} ${styles.zoneOut}`}>
              <div className={styles.frame}>
                <IaOutput output={data.output} shown={scene.output} compact={!complete} />
                <i className={styles.flash} aria-hidden="true" />
              </div>
              <figcaption className={styles.caption}>{localize(data.output.caption, lang)}</figcaption>
            </figure>
          </div>
        </div>
        {complete ? (
          <button
            ref={replayRef}
            className={styles.replay}
            type="button"
            data-on={flag(scene.replay)}
            onClick={() => storyRef.current?.replay()}
          >
            <Icon name="replay" />
            {t.common.actions.replay}
          </button>
        ) : null}
      </div>
    </div>
  );

  const after = (
    <>
      <p className={styles.realLife}>
        <em>{m.realLife}</em>
        {m.realLifeSeparator}
        <span>{localize(data.inRealLife, lang)}</span>
      </p>
      {complete ? (
        <p className="sr" aria-live="polite">
          {announcement(scene, data, t, lang)}
        </p>
      ) : null}
    </>
  );

  if (complete) {
    return (
      <div className={`${styles.root} ${styles.complete}`}>
        <Container className={styles.column} data-in={flag(arrived)}>
          <div className={styles.choices} role="group" aria-label={m.choose}>
            {(Object.keys(cases) as IaCaseId[]).map((id) => (
              <button
                key={id}
                className={styles.choice}
                type="button"
                aria-pressed={id === scene.caseId}
                onClick={() => storyRef.current?.choose(id)}
              >
                <span className={styles.choicePicto}>
                  <IaPictogram name={caseOf(cases, id).picto} />
                </span>
                <span className={styles.choiceText}>{localize(caseOf(cases, id).title, lang)}</span>
              </button>
            ))}
          </div>
          {machine}
          {after}
        </Container>
      </div>
    );
  }

  return (
    <div className={`${styles.root} ${styles.preview}`}>
      <p className={styles.previewTitle}>{localize(data.title, lang)}</p>
      {machine}
      {after}
      {href ? (
        <Button href={href} icon="arrow-right" className={styles.seeHow} {...passageAttributes("agents")}>
          {m.seeHow}
        </Button>
      ) : null}
    </div>
  );
}

/** La station allumée, puis celles déjà passées. */
function stationState(index: number, lit: number) {
  if (index === lit) return "on";
  return index < lit ? "past" : undefined;
}

/** L'annonce aux lecteurs d'écran, dans la langue active. */
function announcement(scene: SceneState, data: IaCase, t: Dictionary, lang: Lang): string {
  const live = t.agents.machine.live;
  switch (scene.announcement) {
    case "working":
      return live.working;
    case "step": {
      const step = data.steps[scene.lit];
      return step ? format(live.step, { verb: localize(step.verb, lang) }) : "";
    }
    case "waiting":
      return live.waiting;
    case "done":
      return format(live.done, { done: localize(data.done, lang) });
    default:
      return "";
  }
}

/**
 * Place le jeton de lumière sur la station `index` (-1 : avant la première ; au-delà de la dernière : au bout),
 * et trace la ligne jusqu'à lui. La piste est horizontale ou verticale selon la disposition des stations.
 * `instant` : sans glisser (les transitions sont coupées le temps de poser).
 */
function placeToken(track: HTMLElement, index: number, instant: boolean) {
  const stations = Array.from(track.querySelectorAll<HTMLElement>("[data-station]"));
  const line = track.querySelector<HTMLElement>("[data-line]");
  const token = track.querySelector<HTMLElement>("[data-token]");
  if (!stations.length || !line || !token) return;

  // Le centre du rond d'une station, dans le repère de la piste.
  const center = (station: HTMLElement) => {
    const point = station.firstElementChild as HTMLElement;
    const list = station.parentElement as HTMLElement;
    return {
      x: list.offsetLeft + station.offsetLeft + point.offsetLeft + point.offsetWidth / 2,
      y: list.offsetTop + station.offsetTop + point.offsetTop + point.offsetHeight / 2,
    };
  };
  const vertical = stations.length > 1 && stations[1].offsetTop > stations[0].offsetTop + 8;
  const width = track.clientWidth;
  const height = track.clientHeight;
  const first = center(stations[0]);
  track.toggleAttribute("data-vertical", vertical);
  line.style.left = vertical ? `${first.x}px` : "0px";
  line.style.top = vertical ? "0px" : `${first.y}px`;

  let x: number;
  let y: number;
  if (index < 0) {
    x = vertical ? first.x : 0;
    y = vertical ? 0 : first.y;
  } else if (index >= stations.length) {
    x = vertical ? first.x : width;
    y = vertical ? height : first.y;
  } else {
    const at = center(stations[index]);
    x = vertical ? first.x : at.x;
    y = vertical ? at.y : first.y;
  }
  const progress = vertical ? y / Math.max(1, height) : x / Math.max(1, width);

  if (instant) track.setAttribute("data-instant", "");
  token.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  line.style.setProperty("--p", Math.max(0, Math.min(1, progress)).toFixed(4));
  if (instant) {
    void track.offsetWidth; // applique la position avant de rendre les transitions
    track.removeAttribute("data-instant");
  }
}
