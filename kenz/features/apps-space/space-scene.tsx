"use client";

/**
 * La scène spatiale des apps (pro.html A1, shared/apps.*) : le décor rendu par React, animé par ./space-engine.
 * Chaque astre est un vrai lien vers la page de l'app (clavier, lecteurs d'écran, sans JS) ; le ciel, la fiche
 * holographique et le tracé secret sont décoratifs (aria-hidden). Les fiches sont rendues à leur première ouverture.
 */
import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";

import type { AppSpaceCard, MobileAppSlug } from "@/content/apps";
import { ROUTES } from "@/content/site";
import type { HexColor, ImageAsset } from "@/content/types";
import { Icon } from "@/design-system/components/icon";
import { Rich } from "@/design-system/components/rich";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { startSpace } from "./space-engine";
import { ZenkoScene } from "./zenko-scene";
import styles from "./apps-space.module.css";

export interface SpaceApp {
  slug: MobileAppSlug;
  name: string;
  color: HexColor;
  icon: ImageAsset;
  card: AppSpaceCard;
}

interface SpaceSceneProps {
  apps: readonly SpaceApp[];
  /** Les index des astres du code secret, dans l'ordre. */
  code: readonly number[];
  portrait: ImageAsset;
  titleId: string;
}

/** Les mini-animations (sans captures App Store) ; Zenko est la seule. */
const SCENES: Partial<Record<MobileAppSlug, () => React.JSX.Element>> = { zenko: ZenkoScene };

/** Les nébuleuses (couleur, x %, y %, taille vmax, intensité) : les teintes des apps, un violet, un bleu de nuit. */
const NEBULAE = [
  ["#6A4BE6", 28, 30, 78, 0.8],
  ["#2C5AE6", 74, 62, 72, 0.72],
  ["#C83E62", 8, 64, 50, 0.42],
  ["#22867E", 46, 92, 54, 0.36],
  ["#C9853F", 92, 22, 46, 0.34],
] as const;

/** La poussière du premier plan (x %, y %, taille px, intensité) ; une sur quatre est dorée. */
const DUST = [
  [8, 26, 7, 0.3], [23, 74, 4, 0.45], [36, 18, 9, 0.2], [52, 86, 5, 0.35], [63, 30, 3, 0.5], [70, 80, 8, 0.24], [82, 20, 4, 0.4],
  [93, 56, 10, 0.18], [15, 50, 3, 0.5], [46, 58, 4, 0.28], [58, 12, 6, 0.26], [78, 46, 3, 0.45], [30, 42, 5, 0.3], [95, 84, 6, 0.28],
] as const;

const vars = (v: Record<string, string | number>) => v as CSSProperties;

