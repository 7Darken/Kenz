"use client";

/**
 * La scène animée de la fiche, qui fait comprendre le sport (HYROX, Spartan, Boxe), en icônes 3D.
 * On comprend en ≈ 3 s (l'intro), puis une petite vie au repos. Ajouter un sport : une entrée dans
 * content/courses.ts (COURSE_SCENES), un composant et son pilote ici.
 */
import { COURSE_SCENES, type CourseSceneId } from "@/content/courses";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import { BoxingScene } from "./boxing-scene";
import { HyroxScene } from "./hyrox-scene";
import { SpartanScene } from "./spartan-scene";

interface CourseSceneProps {
  id: CourseSceneId;
  /** La boucle tourne (fiche ouverte, aucune photo agrandie). */
  running: boolean;
}

export function CourseScene({ id, running }: CourseSceneProps) {
  const reduced = useReducedMotion();
  switch (id) {
    case "hyrox":
      return <HyroxScene scene={COURSE_SCENES.hyrox} running={running} reduced={reduced} />;
    case "spartan":
      return <SpartanScene scene={COURSE_SCENES.spartan} running={running} reduced={reduced} />;
    case "boxe":
      return <BoxingScene scene={COURSE_SCENES.boxe} running={running} reduced={reduced} />;
  }
}
