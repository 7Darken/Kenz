/**
 * Le mode clair / sombre, hors de React : lu sur <html data-theme> (posé par le script inline),
 * mémorisé au choix du visiteur, sinon le système (suivi en direct tant que rien n'est mémorisé).
 * Une bascule par le visiteur se fait en fondu de 400 ms (View Transitions, sinon fondu des couleurs).
 * Événement DOM « kz-theme:change » (detail { theme }) pour le code hors React (ex. le globe three.js).
 */
import { THEME_STORAGE_KEY } from "./theme-script";

export type Theme = "dark" | "light";

const listeners = new Set<() => void>();
let fadeTimer = 0;

const isTheme = (value: unknown): value is Theme => value === "dark" || value === "light";

function readStored(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

const systemTheme = (): Theme => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export function getTheme(): Theme {
  const value = document.documentElement.getAttribute("data-theme");
  return isTheme(value) ? value : "dark";
}

/** La barre du navigateur (mobile) prend la couleur du fond de la page. */
export function syncThemeColor() {
  const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
  if (!bg) return;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = bg;
}

function apply(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  syncThemeColor();
  listeners.forEach((listener) => listener());
  document.dispatchEvent(new CustomEvent("kz-theme:change", { detail: { theme } }));
}

/** Choix du visiteur : mémorisé, avec le fondu de bascule. */
export function setTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* stockage indisponible : le choix tient pour la page */
  }
  if (theme === getTheme()) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && typeof document.startViewTransition === "function" && !document.hidden) {
    document.startViewTransition(() => apply(theme));
    return;
  }
  const html = document.documentElement;
  html.classList.add("kz-bascule");
  apply(theme);
  window.clearTimeout(fadeTimer);
  fadeTimer = window.setTimeout(() => html.classList.remove("kz-bascule"), 460);
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  // Tant que rien n'est mémorisé, on suit le système en direct.
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystem = () => {
    if (!readStored()) apply(systemTheme());
  };
  mq.addEventListener("change", onSystem);
  return () => {
    listeners.delete(listener);
    mq.removeEventListener("change", onSystem);
  };
}
