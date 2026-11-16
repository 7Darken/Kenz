"use client";

/**
 * La scène des « 54 heures », en trois temps (le compteur 54 h, petit, défile du début à la fin) :
 * 1. le mur de post-it, les équipes, le projecteur qui s'arrête sur Escapades Libres ;
 * 2. le rôle : écouter, concevoir (mode designer), un premier MVP en 24 heures dans un navigateur ;
 * 3. dimanche : le couloir d'arches, l'éclat, la photo couronnée d'étoiles, le « 1re », le podium,
 *    puis « Aujourd'hui, elle est en ligne. » et ses deux boutons.
 * Le balisage est l'état final (lisible sans JS) ; use-victoire-motion joue la séquence.
 */
import { useRef, type MouseEvent } from "react";

import { ROUTES } from "@/content/site";
import { startupWeekend } from "@/content/startup-weekend";
import { Button } from "@/design-system/components/button";
import { openPassage } from "@/features/passages";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";

import { ClockDigits, MiniClock } from "./clock-digits";
import { CrowdWall } from "./crowd-wall";
import { DesignDesk } from "./design-desk";
import { PASSAGE_ICON } from "./passage-icon";
import { Podium } from "./podium";
import { SplitWords } from "./split-words";
import { useVictoireMotion } from "./use-victoire-motion";
import styles from "./victoire.module.css";
import { H14, H30, H54 } from "./victoire-geometry";
import { VictoryArch } from "./victory-arch";

const sw = startupWeekend;
const host = sw.site.replace(/^https?:\/\//, "").replace(/\/$/, "");
const year = sw.dates.start.slice(0, 4);

/** « Découvrir le projet » : le passage dans l'or du projet, son symbole comme élément partagé. */
function toProject(event: MouseEvent<HTMLAnchorElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.currentTarget;
  if (openPassage(link, link.href, { color: sw.color, icon: PASSAGE_ICON, size: 112 })) event.preventDefault();
}

export function VictoireStage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { lang, t } = useLanguage();
  const v = t.victoire;
  const ordinal = localize(sw.result.ordinal, lang);
  useVictoireMotion(rootRef, lang);

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.stage} data-kv="stage">
        <i className={styles.glow} aria-hidden="true" />
        <div className={styles.clock} aria-hidden="true">
          <span className={styles.face} data-kv="clock">
            <ClockDigits seconds={H54} />
          </span>
        </div>
        <p className="sr">{v.clockLabel}</p>

        {/* 1. Beaucoup d'équipes, une seule gagne */}
        <div className={`${styles.t} ${styles.t1}`} data-kv="t1">
          <div className={styles.col} data-kv="col">
            <MiniClock seconds={H54} />
            <h2 className={styles.h} data-kv="title">
              <SplitWords text={sw.name}>
                <svg className={styles.flag} viewBox="0 0 3 2" role="img" aria-label={localize(sw.country, lang)} focusable="false">
                  <rect width="1" height="2" fill="#0055A4" />
                  <rect x="1" width="1" height="2" fill="#FFFFFF" />
                  <rect x="2" width="1" height="2" fill="#EF4135" />
                </svg>
              </SplitWords>
            </h2>
            <p className={styles.date} data-kv="date">
              {sw.city} · {localize(sw.dates.label, lang)}
            </p>
            <div className={styles.lines1}>
              <p className={`${styles.line} ${styles.line1}`} data-kv="line-1">
                <SplitWords text={v.crowd.friday} />
              </p>
              <p className={`${styles.line} ${styles.line2}`} data-kv="line-2">
                <SplitWords text={v.crowd.teams} />
              </p>
              <p className={styles.line} data-kv="line-3">
                <SplitWords text={v.crowd.sunday} />
              </p>
            </div>
          </div>
          <CrowdWall label={v.crowd.wallLabel} />
        </div>

        {/* 2. Mon rôle : écouter, concevoir, développer */}
        <div className={`${styles.t} ${styles.t2}`} data-kv="t2">
          <div className={styles.col} data-kv="col">
            <MiniClock seconds={H30} />
            <div className={styles.steps}>
              <p className={`${styles.step} ${styles.step1}`} data-kv="step-1">
                <SplitWords text={v.role.listen} />
              </p>
              <p className={`${styles.step} ${styles.step2}`} data-kv="step-2">
                <SplitWords text={v.role.design} />
              </p>
              <p className={`${styles.step} ${styles.step3}`} data-kv="step-3">
                <SplitWords text={v.role.build} />
              </p>
              <p className={styles.step} data-kv="step-4">
                <SplitWords text={v.role.summary} />
              </p>
            </div>
          </div>
          <div className={styles.box}>
            <DesignDesk
              host={host}
              artboards={sw.designDesk.artboards.map((board) => ({ name: localize(board.name, lang), image: board.image }))}
              selectionSize={sw.designDesk.selectionSize}
              swatches={sw.designDesk.swatches}
              accent={sw.color}
              typeface={sw.designDesk.typeface}
              live={sw.live}
              liveAlt={sw.live.alt ? localize(sw.live.alt, lang) : ""}
              quote={v.role.quote}
              labels={{ colors: v.role.colors, text: v.role.text }}
            />
            <p className={styles.k24} aria-hidden="true" data-kv="k24">
              <span data-kv="n24">24</span>
              {" "}
              {v.role.hours}
              <i className={styles.k24Rule} data-kv="r24" />
            </p>
          </div>
        </div>

        {/* 3. Dimanche : le couloir, l'éclat, la victoire */}
        <div className={`${styles.t} ${styles.t3}`} data-kv="t3">
          <div className={styles.col} data-kv="col">
            <MiniClock seconds={H14} />
            <div className={styles.swap}>
              <div className={styles.day} data-kv="day">
                <p className={styles.h}>
                  <SplitWords text={v.win.day} />
                </p>
                <p className={styles.line}>
                  <SplitWords text={v.win.pitch} />
                </p>
              </div>
              <div className={styles.une}>
                <p className={styles.uneN} aria-hidden="true">
                  <span className={styles.uneG} data-kv="une-glyph">
                    {sw.result.rank}
                    <sup>{ordinal}</sup>
                  </span>
                </p>
                <p className={styles.uneName} data-kv="une-name">
                  {sw.projectName}
                </p>
                <p className={styles.uneLabel} data-kv="une-label">
                  {sw.result.rank}
                  <sup>{ordinal}</sup> {v.win.place} · {sw.name} {sw.city} · {year}
                </p>
              </div>
            </div>
            <p className={`${styles.h} ${styles.hLive}`} data-kv="live">
              <SplitWords text={v.win.live} />
            </p>
            <div className={styles.acts} data-kv="acts">
              <Button variant="light" href={sw.site} external>
                {v.win.seePlatform}
              </Button>
              <Button variant="ghost" href={ROUTES.app(sw.project)} icon="arrow-right" onClick={toProject}>
                {v.win.discoverProject}
              </Button>
            </div>
          </div>
          <div className={styles.box}>
            <VictoryArch
              win={{ image: sw.photos.win, alt: localize(sw.photos.win.alt, lang) }}
              team={{ image: sw.photos.team, alt: localize(sw.photos.team.alt, lang) }}
              check={{ image: sw.photos.check, alt: localize(sw.photos.check.alt, lang) }}
              credit={format(v.win.credit, { credit: sw.photos.win.credit ?? "" })}
            />
            <Podium project={sw.projectName} label={format(v.win.podiumLabel, { project: sw.projectName })} />
          </div>
        </div>
      </div>
    </div>
  );
}
