"use client";

/**
 * Le formulaire de contact : nom, besoin (un choix), message → `POST /api/contact` (type « contact »),
 * puis l'état « Merci » (le formulaire s'efface, la coche se dessine, le titre reçoit le focus).
 * Les erreurs s'affichent à l'envoi, puis se corrigent en direct ; le serveur revalide (content/contact.ts).
 */
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";

import {
  CONTACT_LIMITS,
  CONTACT_NEED_LABELS,
  CONTACT_NEEDS,
  type ContactFieldError,
  type ContactRequest,
  type ContactResponse,
} from "@/content/contact";
import { Button } from "@/design-system/components/button";
import { useReducedMotion } from "@/features/motion/use-reduced-motion";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./contact-form.module.css";

export type ContactVariant = "pro" | "agents";

type Field = "nom" | "besoin" | "message";
type Errors = Partial<Record<Field, ContactFieldError>>;

const FIELDS: readonly Field[] = ["nom", "besoin", "message"];

function checkLength(value: string, min: number, max: number): ContactFieldError | undefined {
  const length = value.trim().length;
  if (!length) return "required";
  if (length < min) return "tooShort";
  if (length > max) return "tooLong";
  return undefined;
}

function validate(form: HTMLFormElement): Errors {
  const data = new FormData(form);
  const errors: Errors = {};
  const nom = checkLength(String(data.get("nom") ?? ""), CONTACT_LIMITS.nameMin, CONTACT_LIMITS.nameMax);
  const message = checkLength(String(data.get("message") ?? ""), CONTACT_LIMITS.messageMin, CONTACT_LIMITS.messageMax);
  if (nom) errors.nom = nom;
  if (!data.get("besoin")) errors.besoin = "required";
  if (message) errors.message = message;
  return errors;
}

interface ContactFormProps {
  variant: ContactVariant;
  /** L'id du titre du chapitre (nom accessible du formulaire). */
  labelledBy: string;
}

