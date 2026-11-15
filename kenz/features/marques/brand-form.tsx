"use client";

/**
 * Le formulaire Marques & collaborations (voyage.html, `.form`) : la marque, l'idée, un ordre de budget
 * facultatif. Validation douce (au départ, puis à la frappe sur un champ en erreur), envoi vers
 * `POST /api/contact` (type « marques », contrat : content/contact.ts), puis « Merci, c'est noté. ».
 * `website` : un piège à robots, caché et laissé vide.
 */
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import {
  BRAND_BUDGET_LABELS,
  BRAND_BUDGET_VALUES,
  CONTACT_LIMITS,
  type BrandBudget,
  type ContactFieldError,
  type ContactRequest,
  type ContactResponse,
} from "@/content/contact";
import { Button } from "@/design-system/components/button";
import { useMotion } from "@/features/motion/motion-provider";
import { useInView } from "@/features/motion/use-in-view";
import { useReducedMotion } from "@/features/motion/use-reduced-motion";
import bezel from "@/features/univers/bezel.module.css";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./brand-form.module.css";

type FieldName = "nom" | "message" | "besoin";
type Errors = Partial<Record<FieldName, ContactFieldError>>;

/** La même règle que le serveur (app/api/contact) : obligatoire, assez long, pas trop. */
function check(value: string, min: number, max: number): ContactFieldError | null {
  const length = value.trim().length;
  if (!length) return "required";
  if (length < min) return "tooShort";
  if (length > max) return "tooLong";
  return null;
}

