"use client";

/**
 * Dialogue modal accessible, sur l'élément natif <dialog> (showModal) :
 * - le reste de la page est inerte (focus piégé dans le dialogue), le défilement de la page est bloqué ;
 * - Échap ou un clic sur le fond ferment (onClose) ;
 * - à la fermeture, le focus revient à l'élément qui l'avait ouvert.
 * Le dialogue reste dans l'arbre de l'univers : il hérite de ses jetons (k15ze, Créateur…).
 * Nommer le dialogue : `labelledBy` (id du titre) ou `label`.
 */
import { useEffect, useRef, type ReactNode } from "react";

import { useMotion } from "@/features/motion/motion-provider";
import { useTranslation } from "@/i18n/language-provider";
import styles from "./dialog.module.css";
import { IconButton } from "./icon-button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
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
      onCancel={(event) => {
        // Échap : c'est le parent qui ferme (état contrôlé).
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        // Fermeture native (ex. Échap répété, que le navigateur ne laisse plus annuler) : on synchronise.
        if (open) onClose();
      }}
      onClick={(event) => {
        // Un clic sur le fond (le dialogue lui-même, hors de son contenu) ferme.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {closeButton ? (
        <IconButton className={styles.close} icon="close" label={t.common.actions.close} size="sm" onClick={onClose} />
      ) : null}
      {children}
    </dialog>
  );
}
