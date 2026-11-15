"use client";

/**
 * Le chef d'orchestre des passages, monté une fois par univers (UniverseShell) :
 * - il branche le routeur Next (les passages naviguent après leur animation) ;
 * - il intercepte les liens `[data-passage]` (attributs posés par `passageAttributes()`) : le voile prend la couleur
 *   `data-couleur` (`data-couleur-clair` en mode clair) et part de `data-source` (un sélecteur : l'élément qui
 *   s'ouvre, cherché d'abord parmi les ancêtres du lien) ou du lien lui-même ;
 * - il joue l'arrivée quand la page visée s'affiche (le voile, lui, vit dans <body> et survit au changement de layout).
 * Les liens externes, ouverts dans un autre onglet, avec une touche de modification ou vers la page courante gardent
 * leur comportement. Pendant un passage, les clics sont retenus.
 */
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { connectRouter, consumeSilencedClick, isPassageBusy, releaseAll, takeArrival } from "./passage-state";
import { playPortalArrival } from "./portal";
import { openPassage, playVeilArrival } from "./veil";

function sourceOf(link: HTMLAnchorElement): Element {
  const selector = link.dataset.source;
  if (!selector) return link;
  try {
    return link.closest(selector) ?? document.querySelector(selector) ?? link;
  } catch {
    return link;
  }
}

function onClick(event: MouseEvent) {
  // Un passage en cours, ou le clic qui suit un geste secret : rien ne part.
  if (isPassageBusy() || consumeSilencedClick()) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest("a[data-passage]") : null;
  if (!(link instanceof HTMLAnchorElement) || link.hasAttribute("download")) return;
  if (link.target && link.target !== "_self") return;
  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return;
  if (url.pathname === window.location.pathname && url.search === window.location.search) return;
  const light = document.documentElement.getAttribute("data-theme") === "light";
  const color = (light && link.dataset.couleurClair) || link.dataset.couleur;
  if (openPassage(sourceOf(link), url.href, { color })) {
    event.preventDefault();
    event.stopPropagation();
  }
}

/** Retour arrière depuis une autre page (cache du navigateur) : la page revient intacte. */
function onPageShow(event: PageTransitionEvent) {
  if (event.persisted) releaseAll();
}

export function PassageRoot() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(
    () => connectRouter({ push: (href) => router.push(href), prefetch: (href) => router.prefetch(href) }),
    [router],
  );

  // En capture sur window : avant next/link, qui ne navigue pas si le clic est déjà pris.
  useEffect(() => {
    window.addEventListener("click", onClick, true);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  // La page visée par un passage s'affiche : son arrivée se joue (elle ne dépend pas de ce composant).
  useEffect(() => {
    const arrival = takeArrival(pathname);
    if (!arrival) return;
    if (arrival.kind === "passage") playVeilArrival(arrival);
    else playPortalArrival(arrival.kind);
  }, [pathname]);

  return null;
}
