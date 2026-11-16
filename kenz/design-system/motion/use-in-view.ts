"use client";

import { useEffect, useState, type RefObject } from "react";

interface InViewOptions {
  /** Part visible avant de déclencher (défaut : le réglage de l'univers, voir `universeTrigger`). */
  threshold?: number;
  /** Marge de la fenêtre (défaut : le réglage de l'univers, un peu avant le bas de l'écran). */
  rootMargin?: string;
  /** Une seule fois (défaut) : l'état reste vrai après la première entrée. */
  once?: boolean;
}

/**
 * Le réglage des apparitions à l'entrée (Reveal, Words, SweepTitle) dans l'univers de l'élément, repris des
 * maquettes : pro.html, app.html et agents.html (.16, marge basse de 6 %) ; createur.html et voyage.html (.12, 10 %) ;
 * sport.html (.14, 10 %).
 */
function universeTrigger(el: Element): { threshold: number; rootMargin: string } {
  switch (el.closest("[data-univers]")?.getAttribute("data-univers")) {
    case "createur":
      return { threshold: 0.12, rootMargin: "0px 0px -10% 0px" };
    case "k15ze":
      return { threshold: 0.14, rootMargin: "0px 0px -10% 0px" };
    default:
      return { threshold: 0.16, rootMargin: "0px 0px -6% 0px" };
  }
}

type Callback = (entry: IntersectionObserverEntry) => void;

/* Un observateur partagé par jeu d'options : des centaines d'éléments, quelques observateurs. */
const observers = new Map<string, { io: IntersectionObserver; callbacks: Map<Element, Callback> }>();

function observe(el: Element, key: string, init: IntersectionObserverInit, callback: Callback) {
  let entry = observers.get(key);
  if (!entry) {
    const callbacks = new Map<Element, Callback>();
    const io = new IntersectionObserver((records) => {
      records.forEach((record) => callbacks.get(record.target)?.(record));
    }, init);
    entry = { io, callbacks };
    observers.set(key, entry);
  }
  entry.callbacks.set(el, callback);
  entry.io.observe(el);
  const { io, callbacks } = entry;
  return () => {
    callbacks.delete(el);
    io.unobserve(el);
  };
}

/** L'élément est-il entré à l'écran ? (IntersectionObserver partagé, nettoyé au démontage) */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { threshold, rootMargin, once = true }: InViewOptions = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const base = universeTrigger(el);
    const init = { threshold: threshold ?? base.threshold, rootMargin: rootMargin ?? base.rootMargin };
    const key = `${init.threshold}|${init.rootMargin}`;
    const stop = observe(el, key, init, (record) => {
      if (record.isIntersecting) {
        setInView(true);
        if (once) stop();
      } else if (!once) {
        setInView(false);
      }
    });
    return () => stop();
  }, [ref, threshold, rootMargin, once]);

  return inView;
}
