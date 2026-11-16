"use client";

/**
 * Le mouvement du site : une seule instance Lenis (défilement doux, souris seulement), synchronisée avec
 * GSAP et ScrollTrigger (enregistrés une fois dans ./gsap). Mouvement réduit : pas de Lenis.
 * Gère aussi les ancres internes (#contact, #top) en douceur, et lève le garde-fou du script de thème.
 *
 * API (useMotion) : scrollTo(cible), stop() / start() (dialogues, passages), lenis() (instance ou null).
 */
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";

import { gsap, ScrollTrigger } from "./gsap";
import { useReducedMotion } from "./use-reduced-motion";

type ScrollTarget = number | string | HTMLElement;

interface MotionApi {
  /** Défile vers une position, un sélecteur ou un élément (en douceur, sauf mouvement réduit). */
  scrollTo: (target: ScrollTarget, options?: { immediate?: boolean; offset?: number }) => void;
  /** Bloque le défilement (dialogue ouvert, passage en cours). */
  stop: () => void;
  /** Rend le défilement. */
  start: () => void;
  /** L'instance Lenis, ou null (mouvement réduit, écran tactile). */
  lenis: () => Lenis | null;
}

const MotionContext = createContext<MotionApi | null>(null);

/** Le garde-fou posé par le script de thème : sans application, on rend tout visible au bout de 4 s. */
declare global {
  interface Window {
    __kzBoot?: number;
  }
}

function resolveY(target: ScrollTarget, offset = 0): number {
  if (typeof target === "number") return target + offset;
  const el = typeof target === "string" ? document.querySelector(target) : target;
  return el ? el.getBoundingClientRect().top + window.scrollY + offset : window.scrollY;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  const api = useMemo<MotionApi>(
    () => ({
      scrollTo(target, { immediate = false, offset = 0 } = {}) {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target, { offset, immediate, duration: 1.4 });
          return;
        }
        const smooth = !immediate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: resolveY(target, offset), behavior: smooth ? "smooth" : "auto" });
      },
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
      lenis: () => lenisRef.current,
    }),
    [],
  );

  // L'application a démarré : on lève le garde-fou du script de thème.
  useEffect(() => {
    window.clearTimeout(window.__kzBoot);
  }, []);

  // Lenis : ordinateur (pointeur fin) et sans mouvement réduit, piloté par le ticker de GSAP.
  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, autoRaf: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // Nouvelle page : Lenis remesure la hauteur, ScrollTrigger recalcule ses déclencheurs.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      lenisRef.current?.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  // Ancres internes : #top remonte en haut, #id défile jusqu'à la cible (et lui donne le focus si focusable).
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
      if (!link || link.target === "_blank") return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const id = decodeURIComponent(url.hash.slice(1));
      const target = id === "top" ? null : document.getElementById(id);
      if (id !== "top" && !target) return;
      event.preventDefault();
      api.scrollTo(target ?? 0);
      if (target?.hasAttribute("tabindex")) {
        const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900;
        window.setTimeout(() => target.focus({ preventScroll: true }), delay);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [api]);

  return <MotionContext.Provider value={api}>{children}</MotionContext.Provider>;
}

export function useMotion(): MotionApi {
  const context = useContext(MotionContext);
  if (!context) throw new Error("useMotion doit être utilisé sous <MotionProvider>");
  return context;
}
