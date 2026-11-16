"use client";

/**
 * Une course : la composition (une grande photo, une ou deux en décalé, le nom en Anton qui mord sur le bas)
 * et le texte dessous. Toute la composition ouvre la fiche au clic ; au clavier, c'est « Voir le détail ».
 * `data-speed` : la vitesse de parallaxe de chaque calque (en % de l'écran sur la traversée, ./use-parallax).
 */
import { Fragment, useRef, type CSSProperties } from "react";

import type { Course } from "@/content/courses";
import { Icon } from "@/design-system/components/icon";
import { useInView } from "@/design-system/motion/use-in-view";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { CourseFrame, frameRatio } from "./course-frame";
import { CourseWhen } from "./course-when";
import styles from "./courses.module.css";
import { RingDrawing } from "./ring-drawing";

export type CourseHeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

interface CourseItemProps {
  course: Course;
  index: number;
  headingId: string;
  headingLevel: CourseHeadingLevel;
  /** Ouvre la fiche : la photo cliquée (elle vole jusqu'à sa vignette) et le bouton qui reprendra le focus. */
  onOpen: (source: HTMLImageElement | null, trigger: HTMLButtonElement) => void;
}

/* Largeurs affichées de chaque calque (la composition fait la moitié du conteneur sur ordinateur). */
const SIZES = {
  a: "(min-width: 900px) 440px, 62vw",
  b: "(min-width: 900px) 300px, 40vw",
  c: "(min-width: 900px) 220px, 30vw",
};

export function CourseItem({ course, index, headingId, headingLevel: Heading, onOpen }: CourseItemProps) {
  const articleRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inView = useInView(articleRef, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
  const { lang, t } = useLanguage();
  const name = localize(course.name, lang);
  const [main, second, third] = course.photos;

  const mainImage = () => articleRef.current?.querySelector<HTMLImageElement>(`.${styles.frameA} img`) ?? null;
  const open = (source: HTMLImageElement | null) => {
    if (buttonRef.current) onOpen(source, buttonRef.current);
  };

  const compoClass = [styles.compo, !main && styles.compoDrawing].filter(Boolean).join(" ");

  return (
    <li className={styles.item} style={{ "--i": index } as CSSProperties}>
      <article ref={articleRef} className={styles.course} data-in={inView ? "" : undefined} aria-labelledby={headingId}>
        <div
          className={compoClass}
          data-compo=""
          onClick={(event) => {
            const frame = (event.target as Element).closest("[data-photo]");
            open(frame?.querySelector("img") ?? mainImage());
          }}
        >
          {main ? (
            <>
              <figure className={`${styles.layer} ${styles.layerA}`} data-speed="2">
                <CourseFrame
                  photo={main}
                  alt={main.alt ? localize(main.alt, lang) : ""}
                  ratio={0.8}
                  sizes={SIZES.a}
                  className={styles.frameA}
                  eager={index === 0}
                />
              </figure>
              {second ? (
                <figure className={`${styles.layer} ${styles.layerB}`} data-speed="7">
                  <CourseFrame
                    photo={second}
                    alt={second.alt ? localize(second.alt, lang) : ""}
                    ratio={frameRatio(second)}
                    sizes={SIZES.b}
                  />
                </figure>
              ) : null}
              {third ? (
                <figure className={`${styles.layer} ${styles.layerC}`} data-speed="4.5">
                  <CourseFrame
                    photo={third}
                    alt={third.alt ? localize(third.alt, lang) : ""}
                    ratio={frameRatio(third)}
                    sizes={SIZES.c}
                  />
                </figure>
              ) : null}
            </>
          ) : (
            <figure className={`${styles.layer} ${styles.layerA}`} data-speed="2">
              <div className={`${styles.frame} ${styles.frameEmpty}`}>{course.drawing === "ring" ? <RingDrawing /> : null}</div>
            </figure>
          )}
          <Heading className={styles.name} id={headingId} data-speed="3.2">
            {name}
          </Heading>
        </div>

        <div className={styles.text}>
          <CourseWhen course={course} className={styles.when} />
          <p className={styles.summary}>{localize(course.summary, lang)}</p>
          {course.figures.length ? (
            <p className={styles.figures}>
              {course.figures.map((figure, k) => (
                <Fragment key={k}>
                  {k > 0 ? (
                    <span className={styles.sep} aria-hidden="true">
                      ·
                    </span>
                  ) : null}
                  <span className={styles.figure}>
                    <b>{figure.value}</b> {localize(figure.label, lang)}
                  </span>
                </Fragment>
              ))}
            </p>
          ) : null}
          <button
            ref={buttonRef}
            className={styles.open}
            type="button"
            aria-haspopup="dialog"
            aria-label={format(t.sport.courses.openLabel, { course: name })}
            onClick={() => open(mainImage())}
          >
            {t.sport.courses.open}
            <span className={styles.plus} aria-hidden="true">
              <Icon name="plus" />
            </span>
          </button>
        </div>
      </article>
    </li>
  );
}
