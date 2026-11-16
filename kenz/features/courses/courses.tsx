"use client";

/**
 * Mes courses : les compositions photo (parallaxe au défilement) et la fiche détail, pilotées par la liste
 * de content/courses.ts. Voir ./index.ts pour le contrat (ids, variant, headingLevel, --courses-bg).
 */
import { useId, useRef, useState } from "react";

import { COURSES, isCourseId, type CourseId } from "@/content/courses";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import { CourseDialog, type CourseDetail } from "./course-dialog";
import { CourseItem, type CourseHeadingLevel } from "./course-item";
import styles from "./courses.module.css";
import { useParallax } from "./use-parallax";

export interface CoursesProps {
  /** Les courses à montrer, dans cet ordre (un id inconnu est ignoré). */
  ids: readonly string[];
  variant: "landing" | "page";
  /** Niveau des noms de course (défaut h3). */
  headingLevel?: CourseHeadingLevel;
}

export function Courses({ ids, variant, headingLevel = "h3" }: CoursesProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const reduced = useReducedMotion();
  const [detail, setDetail] = useState<CourseDetail | null>(null);
  const [open, setOpen] = useState(false);
  const list = ids.filter(isCourseId);

  useParallax(rootRef, !reduced, list.length);

  const openDetail = (id: CourseId, source: HTMLImageElement | null, trigger: HTMLButtonElement) => {
    // Le bouton prend le focus avant l'ouverture : la fiche le lui rendra en se fermant.
    trigger.focus({ preventScroll: true });
    const flies = !reduced && source !== null && source.getBoundingClientRect().width > 0;
    const photo = flies ? source.closest<HTMLElement>("[data-photo]")?.dataset.photo : undefined;
    setDetail((previous) => ({ id, source: flies ? source : null, photo, key: (previous?.key ?? 0) + 1 }));
    setOpen(true);
  };

  const cls = [styles.courses, styles[variant], variant === "landing" && list.length === 1 && styles.single]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={cls}>
      <ul className={styles.list} role="list">
        {list.map((id, index) => (
          <CourseItem
            key={id}
            course={COURSES[id]}
            index={index}
            headingId={`${uid}-${id}`}
            headingLevel={headingLevel}
            onOpen={(source, trigger) => openDetail(id, source, trigger)}
          />
        ))}
      </ul>
      <CourseDialog detail={detail} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