export function SpaceScene({ apps, code, portrait, titleId }: SpaceSceneProps) {
  const { lang, t } = useLanguage();
  const s = t.pro.space;
  const sceneRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^\w-]/g, "");
  const [panels, setPanels] = useState<{ current: number; opened: readonly number[] }>({ current: -1, opened: [] });

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    return startSpace(scene, {
      apps: apps.map((a) => ({
        color: a.color,
        href: ROUTES.app(a.slug),
        icon: a.icon.src,
        preview: a.card.preview.kind,
      })),
      code,
      // La fiche est mesurée juste après : son contenu doit être rendu tout de suite.
      showPanel: (k) =>
        flushSync(() =>
          setPanels((p) => ({ current: k, opened: p.opened.includes(k) ? p.opened : [...p.opened, k] })),
        ),
      segmentClass: { group: styles.seg, halo: styles.segH, line: styles.segF },
    });
  }, [apps, code]);

  const current = apps[panels.current];
  const gallery = current?.card.preview.kind === "gallery";

  return (
    <div ref={sceneRef} className={styles.scene}>
      <div className={styles.espace} aria-hidden="true">
        <div className={styles.couche} data-layer="loin">
          <canvas className={styles.etoiles} data-sky-canvas="" />
        </div>
        <div className={`${styles.couche} ${styles.neb}`} data-layer="neb">
          {NEBULAE.map(([c, x, y, size, a], i) => (
            <i
              key={c}
              className={i < 3 ? `${styles.nebula} ${styles.derive}` : styles.nebula}
              style={vars({ "--nc": c, "--nx": `${x}%`, "--ny": `${y}%`, "--ns": `${size}vmax`, "--na": a, "--nd": `${64 + i * 11}s`, "--ndd": `${-i * 13}s` })}
            />
          ))}
        </div>
      </div>
      <div className={`${styles.couche} ${styles.pous}`} data-layer="pous" aria-hidden="true">
        {DUST.map(([x, y, size, a], i) => (
          <i
            key={`${x}-${y}`}
            style={vars({ "--px": `${x}%`, "--py": `${y}%`, "--pt": `${size}px`, "--pa": a, ...(i % 4 === 1 && { "--pc": "255 214 150" }) })}
          />
        ))}
      </div>

      <div className={styles.inner}>
        <div className={styles.sig} data-zone="">
          <span className={styles.moi}>
            <Image src={portrait.src} alt={s.portraitAlt} width={portrait.width} height={portrait.height} sizes="56px" draggable={false} />
          </span>
          <div className={styles.sigt}>
            <h2 className={styles.titre} id={titleId}>
              {s.title}
            </h2>
            <p className={styles.sous}>
              <Rich text={s.sub} />
            </p>
          </div>
        </div>

        <div className={styles.astres} data-layer="dock">
          {apps.map((a, i) => {
            const domain = localize(a.card.domain, lang);
            return (
              <a
                key={a.slug}
                className={styles.astre}
                href={ROUTES.app(a.slug)}
                draggable={false}
                data-astre=""
                aria-label={format(s.starLabel, { app: a.name, domain: domain.toLocaleLowerCase(lang), line: localize(a.card.line, lang) })}
                style={vars({ "--i": i, "--c": a.color, "--d": `${(1.6 + ((i * 7) % 6) * 0.27).toFixed(2)}s`, "--dd": `${(-(i * 0.53)).toFixed(2)}s` })}
              >
                <span className={styles.aura} aria-hidden="true">
                  <i className={styles.hal} data-hal="" />
                  <i className={styles.orb} />
                  <i className={styles.aig} data-aig="" />
                </span>
                <span className={styles.puce} data-zone="">
                  <Image src={a.icon.src} alt="" width={a.icon.width} height={a.icon.height} sizes="88px" draggable={false} />
                </span>
                {/* Le nom accessible commence par ce texte visible (« Oshii Cuisine ») : l'espace entre les deux
                    blocs ne se voit pas, mais sépare les mots pour la commande vocale. */}
                <span className={styles.etiq} aria-hidden="true" data-zone="">
                  <b>{a.name}</b> <em>{domain}</em>
                </span>
              </a>
            );
          })}

          <svg className={styles.fils} data-viewbox="" aria-hidden="true" focusable="false">
            <defs>
              {apps.slice(0, -1).map((a, i) => (
                <linearGradient key={a.slug} id={`${uid}-f${i}`} gradientUnits="userSpaceOnUse" data-fil-grad="">
                  <stop offset="0" stopColor={a.color} stopOpacity=".6" />
                  <stop offset=".5" stopColor="#F4EFE6" stopOpacity=".12" />
                  <stop offset="1" stopColor={apps[i + 1].color} stopOpacity=".6" />
                </linearGradient>
              ))}
              <radialGradient id={`${uid}-ph`}>
                <stop offset="0" stopColor="#FFF8EC" stopOpacity=".95" />
                <stop offset=".3" stopColor="#FFE6BC" stopOpacity=".3" />
                <stop offset="1" stopColor="#FFE6BC" stopOpacity="0" />
              </radialGradient>
              <linearGradient id={`${uid}-pt`} gradientUnits="userSpaceOnUse" data-photon-trail="">
                <stop offset="0" stopColor="#FFF1D6" stopOpacity="0" />
                <stop offset="1" stopColor="#FFF6E6" stopOpacity=".95" />
              </linearGradient>
            </defs>
            <g>
              {apps.slice(0, -1).map((a, i) => (
                <line key={a.slug} className={styles.filLine} pathLength={1} stroke={`url(#${uid}-f${i})`} data-fil="" />
              ))}
            </g>
            <g className={styles.photon} data-photon="">
              <line className={styles.photonT} stroke={`url(#${uid}-pt)`} data-photon-trail="" />
              <circle r="15" fill={`url(#${uid}-ph)`} data-photon-dot="" />
              <circle className={styles.photonC} r="2.1" data-photon-dot="" />
            </g>
          </svg>

          <svg className={styles.trace} data-viewbox="" aria-hidden="true" focusable="false">
            <defs>
              <radialGradient id={`${uid}-br`}>
                <stop offset="0" stopColor="#FFF1CC" stopOpacity=".92" />
                <stop offset=".16" stopColor="#FFC56A" stopOpacity=".52" />
                <stop offset=".46" stopColor="#F2A040" stopOpacity=".15" />
                <stop offset="1" stopColor="#F2A040" stopOpacity="0" />
              </radialGradient>
              <radialGradient id={`${uid}-tp`}>
                <stop offset="0" stopColor="#FFF8EC" stopOpacity=".9" />
                <stop offset=".32" stopColor="#FFE6BC" stopOpacity=".22" />
                <stop offset="1" stopColor="#FFE6BC" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle className={styles.brasier} r="0" fill={`url(#${uid}-br)`} data-trace-ember="" />
            <g data-trace-group="">
              <g className={styles.vif} data-trace-live="">
                <line className={styles.segH} />
                <line className={styles.segF} />
                <circle r="11" fill={`url(#${uid}-tp)`} />
                <circle className={styles.tracePt} r="1.7" />
              </g>
            </g>
          </svg>
        </div>

        <svg className={styles.legende} data-viewbox="" data-legend="" aria-hidden="true" focusable="false">
          <path className={styles.legL} pathLength={1} data-legend-line="" />
          <circle className={styles.legP} r="2.4" data-legend-dot="" />
        </svg>

        <div className={gallery ? `${styles.fiche} ${styles.ficheGal}` : styles.fiche} data-fiche="" aria-hidden="true">
          <i className={styles.ficheScan} data-fiche-scan="" />
          {panels.opened.map((k) => {
            const a = apps[k];
            if (!a) return null;
            const { preview } = a.card;
            const Scene = SCENES[a.slug];
            const head = (
              <div className={styles.ficheTete}>
                <p className={styles.ficheNom}>{a.name}</p>
                <p className={styles.ficheDom}>{localize(a.card.domain, lang)}</p>
              </div>
            );
            const cta = (
              <a className={styles.ficheCta} href={ROUTES.app(a.slug)} tabIndex={-1} draggable={false}>
                <span>{s.explore}</span>
                <Icon name="arrow-right" />
              </a>
            );
            return (
              <div key={a.slug} className={styles.panel} data-panel={k} hidden={k !== panels.current}>
                {preview.kind === "gallery" ? (
                  <>
                    <div className={styles.ficheGalerie}>
                      <div className={styles.gal}>
                        {preview.screens.map((screen, j) => (
                          <span key={screen.src} className={styles.cap} data-cap="">
                            <span className={styles.capIn}>
                              <Image
                                src={screen.src}
                                alt=""
                                width={screen.width}
                                height={screen.height}
                                sizes="(max-width: 599px) 120px, 156px"
                                loading="eager"
                                fetchPriority={j > 2 ? "low" : "auto"}
                                draggable={false}
                              />
                            </span>
                          </span>
                        ))}
                        <span className={styles.galPts}>
                          {preview.screens.map((screen) => (
                            <i key={screen.src} data-pt="" />
                          ))}
                        </span>
                      </div>
                    </div>
                    <div className={styles.ficheTxt}>
                      {head}
                      <ul className={styles.fichePts}>
                        {(a.card.points ?? []).map((point) => (
                          <li key={point.fr}>{localize(point, lang)}</li>
                        ))}
                      </ul>
                      {cta}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.ficheEcran}>
                      {Scene ? (
                        <div className={styles.ficheVues} data-vues="">
                          <Scene />
                        </div>
                      ) : null}
                      <Image
                        className={Scene ? styles.ficheCap : `${styles.ficheCap} ${styles.ficheCapAlone}`}
                        src={preview.screen.src}
                        alt=""
                        width={preview.screen.width}
                        height={preview.screen.height}
                        sizes="110px"
                        loading="eager"
                        draggable={false}
                        data-capture=""
                      />
                    </div>
                    <div className={styles.ficheTxt}>
                      {head}
                      <p className={styles.ficheLigne}>{localize(a.card.line, lang)}</p>
                      {cta}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <p className={styles.indice} aria-hidden="true" data-zone="">
          {s.hint}
        </p>
      </div>
    </div>
  );
}
