"use client";

import { useCallback, useEffect } from "react";
import { flushSync } from "react-dom";
import styled, { createGlobalStyle, css } from "styled-components";
import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { useTranslation } from "@/contexts/language-context";
import { useMediaQuery, useStoredState } from "@/lib/browser-state";

/* ═══════════════════════════════════════════
   LIGHT / DARK THEME
   Colours live in CSS variables on :root so the site navbar (outside the
   page) follows too. Without an explicit choice the OS preference applies
   from the very first paint, through a media query — no flash.
   ═══════════════════════════════════════════ */

export type ItineraryThemeName = "light" | "dark";

const STORAGE_KEY = "kenz-itinerary-theme";
const ROOT_ATTRIBUTE = "data-itinerary-theme";

const darkVars = css`
  color-scheme: dark;
  --it-bg: #030305;
  --it-surface: rgba(255, 255, 255, 0.035);
  --it-surface-hover: rgba(255, 255, 255, 0.06);
  --it-surface-solid: #0b0b0f;
  --it-fill: rgba(255, 255, 255, 0.05);
  --it-fill-strong: rgba(255, 255, 255, 0.1);
  --it-border: rgba(255, 255, 255, 0.08);
  --it-border-strong: rgba(255, 255, 255, 0.16);
  --it-ink: #ffffff;
  --it-text: #f5f5f7;
  --it-muted: rgba(255, 255, 255, 0.6);
  --it-faint: rgba(255, 255, 255, 0.38);
  --it-inverse: #ffffff;
  --it-on-inverse: #08080a;
  --it-inverse-hover: #ececf0;
  --it-shadow: rgba(0, 0, 0, 0.75);
  --it-highlight: rgba(255, 255, 255, 0.07);
  --it-overlay: rgba(3, 3, 5, 0.62);
  --it-sheet: linear-gradient(180deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.02));
  --it-dock: rgba(14, 14, 18, 0.72);
  --it-tint-mix: 88%;
  --it-grain-opacity: 0.05;
  --it-grain-blend: overlay;
  --it-watermark: rgba(255, 255, 255, 0.035);
  --it-map-dot: rgba(255, 255, 255, 0.13);
  --it-map-line: rgba(255, 255, 255, 0.14);
  --it-tip-text: rgba(255, 236, 200, 0.85);
  --it-tip-accent: #f5c76b;
  --it-tip-bg: rgba(245, 199, 107, 0.07);
  --it-tip-border: rgba(245, 199, 107, 0.18);
`;

const lightVars = css`
  color-scheme: light;
  --it-bg: #f4f2ee;
  --it-surface: rgba(255, 255, 255, 0.72);
  --it-surface-hover: #ffffff;
  --it-surface-solid: #ffffff;
  --it-fill: rgba(20, 18, 30, 0.045);
  --it-fill-strong: rgba(20, 18, 30, 0.09);
  --it-border: rgba(20, 18, 30, 0.09);
  --it-border-strong: rgba(20, 18, 30, 0.18);
  --it-ink: #0d0c12;
  --it-text: #1a1920;
  --it-muted: rgba(26, 25, 32, 0.68);
  --it-faint: rgba(26, 25, 32, 0.46);
  --it-inverse: #0d0c12;
  --it-on-inverse: #ffffff;
  --it-inverse-hover: #2a2933;
  --it-shadow: rgba(60, 45, 30, 0.16);
  --it-highlight: rgba(255, 255, 255, 0.9);
  --it-overlay: rgba(244, 242, 238, 0.55);
  --it-sheet: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.78));
  --it-dock: rgba(255, 255, 255, 0.8);
  --it-tint-mix: 70%;
  --it-grain-opacity: 0.04;
  --it-grain-blend: multiply;
  --it-watermark: rgba(20, 18, 30, 0.045);
  --it-map-dot: rgba(20, 18, 30, 0.16);
  --it-map-line: rgba(20, 18, 30, 0.18);
  --it-tip-text: #5e4210;
  --it-tip-accent: #b7791f;
  --it-tip-bg: rgba(245, 199, 107, 0.16);
  --it-tip-border: rgba(214, 160, 60, 0.35);

  /* Read by the site navbar and language switch, which fall back to dark. */
  --nav-bg: rgba(244, 242, 238, 0.78);
  --nav-border: rgba(20, 18, 30, 0.08);
  --nav-shadow: 0 4px 30px rgba(60, 45, 30, 0.08);
  --nav-text: rgba(26, 25, 32, 0.62);
  --nav-text-strong: #0d0c12;
  --nav-text-faint: rgba(26, 25, 32, 0.45);
  --nav-hover: rgba(20, 18, 30, 0.05);
  --nav-panel: rgba(255, 255, 255, 0.96);
  --nav-panel-border: rgba(20, 18, 30, 0.08);
  --nav-overlay: rgba(244, 242, 238, 0.97);
  --nav-fill: rgba(20, 18, 30, 0.05);
  --nav-pill: #0d0c12;
  --nav-pill-text: #ffffff;
  --nav-logo-filter: invert(1);
`;

