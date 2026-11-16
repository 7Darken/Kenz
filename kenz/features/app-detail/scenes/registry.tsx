"use client";

/**
 * Les sept animations de « Comment ça marche », une par app. Chacune est un morceau à part (son JS et son
 * CSS Module, ~1 500 lignes de CSS en tout) : une page d'app ne charge que la sienne. Chaque module de scène
 * exporte par défaut le chapitre monté autour de son écran (sa timeline, sa teinte, la mention « exemple »).
 */
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import type { App, AppSlug } from "@/content/apps";

type SceneChapter = ComponentType<{ app: App }>;

const SCENES: Readonly<Record<AppSlug, SceneChapter>> = {
  oshii: dynamic(() => import("./oshii-scene")),
  sago: dynamic(() => import("./sago-scene")),
  wado: dynamic(() => import("./wado-scene")),
  croc: dynamic(() => import("./croc-scene")),
  miru: dynamic(() => import("./miru-scene")),
  zenko: dynamic(() => import("./zenko-scene")),
  "escapades-libres": dynamic(() => import("./escapades-scene")),
};

/** 3. Comment ça marche : le chapitre de l'app (sa scène seule est chargée). */
export function HowItWorksChapter({ app }: { app: App }) {
  const Scene = SCENES[app.slug];
  return <Scene app={app} />;
}
