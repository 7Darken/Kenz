"use client";

/**
 * La fiche d'une course, compacte (≈ 680 px, une feuille qui monte du bas sur mobile), sur le Dialog du design
 * system : la date et le lieu, le titre, « Fermer » ; la scène animée qui explique le sport ; une ou deux phrases ;
 * les photos en vignettes (une vignette cliquée s'agrandit dans la fiche) ; la vidéo.
 * La photo cliquée dans la composition vole jusqu'à sa vignette (Web Animations). Mouvement réduit : ni vol ni
 * agrandissement animé, la scène est figée dans son état final.
 */
import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

import { COURSE_SCENES, COURSES, type CourseId } from "@/content/courses";
import { Dialog } from "@/design-system/components/dialog";
import { Icon } from "@/design-system/components/icon";
import { CSS_EASE } from "@/features/motion/easings";
import { useReducedMotion } from "@/features/motion/use-reduced-motion";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./course-dialog.module.css";
import { CourseWhen } from "./course-when";
import { CourseScene } from "./scenes/course-scene";

/** Une ouverture de la fiche : la course, la photo qui vole (et son adresse), un numéro d'ouverture. */
export interface CourseDetail {
  id: CourseId;
  /** La photo cliquée, si elle doit voler jusqu'à sa vignette. */
  source: HTMLImageElement | null;
  /** Son adresse (`data-photo` de son cadre) : la vignette où elle atterrit. */
  photo?: string;
  key: number;
}

interface CourseDialogProps {
  detail: CourseDetail | null;
  open: boolean;
  onClose: () => void;
}

const MAX_THUMBS = 4;