/** Mounted only while an itinerary page is open, so nothing leaks to the rest of the site. */
export const ItineraryThemeStyles = createGlobalStyle`
  :root {
    ${darkVars}
  }

  @media (prefers-color-scheme: light) {
    :root:not([${ROOT_ATTRIBUTE}="dark"]) {
      ${lightVars}
    }
  }

  :root[${ROOT_ATTRIBUTE}="light"] {
    ${lightVars}
  }

  :root,
  :root body {
    background-color: var(--it-bg);
  }

  ::-webkit-scrollbar-track {
    background: var(--it-bg);
  }

  /* Circular reveal when switching theme (View Transitions API). */
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
  }
`;

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

export function useItineraryTheme() {
  const [stored, setStored] = useStoredState(STORAGE_KEY);
  const prefersLight = useMediaQuery("(prefers-color-scheme: light)");
  const reduceMotion = useReducedMotion();
  const choice: ItineraryThemeName | null = stored === "light" || stored === "dark" ? stored : null;
  const theme: ItineraryThemeName = choice ?? (prefersLight ? "light" : "dark");

  /** Switches theme; with an origin point the new theme is revealed in a circle from there. */
  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: ItineraryThemeName = theme === "light" ? "dark" : "light";
      const apply = () => {
        document.documentElement.setAttribute(ROOT_ATTRIBUTE, next);
        setStored(next);
      };

      const doc = document as ViewTransitionDocument;
      if (!origin || reduceMotion || !doc.startViewTransition) {
        apply();
        return;
      }

      const transition = doc.startViewTransition(() => flushSync(apply));
      const radius = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y),
      );
      void transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${origin.x}px ${origin.y}px)`,
              `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
            ],
          },
          { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      });
    },
    [theme, reduceMotion, setStored],
  );

  return { theme, choice, toggle };
}

/** Mirrors an explicit choice onto <html> (needed after reloads) and cleans up when leaving the page. */
export function useThemeAttribute(choice: ItineraryThemeName | null) {
  useEffect(() => {
    const root = document.documentElement;
    if (choice) root.setAttribute(ROOT_ATTRIBUTE, choice);
    else root.removeAttribute(ROOT_ATTRIBUTE);
  }, [choice]);

  useEffect(() => () => document.documentElement.removeAttribute(ROOT_ATTRIBUTE), []);
}

/* ═══════════════════════════════════════════
   TOGGLE — a pill switch with a sliding knob
   ═══════════════════════════════════════════ */

export function ThemeToggle() {
  const t = useTranslation().itinerary.theme;
  const { theme, toggle } = useItineraryTheme();
  const isDark = theme === "dark";
  const label = isDark ? t.toLight : t.toDark;

  return (
    <Track
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
    >
      <Sun size={13} aria-hidden />
      <Moon size={13} aria-hidden />
      <Knob
        initial={false}
        animate={{ x: isDark ? 28 : 0, rotate: isDark ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
      >
        {isDark ? <Moon size={13} /> : <Sun size={13} />}
      </Knob>
    </Track>
  );
}

const Track = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 62px;
  height: 34px;
  padding: 0 9px;
  border-radius: 100px;
  color: var(--it-faint);
  background: var(--it-fill);
  border: 1px solid var(--it-border);
  transition: border-color 0.25s ease;

  &:hover {
    border-color: var(--it-border-strong);
  }

  &:focus-visible {
    outline: 2px solid var(--it-ink);
    outline-offset: 2px;
  }
`;

const Knob = styled(motion.span)`
  position: absolute;
  top: 3px;
  left: 3px;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  color: var(--it-on-inverse);
  background: var(--it-inverse);
  box-shadow: 0 4px 12px -2px var(--it-shadow);
`;