export function ContactForm({ variant, labelledBy }: ContactFormProps) {
  const { lang, t } = useLanguage();
  const c = t.pro.contact;
  const reduced = useReducedMotion();
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const okRef = useRef<HTMLDivElement>(null);
  const okTitleRef = useRef<HTMLHeadingElement>(null);
  const timerRef = useRef(0);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [okShown, setOkShown] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const ids = { nom: `${id}-nom`, besoin: `${id}-besoin`, message: `${id}-msg` };
  const errorId = (field: Field) => `${ids[field]}-err`;

  function errorText(field: Field): string {
    const code = errors[field];
    if (!code) return "";
    if (field === "besoin") return c.errors.need;
    if (field === "nom") return code === "tooLong" ? format(c.errors.nameTooLong, { max: CONTACT_LIMITS.nameMax }) : c.errors.name;
    return code === "tooLong"
      ? format(c.errors.messageTooLong, { max: CONTACT_LIMITS.messageMax })
      : format(c.errors.message, { min: CONTACT_LIMITS.messageMin });
  }

  /** Le premier champ en erreur reçoit le focus (le premier choix pour le besoin). */
  function focusFirst(next: Errors) {
    const field = FIELDS.find((f) => next[f]);
    const form = formRef.current;
    if (!field || !form) return;
    const target = field === "besoin" ? form.querySelector<HTMLInputElement>('input[name="besoin"]') : form.elements.namedItem(field);
    if (target instanceof HTMLElement) target.focus();
  }

  /** Une fois signalée, une erreur se corrige en direct. */
  function recheck() {
    const form = formRef.current;
    if (!form || !Object.keys(errors).length) return;
    const next = validate(form);
    setErrors((prev) => {
      const kept: Errors = {};
      FIELDS.forEach((f) => {
        if (prev[f] && next[f]) kept[f] = next[f];
      });
      return kept;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (sending) return;
    const next = validate(form);
    setErrors(next);
    setFailed(false);
    if (Object.keys(next).length) {
      focusFirst(next);
      return;
    }

    const data = new FormData(form);
    const body: ContactRequest = {
      type: "contact",
      nom: String(data.get("nom") ?? "").trim(),
      besoin: String(data.get("besoin") ?? "") as ContactRequest["besoin"],
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? ""),
    };

    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as ContactResponse;
      if (result.ok) {
        // L'état « Merci » est rendu, puis le formulaire passe en « envoyé » (les transitions partent de là).
        flushSync(() => setOkShown(true));
        void okRef.current?.offsetWidth;
        setSent(true);
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => okTitleRef.current?.focus({ preventScroll: true }), reduced ? 50 : 700);
      } else if (result.error === "invalid" && !result.fields.type && Object.keys(result.fields).length) {
        const fields: Errors = {};
        FIELDS.forEach((f) => {
          const code = result.fields[f];
          if (code) fields[f] = code;
        });
        setErrors(fields);
        focusFirst(fields);
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  function writeAgain() {
    setSent(false);
    setErrors({});
    formRef.current?.reset();
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(
      () => {
        setOkShown(false);
        formRef.current?.querySelector<HTMLInputElement>('input[name="nom"]')?.focus();
      },
      reduced ? 0 : 320,
    );
  }

  const messagePlaceholder = variant === "agents" ? c.agents.messagePlaceholder : c.pro.messagePlaceholder;

  return (
    <form
      ref={formRef}
      className={styles.form}
      data-sent={sent ? "" : undefined}
      noValidate
      aria-labelledby={labelledBy}
      onSubmit={onSubmit}
      onInput={recheck}
    >
      <div className={styles.core}>
        <div className={styles.body} inert={sent}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={ids.nom}>
              {c.name.label}
            </label>
            <input
              className={styles.input}
              id={ids.nom}
              name="nom"
              type="text"
              autoComplete="name"
              placeholder={c.name.placeholder}
              maxLength={CONTACT_LIMITS.nameMax}
              aria-invalid={errors.nom ? true : undefined}
              aria-describedby={errorId("nom")}
            />
            <p className={styles.err} id={errorId("nom")} aria-live="polite">
              {errorText("nom")}
            </p>
          </div>

          <fieldset className={styles.field} aria-describedby={errorId("besoin")}>
            <legend className={styles.label}>{c.need}</legend>
            <div className={styles.choices} data-invalid={errors.besoin ? "" : undefined}>
              {CONTACT_NEEDS.map((need) => (
                <label key={need} className={styles.choice}>
                  <input
                    type="radio"
                    name="besoin"
                    value={need}
                    defaultChecked={variant === "agents" && need === "agents"}
                  />
                  <span>{localize(CONTACT_NEED_LABELS[need], lang)}</span>
                </label>
              ))}
            </div>
            <p className={styles.err} id={errorId("besoin")} aria-live="polite">
              {errorText("besoin")}
            </p>
          </fieldset>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={ids.message}>
              {c.message}
            </label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              id={ids.message}
              name="message"
              placeholder={messagePlaceholder}
              maxLength={CONTACT_LIMITS.messageMax}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errorId("message")}
            />
            <p className={styles.err} id={errorId("message")} aria-live="polite">
              {errorText("message")}
            </p>
          </div>

          {/* Piège à robots : invisible et hors du parcours clavier, un visiteur ne le remplit jamais. */}
          <div className={styles.trap} aria-hidden="true">
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className={styles.foot}>
            <p className={styles.failure} role="status">
              {failed ? c.errors.unavailable : ""}
            </p>
            <Button type="submit" variant="light" disabled={sending}>
              {c.submit}
            </Button>
          </div>
        </div>
      </div>

      <div ref={okRef} className={styles.ok} hidden={!okShown}>
        <svg className={styles.check} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <circle pathLength={1} cx="24" cy="24" r="22" />
          <path pathLength={1} d="M15 24.5l6 6L33.5 18" />
        </svg>
        <h3 ref={okTitleRef} tabIndex={-1}>
          {c.thanks.title}
        </h3>
        <p>{c.thanks.text}</p>
        <Button type="button" variant="ghost" size="sm" icon="arrow-right" onClick={writeAgain}>
          {c.thanks.again}
        </Button>
      </div>
    </form>
  );
}
