/**
 * Les sept animations de « Comment ça marche », une par app : le contenu de l'écran, sa timeline, la teinte
 * de l'écran, et la mention « exemple » (données d'exemple) avec sa place.
 */
import type { ComponentType } from "react";

import type { AppSlug } from "@/content/apps";
import { buildCroc, CrocScene } from "./croc-scene";
import crocStyles from "./croc-scene.module.css";
import { buildEscapades, EscapadesScene } from "./escapades-scene";
import escapadesStyles from "./escapades-scene.module.css";
import { buildMiru, MiruScene } from "./miru-scene";
import miruStyles from "./miru-scene.module.css";
import { buildOshii, OshiiScene } from "./oshii-scene";
import oshiiStyles from "./oshii-scene.module.css";
import { buildSago, SagoScene } from "./sago-scene";
import sagoStyles from "./sago-scene.module.css";
import type { SceneBuilder } from "./scene-kit";
import { buildWado, WadoScene } from "./wado-scene";
import wadoStyles from "./wado-scene.module.css";
import { buildZenko, ZenkoScene } from "./zenko-scene";
import zenkoStyles from "./zenko-scene.module.css";

export interface SceneEntry {
  Content: ComponentType;
  build: SceneBuilder;
  /** La teinte de l'écran (--tint, --sc-a, --sc-b), clair et sombre. */
  className: string;
  /** « exemple » : en bas (défaut), en haut, ou absent (rien d'inventé à signaler). */
  sample: "bottom" | "top" | null;
}

export const SCENES: Readonly<Record<AppSlug, SceneEntry>> = {
  oshii: { Content: OshiiScene, build: buildOshii, className: oshiiStyles.scene, sample: "top" },
  sago: { Content: SagoScene, build: buildSago, className: sagoStyles.scene, sample: null },
  wado: { Content: WadoScene, build: buildWado, className: wadoStyles.scene, sample: "bottom" },
  croc: { Content: CrocScene, build: buildCroc, className: crocStyles.scene, sample: "bottom" },
  miru: { Content: MiruScene, build: buildMiru, className: miruStyles.scene, sample: "bottom" },
  zenko: { Content: ZenkoScene, build: buildZenko, className: zenkoStyles.scene, sample: "bottom" },
  "escapades-libres": { Content: EscapadesScene, build: buildEscapades, className: escapadesStyles.scene, sample: null },
};