export function BrandForm({ labelledBy }: { labelledBy: string }) {
  const uid = useId();
  const ids = { nom: `${uid}-marque`, message: `${uid}-idee` };
  const { lang, t } = useLanguage();
  const m = t.voyage.marques;
  const motion = useMotion();
  const reduced = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const ideaRef = useRef<HTMLTextAreaElement>(null);
  const trapRef = useRef<HTMLInputElement>(null);
  const okTitleRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(formRef, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState<BrandBudget | "">("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [okShown, setOkShown] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Le merci apparaît une image après sa mise en place (sa transition part de l'état caché) ; sur mobile, le
  // formulaire est plus haut que l'écran : on remonte pour le voir, puis son titre prend le focus.
  useEffect(() => {
    if (!okShown || revealed) return;
    const raf = requestAnimationFrame(() => setRevealed(true));
    const form = formRef.current;
    if (form && form.getBoundingClientRect().top < 0) motion.scrollTo(form, { offset: -88 });
    const timer = window.setTimeout(() => okTitleRef.current?.focus({ preventScroll: true }), reduced ? 50 : 300);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [okShown, revealed, motion, reduced]);

  const errorText = (field: FieldName, error: ContactFieldError | undefined) => {
    if (!error) return "";
    if (field === "besoin") return m.errors.budget;
    if (error === "tooLong") return m.errors.tooLong;
    return field === "nom" ? m.errors.brand : m.errors.idea;
  };

  const focusFirst = (next: Errors) => {
    if (next.nom) nameRef.current?.focus();
    else if (next.message) ideaRef.current?.focus();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {};
    const nomError = check(nom, CONTACT_LIMITS.nameMin, CONTACT_LIMITS.nameMax);
    const messageError = check(message, CONTACT_LIMITS.messageMin, CONTACT_LIMITS.messageMax);
    if (nomError) next.nom = nomError;
    if (messageError) next.message = messageError;
    setErrors(next);
    if (next.nom || next.message) {
      focusFirst(next);
      return;
    }
    setSending(true);
    setFailed(false);
    const body: ContactRequest = {
      type: "marques",
      nom: nom.trim(),
      message: message.trim(),
      ...(budget && { besoin: budget }),
      website: trapRef.current?.value ?? "",
    };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as ContactResponse;
      if (result.ok) {
        setOkShown(true);
      } else if (result.error === "invalid") {
        const fields: Errors = { nom: result.fields.nom, message: result.fields.message, besoin: result.fields.besoin };
        setErrors(fields);
        if (!fields.nom && !fields.message && !fields.besoin) setFailed(true);
        focusFirst(fields);
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  const again = () => {
    setNom("");
    setMessage("");
    setBudget("");
    setErrors({});
    setRevealed(false);
    window.setTimeout(
      () => {
        setOkShown(false);
        nameRef.current?.focus({ preventScroll: true });
      },
      reduced ? 0 : 320,
    );
  };

  const onEdit = (field: "nom" | "message", value: string) => {
    if (field === "nom") setNom(value);
    else setMessage(value);
    // Un champ en erreur se revérifie à la frappe.
    if (errors[field]) {
      const error =
        field === "nom"
          ? check(value, CONTACT_LIMITS.nameMin, CONTACT_LIMITS.nameMax)
          : check(value, CONTACT_LIMITS.messageMin, CONTACT_LIMITS.messageMax);
      setErrors((current) => ({ ...current, [field]: error ?? undefined }));
    }
  };

  return (
    <form
      ref={formRef}
      className={`${bezel.bezel} ${styles.form}`}
      data-in={inView ? "" : undefined}
      data-sent={revealed ? "" : undefined}
      noValidate
      aria-labelledby={labelledBy}
      onSubmit={submit}
    >
      <div className={`${bezel.core} ${styles.core}`}>
        <div className={styles.body} inert={okShown}>
          <div className={styles.field}>
            <label htmlFor={ids.nom}>{m.brand}</label>
            <input
              ref={nameRef}
              className={styles.input}
              id={ids.nom}
              name="marque"
              type="text"
              autoComplete="organization"
              placeholder={m.brandPlaceholder}
              value={nom}
              onChange={(event) => onEdit("nom", event.target.value)}
              aria-invalid={errors.nom ? true : undefined}
              aria-describedby={`${ids.nom}-err`}
            />
            <p className={styles.error} id={`${ids.nom}-err`} aria-live="polite">
              {errorText("nom", errors.nom)}
            </p>
          </div>
          <div className={styles.field}>
            <label htmlFor={ids.message}>{m.idea}</label>
            <textarea
              ref={ideaRef}
              className={styles.input}
              id={ids.message}
              name="idee"
              placeholder={m.ideaPlaceholder}
              value={message}
              onChange={(event) => onEdit("message", event.target.value)}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={`${ids.message}-err`}
            />
            <p className={styles.error} id={`${ids.message}-err`} aria-live="polite">
              {errorText("message", errors.message)}
            </p>
          </div>
          <fieldset className={styles.field}>
            <legend>
              {m.budget} <small>{m.optional}</small>
            </legend>
            <div className={styles.choices} aria-invalid={errors.besoin ? true : undefined}>
              {BRAND_BUDGET_VALUES.map((value) => (
                <label key={value} className={styles.choice}>
                  <input
                    type="radio"
                    name="budget"
                    value={value}
                    checked={budget === value}
                    onChange={() => setBudget(value)}
                  />
                  <span>{localize(BRAND_BUDGET_LABELS[value], lang)}</span>
                </label>
              ))}
            </div>
            <p className={styles.error} aria-live="polite">
              {errorText("besoin", errors.besoin)}
            </p>
          </fieldset>
          <div className={styles.trap} aria-hidden="true">
            <input ref={trapRef} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>
          <div className={styles.foot}>
            {failed ? (
              <p className={styles.failure} role="alert">
                {m.errors.unavailable}
              </p>
            ) : null}
            <Button type="submit" disabled={sending}>
              {sending ? m.sending : m.send}
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.ok} hidden={!okShown}>
        <svg className={styles.check} viewBox="0 0 48 48" aria-hidden="true">
          <circle pathLength={1} cx="24" cy="24" r="22" />
          <path pathLength={1} d="M15 24.5l6 6L33.5 18" />
        </svg>
        <h3 ref={okTitleRef} tabIndex={-1}>
          {m.sent.title}
        </h3>
        <p>{m.sent.text}</p>
        <Button variant="ghost" size="sm" icon="arrow-right" onClick={again}>
          {m.sent.again}
        </Button>
      </div>
    </form>
  );
}
