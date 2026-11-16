"use client";

/**
 * Dialogue modal accessible, sur l'élément natif <dialog> (showModal) :
 * - le reste de la page est inerte (focus piégé dans le dialogue), le défilement de la page est bloqué ;
 * - Échap, un clic sur le fond ou le bouton de fermeture demandent la fermeture : `onClose(reason)` dit lequel, et le
 *   parent décide (ex. dans la fiche d'une course, Échap réduit d'abord la photo agrandie). Échap est pris au clavier,
 *   avant le navigateur : il ne ferme jamais le dialogue de lui-même. Le fond, c'est hors de la fiche, là où le geste
 *   a commencé et fini (une sélection de texte qui déborde ne ferme rien) ;
 * - à la fermeture, le focus revient à l'élément qui l'avait ouvert.
 * Le dialogue reste dans l'arbre de l'univers : il hérite de ses jetons (k15ze, Créateur…).
 * Nommer le dialogue : `labelledBy` (id du titre) ou `label`.
 */
import { useEffect, useRef, type ReactNode } from "react";

import { useMotion } from "@/design-system/motion/motion-provider";
import { useTranslation } from "@/i18n/language-provider";
import styles from "./dialog.module.css";
import { IconButton } from "./icon-button";

/**
 * Ce qui demande la fermeture : Échap, un clic sur le fond, le bouton de fermeture du dialogue, ou le navigateur
 * (`browser` : il a déjà fermé le dialogue, par exemple au geste « retour » d'Android ; le parent ne peut que suivre).
 */
export type DialogCloseReason = "escape" | "backdrop" | "button" | "browser";

/** Le point (x, y) est-il hors du rectangle du dialogue (sur son fond) ? */
function onBackdrop(dialog: HTMLDialogElement, x: number, y: number) {
  const r = dialog.getBoundingClientRect();
  return x < r.left || x > r.right || y < r.top || y > r.bottom;
}

interface DialogProps {
  open: boolean;
  onClose: (reason: DialogCloseReason) => void;
  labelledBy?: string;
  label?: string;
  /** `sheet` : une feuille qui monte du bas sur mobile. */
  variant?: "center" | "sheet";
  /** Bouton de fermeture en haut à droite (défaut : oui). */
  closeButton?: boolean;
  className?: string;
  children: ReactNode;
}

export function Dialog({
  open,
  onClose,
  labelledBy,
  label,
  variant = "center",
  closeButton = true,
  className,
  children,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  /** Le geste a commencé sur le fond (un clic qui finit sur le fond ne ferme que s'il y a commencé). */
  const pressedBackdropRef = useRef(false);
  const motion = useMotion();
  const t = useTranslation();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.documentElement.style.overflow;
    dialog.showModal();
    motion.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      if (dialog.open) dialog.close();
      motion.start();
      document.documentElement.style.overflow = overflow;
      opener?.focus({ preventScroll: true });
    };
  }, [open, motion]);

  const cls = [styles.dialog, variant === "sheet" && styles.sheet, className].filter(Boolean).join(" ");

  return (
    <dialog
      ref={ref}
      className={cls}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
      onKeyDown={(event) => {
        // Échap, pris avant le navigateur : c'est le parent qui décide (état contrôlé).
        if (event.key !== "Escape" || event.nativeEvent.isComposing) return;
        event.preventDefault();
        event.stopPropagation();
        onClose("escape");
      }}
      onCancel={(event) => {
        // Une autre demande de fermeture du système (le geste « retour », par exemple) : comme Échap.
        event.preventDefault();
        onClose("escape");
      }}
      onClose={() => {
        // Le navigateur a fermé le dialogue sans qu'on puisse l'en empêcher : on synchronise.
        if (open) onClose("browser");
      }}
      onPointerDown={(event) => {
        pressedBackdropRef.current =
          event.target === event.currentTarget && onBackdrop(event.currentTarget, event.clientX, event.clientY);
      }}
      onClick={(event) => {
        // Le fond : la cible est le dialogue lui-même (son ::backdrop), hors de son rectangle.
        const pressed = pressedBackdropRef.current;
        pressedBackdropRef.current = false;
        if (pressed && event.target === event.currentTarget && onBackdrop(event.currentTarget, event.clientX, event.clientY)) {
          onClose("backdrop");
        }
      }}
    >
      {closeButton ? (
        <IconButton
          className={styles.close}
          icon="close"
          label={t.common.actions.close}
          size="sm"
          onClick={() => onClose("button")}
        />
      ) : null}
      {children}
    </dialog>
  );
}