export function CourseDialog({ detail, open, onClose }: CourseDialogProps) {
  const titleId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const zoomImageRef = useRef<HTMLImageElement>(null);
  const zoomCloseRef = useRef<HTMLButtonElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  const { lang, t } = useLanguage();
  const [zoom, setZoom] = useState<{ key: number; index: number } | null>(null);
  const [landed, setLanded] = useState(0);

  const course = detail ? COURSES[detail.id] : null;
  const photos = course ? (course.detail.photos ?? course.photos).slice(0, MAX_THUMBS) : [];
  const zoomIndex = detail && zoom?.key === detail.key ? zoom.index : null;
  const zoomPhoto = zoomIndex !== null ? photos[zoomIndex] : undefined;
  const flying = !!detail?.source && landed !== detail.key;
  const targetIndex = Math.max(0, photos.findIndex((photo) => photo.src === detail?.photo));

  // À l'ouverture : « Fermer » prend le focus, puis la photo cliquée vole jusqu'à sa vignette.
  useEffect(() => {
    if (!open || !detail) return;
    closeRef.current?.focus({ preventScroll: true });
    const source = detail.source;
    const body = bodyRef.current;
    const target = thumbRefs.current[targetIndex]?.querySelector("img");
    if (!source || !body || !target) return;
    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const flyer = document.createElement("img");
    flyer.src = source.currentSrc || source.src;
    flyer.alt = "";
    flyer.className = styles.flyer;
    flyer.style.objectPosition = getComputedStyle(source).objectPosition;
    body.appendChild(flyer);
    const pose = (r: DOMRect) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    const flight = flyer.animate([{ ...pose(from), borderRadius: "6px" }, { ...pose(to), borderRadius: "10px" }], {
      duration: 620,
      easing: CSS_EASE.expo,
      fill: "forwards",
    });
    const key = detail.key;
    flight.onfinish = () => {
      flyer.remove();
      setLanded(key);
    };
    return () => {
      flight.cancel();
      flyer.remove();
    };
  }, [open, detail, targetIndex]);

  // La vignette agrandie part de sa place dans la rangée, et son bouton « Réduire » prend le focus.
  useLayoutEffect(() => {
    if (zoomIndex === null) return;
    zoomCloseRef.current?.focus({ preventScroll: true });
    const image = zoomImageRef.current;
    const thumb = thumbRefs.current[zoomIndex]?.querySelector("img");
    if (reduced || !image || !thumb) return;
    const a = thumb.getBoundingClientRect();
    const b = image.getBoundingClientRect();
    if (!a.width || !b.width) return;
    const grow = image.animate(
      [
        {
          transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`,
          opacity: 0.6,
        },
        { transform: "none", opacity: 1 },
      ],
      { duration: 460, easing: CSS_EASE.expo },
    );
    return () => grow.cancel();
  }, [zoomIndex, reduced]);

  const shrink = () => {
    if (zoomIndex === null) return;
    setZoom(null);
    thumbRefs.current[zoomIndex]?.focus({ preventScroll: true });
  };

  const cls = [styles.sheet, flying && styles.flight, zoomIndex !== null && styles.zoomed].filter(Boolean).join(" ");
  const c = t.sport.courses;

  return (
    <Dialog
      open={open}
      onClose={() => (zoomIndex !== null ? shrink() : onClose())}
      labelledBy={titleId}
      variant="sheet"
      closeButton={false}
      className={cls}
    >
      <div ref={bodyRef} className={styles.body} data-lenis-prevent="">
        {course && detail ? (
          <>
            <div className={styles.top}>
              <div>
                <CourseWhen course={course} className={styles.when} />
                <h2 id={titleId} className={styles.title}>
                  {localize(course.name, lang)}
                </h2>
              </div>
              <button ref={closeRef} className={styles.close} type="button" onClick={onClose}>
                {t.common.actions.close}
                <span aria-hidden="true">
                  <Icon name="close" />
                </span>
              </button>
            </div>

            <div className={styles.stage}>
              <div className={styles.scene} aria-hidden="true">
                <CourseScene key={detail.key} id={course.scene} running={open && zoomIndex === null} />
              </div>
              {zoomPhoto ? (
                <figure className={styles.zoom} onClick={shrink}>
                  <Image
                    ref={zoomImageRef}
                    src={zoomPhoto.src}
                    alt={zoomPhoto.alt ? localize(zoomPhoto.alt, lang) : ""}
                    width={zoomPhoto.width}
                    height={zoomPhoto.height}
                    sizes="(max-width: 640px) 100vw, 640px"
                    style={{ "--nw": `${zoomPhoto.width}px`, "--nh": `${zoomPhoto.height}px` } as CSSProperties}
                  />
                  <button
                    ref={zoomCloseRef}
                    className={styles.zoomClose}
                    type="button"
                    aria-label={c.zoomOut}
                    onClick={(event) => {
                      event.stopPropagation();
                      shrink();
                    }}
                  >
                    <Icon name="close" />
                  </button>
                </figure>
              ) : null}
            </div>
            <p className="sr">{localize(COURSE_SCENES[course.scene].summary, lang)}</p>

            <div className={styles.paragraphs}>
              {course.detail.paragraphs.slice(0, 2).map((paragraph, k) => (
                <p key={k}>{localize(paragraph, lang)}</p>
              ))}
            </div>

            {photos.length ? (
              <ul className={styles.thumbs} role="list">
                {photos.map((photo, index) => (
                  <li key={photo.src} data-target={flying && index === targetIndex ? "" : undefined}>
                    <button
                      ref={(node) => {
                        thumbRefs.current[index] = node;
                      }}
                      className={styles.thumb}
                      type="button"
                      style={{ "--ar": (photo.width / photo.height).toFixed(4) } as CSSProperties}
                      aria-label={format(c.zoomIn, { photo: photo.alt ? localize(photo.alt, lang) : "" })}
                      onClick={() => setZoom({ key: detail.key, index })}
                    >
                      <Image
                        src={photo.src}
                        alt=""
                        width={photo.width}
                        height={photo.height}
                        sizes="190px"
                        style={photo.position ? { objectPosition: photo.position } : undefined}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {course.video ? (
              <div className={styles.actions}>
                <a className={styles.video} href={course.video.href} target="_blank" rel="noopener">
                  <span className={styles.play} aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M7 4.8v14.4c0 .6.7 1 1.2.7l11.3-7.2a.8.8 0 0 0 0-1.4L8.2 4.1C7.7 3.8 7 4.2 7 4.8z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  {c.watch}
                  <span className={styles.duration}>{course.video.duration}</span>
                </a>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </Dialog>
  );
}
