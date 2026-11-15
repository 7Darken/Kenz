/**
 * Le récit d'un cas, hors de React (maquettes/v6/shared/ia.js, `Machine`) : un minutage et des états.
 * L'entrée apparaît, le jeton de lumière avance de station en station (moins d'une seconde chacune),
 * puis s'arrête à « Vous validez » : rien ne bouge jusqu'à `approve()`. Alors la sortie apparaît.
 * Aperçu : la validation se fait seule après un temps lisible, puis la boucle repart en douceur
 * tant que la machine est à l'écran. Mouvement réduit : pas de trajet, l'état final.
 *
 * Le rendu lit `SceneState` ; ce module ne touche pas au DOM (sauf le focus, demandé par `focusReplay`).
 */
import { IA_CASES, type IaCaseId } from "@/content/ia";

export type MachineMode = "complete" | "preview";

/** repos → marche → attente (du visiteur) → fait. */
type Phase = "rest" | "running" | "waiting" | "done";

/** L'annonce en cours pour les lecteurs d'écran (le texte est résolu au rendu, dans la langue active). */
type Announcement = "working" | "step" | "waiting" | "done" | null;

export interface SceneState {
  /** Change à chaque montage d'un cas : la scène repart d'un état neuf, sans transition de retour. */
  key: number;
  caseId: IaCaseId;
  phase: Phase;
  /** L'entrée est à l'écran. */
  input: boolean;
  /** La machine lit l'entrée (liseré de lumière). */
  read: boolean;
  /** Le jeton est visible. */
  tokenOn: boolean;
  /** Position du jeton : -1 avant la première station, `stations` au bout de la piste. */
  token: number;
  /** Placer le jeton sans glisser (montage, redimensionnement, mouvement réduit). */
  instant: boolean;
  /** Station allumée ; celles d'avant sont passées. */
  lit: number;
  /** La sortie est apparue. */
  output: boolean;
  /** Aperçu : la scène s'efface avant de reboucler. */
  ending: boolean;
  /** Aperçu : « Valider » est pressé tout seul. */
  pressed: boolean;
  /** Mode complet : « Rejouer » est proposé. */
  replay: boolean;
  /** « Rejouer » prend le focus en apparaissant (le visiteur venait de valider au clavier). */
  focusReplay: boolean;
  announcement: Announcement;
}

export function restingScene(caseId: IaCaseId, key = 0): SceneState {
  return {
    key,
    caseId,
    phase: "rest",
    input: false,
    read: false,
    tokenOn: false,
    token: -1,
    instant: true,
    lit: -1,
    output: false,
    ending: false,
    pressed: false,
    replay: false,
    focusReplay: false,
    announcement: null,
  };
}

/** Une étape : moins d'une seconde. */
const STEP_MS = 820;
const FIRST_STEP_MS = 760;
const TOKEN_IN_MS = 560;
/** Temps de lecture avant que la machine démarre, à son entrée à l'écran. */
const START_DELAY_MS: Readonly<Record<MachineMode, number>> = { complete: 600, preview: 300 };

interface StoryOptions {
  mode: MachineMode;
  caseId: IaCaseId;
  update: (next: (scene: SceneState) => SceneState) => void;
  /** Le focus est-il sur « Valider » (ou perdu) ? Alors « Rejouer » le reprendra. */
  approveHadFocus: () => boolean;
}

export interface MachineStory {
  /** Monte un autre cas et le joue. */
  choose: (caseId: IaCaseId) => void;
  /** Rejoue le cas courant. */
  replay: () => void;
  /** Le clic sur « Valider ». */
  approve: () => void;
  /** La machine entre à l'écran ou en sort (complet : jouée une fois ; aperçu : en boucle tant qu'elle est vue). */
  setVisible: (visible: boolean) => void;
  /** Aperçu en mouvement réduit : l'état final, tout de suite et sans boucle. */
  showFinal: () => void;
  destroy: () => void;
}

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createMachineStory({ mode, caseId: initialCase, update, approveHadFocus }: StoryOptions): MachineStory {
  let caseId = initialCase;
  let phase: Phase = "rest";
  let visible = false;
  let timers: number[] = [];
  let frames: number[] = [];

  const patch = (values: Partial<SceneState>) => update((scene) => ({ ...scene, ...values }));
  const after = (ms: number, fn: () => void) => {
    timers.push(window.setTimeout(fn, ms));
  };
  /* Deux images : la scène neuve est peinte avant que l'entrée apparaisse (sa transition joue). */
  const nextPaint = (fn: () => void) => {
    frames.push(requestAnimationFrame(() => frames.push(requestAnimationFrame(fn))));
  };
  const stop = () => {
    timers.forEach(clearTimeout);
    frames.forEach(cancelAnimationFrame);
    timers = [];
    frames = [];
  };
  const stationCount = () => IA_CASES[caseId].steps.length;

  function mount() {
    stop();
    phase = "rest";
    update((scene) => restingScene(caseId, scene.key + 1));
  }

  function play() {
    stop();
    phase = "running";
    const n = stationCount(); // la station n est « Vous validez »
    if (prefersReduced()) {
      update((scene) => ({ ...restingScene(caseId, scene.key + 1), phase: "running", input: true, token: n, lit: n }));
      wait();
      return;
    }
    update((scene) => ({ ...restingScene(caseId, scene.key + 1), phase: "running", announcement: "working" }));
    nextPaint(() => patch({ input: true }));
    after(TOKEN_IN_MS, () => patch({ tokenOn: true }));
    for (let i = 0; i < n; i++) {
      after(FIRST_STEP_MS + i * STEP_MS, () =>
        patch({ token: i, instant: false, lit: i, announcement: "step", ...(i === 0 && { read: true }) }),
      );
    }
    after(FIRST_STEP_MS + n * STEP_MS, () => {
      patch({ token: n, instant: false, lit: n });
      wait();
    });
  }

  function wait() {
    phase = "waiting";
    if (mode === "complete") {
      patch({ phase: "waiting", announcement: "waiting" });
      return;
    }
    patch({ phase: "waiting" });
    // L'aperçu se valide tout seul, après un temps lisible.
    const reduced = prefersReduced();
    after(reduced ? 0 : 1500, () => {
      patch({ pressed: true });
      after(reduced ? 0 : 260, approve);
    });
  }

  function approve() {
    if (phase !== "waiting") return;
    phase = "done";
    const reduced = prefersReduced();
    const n = stationCount();
    patch({ phase: "done", ...(!reduced && { token: n + 1, instant: false }) });
    after(reduced ? 0 : 520, () => patch({ lit: n + 1, output: true, announcement: "done" }));
    if (mode === "complete") {
      after(reduced ? 300 : 1700, () => patch({ replay: true, focusReplay: approveHadFocus() }));
    } else if (!reduced) {
      // Boucle douce : on laisse lire, on efface, puis on repart (ou on se remet au repos hors de l'écran).
      after(4200, () => patch({ ending: true }));
      after(4900, () => (visible ? play() : mount()));
    }
  }

  return {
    choose(next) {
      caseId = next;
      play();
    },
    replay: play,
    approve,
    setVisible(next) {
      if (next === visible) return;
      visible = next;
      if (visible) {
        if (phase !== "rest") return;
        after(START_DELAY_MS[mode], () => {
          if (visible && phase === "rest") play();
        });
      } else if (mode === "preview") {
        mount();
      }
    },
    showFinal: play,
    destroy: stop,
  };
}
