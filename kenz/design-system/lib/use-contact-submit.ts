"use client";

/**
 * L'envoi d'un formulaire vers `POST /api/contact`, partagé par le contact Pro (features/contact) et
 * Marques & collaborations (features/marques) ; dans le design system, pour qu'aucun des deux univers n'embarque
 * le formulaire de l'autre :
 * - `submit(body)` valide avec `validateContact` (le même code que le serveur), envoie, lit la réponse, et rend
 *   les erreurs de champ à afficher : celles du navigateur, sinon celles du serveur. Vide quand le message est
 *   parti, ou quand l'envoi a échoué (alors `failed`, à afficher dans une région `role="status"` permanente).
 * - L'état « Merci » : le bloc est monté (`okShown`), puis passe en « envoyé » (`sent`) une fois peint, pour que
 *   ses transitions partent de l'état caché ; son titre (`okTitleRef`) reçoit le focus après `focusDelay` ms.
 *   `onSent` : un geste en plus au même moment (ex. remonter jusqu'au formulaire sur téléphone).
 * - `again(focusFirst)` : le formulaire revient ; après le fondu, le merci se démonte et `focusFirst` est appelé.
 * Un seul minuteur, remplacé à chaque étape et annulé au démontage.
 */
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { validateContact, type ContactFieldErrors, type ContactRequest, type ContactResponse } from "@/content/contact";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";

interface ContactSubmitOptions {
  /** Le délai avant que le titre du merci prenne le focus (mouvement réduit : 50 ms). */
  focusDelay: number;
  onSent?: () => void;
}

/** Le fondu du merci vers le formulaire (ms). */
const AGAIN_MS = 320;

const NO_ERRORS: ContactFieldErrors = {};

export function useContactSubmit({ focusDelay, onSent }: ContactSubmitOptions) {
  const reduced = useReducedMotion();
  const okRef = useRef<HTMLDivElement>(null);
  const okTitleRef = useRef<HTMLHeadingElement>(null);
  const timerRef = useRef(0);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [okShown, setOkShown] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const later = (fn: () => void, ms: number) => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(fn, ms);
  };

  async function submit(body: ContactRequest): Promise<ContactFieldErrors> {
    if (sending) return NO_ERRORS;
    setFailed(false);
    const local = validateContact({ ...body });
    if (Object.keys(local).length) return local;

    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as ContactResponse;
      if (result.ok) {
        // Le merci est rendu, puis le formulaire passe en « envoyé » (les transitions partent de là).
        flushSync(() => setOkShown(true));
        void okRef.current?.offsetWidth;
        setSent(true);
        onSent?.();
        later(() => okTitleRef.current?.focus({ preventScroll: true }), reduced ? 50 : focusDelay);
        return NO_ERRORS;
      }
      // Des erreurs de champ que le navigateur n'a pas vues : on les montre ; toute autre réponse est un échec.
      if (result.error === "invalid" && !result.fields.type && Object.keys(result.fields).length) return result.fields;
      setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
    return NO_ERRORS;
  }

  function again(focusFirst: () => void) {
    setSent(false);
    later(
      () => {
        setOkShown(false);
        focusFirst();
      },
      reduced ? 0 : AGAIN_MS,
    );
  }

  return { submit, again, sending, failed, okShown, sent, okRef, okTitleRef };
}
