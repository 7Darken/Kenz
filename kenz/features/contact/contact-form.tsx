"use client";

/**
 * Le formulaire de contact : nom, e-mail ou @ (pour pouvoir répondre), besoin (un choix), message
 * → `POST /api/contact` (type « contact »),
 * puis l'état « Merci » (le formulaire s'efface, la coche se dessine, le titre reçoit le focus).
 * Les erreurs s'affichent à l'envoi, puis se corrigent en direct ; le serveur revalide avec le même code
 * (`validateContact`, content/contact.ts). L'envoi et le merci : `useContactSubmit`, partagé avec le formulaire Marques.
 */
import { useId, useRef, useState, type FormEvent } from "react";

import {
  CONTACT_LIMITS,
  CONTACT_NEED_LABELS,
  CONTACT_NEEDS,
  isContactNeed,
  validateContact,
  type ContactFieldError,
  type ContactRequest,
} from "@/content/contact";
import { Button } from "@/design-system/components/button";
import { Choice, Choices, FormField, Input, Textarea } from "@/design-system/components/form-field";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./contact-form.module.css";
import { useContactSubmit } from "./use-contact-submit";

export type ContactVariant = "pro" | "agents";

type Field = "nom" | "contact" | "besoin" | "message";
type Errors = Partial<Record<Field, ContactFieldError>>;

const FIELDS: readonly Field[] = ["nom", "contact", "besoin", "message"];

/** Le corps de la requête, lu dans le formulaire (un besoin hors de la liste compte comme absent). */
function bodyOf(form: HTMLFormElement): ContactRequest {
  const data = new FormData(form);
  const besoin = data.get("besoin");
  return {
    type: "contact",
    nom: String(data.get("nom") ?? "").trim(),
    contact: String(data.get("contact") ?? "").trim(),
    besoin: isContactNeed(besoin) ? besoin : undefined,
    message: String(data.get("message") ?? "").trim(),
    website: String(data.get("website") ?? ""),
  };
}

/** Les erreurs des champs du formulaire (le même code que le serveur). */
function pick(fields: Partial<Record<Field | "type", ContactFieldError>>): Errors {
  const errors: Errors = {};
  FIELDS.forEach((f) => {
    const code = fields[f];
    if (code) errors[f] = code;
  });
  return errors;
}

const validate = (form: HTMLFormElement): Errors => pick(validateContact({ ...bodyOf(form) }));

interface ContactFormProps {
  variant: ContactVariant;
  /** L'id du titre du chapitre (nom accessible du formulaire). */
  labelledBy: string;
}

export function ContactForm({ variant, labelledBy }: ContactFormProps) {
  const { lang, t } = useLanguage();
  const c = t.pro.contact;
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const { submit, again, sending, failed, okShown, sent, okRef, okTitleRef } = useContactSubmit({ focusDelay: 700 });
  // Un @pseudo n'est pas une adresse : le navigateur ne propose alors plus d'e-mail enregistré.
  const [handle, setHandle] = useState(false);

  const ids = { nom: `${id}-nom`, contact: `${id}-contact`, besoin: `${id}-besoin`, message: `${id}-msg` };
  const errorId = (field: Field) => `${ids[field]}-err`;

  function errorText(field: Field): string {
    const code = errors[field];
    if (!code) return "";
    if (field === "besoin") return c.errors.need;
    if (field === "nom") return code === "tooLong" ? format(c.errors.nameTooLong, { max: CONTACT_LIMITS.nameMax }) : c.errors.name;
    if (field === "contact") {
      if (code === "tooShort") return format(c.errors.replyShort, { min: CONTACT_LIMITS.handleMin });
      if (code === "tooLong") return format(c.errors.replyTooLong, { max: CONTACT_LIMITS.contactMax });
      return code === "invalid" ? c.errors.replyInvalid : c.errors.reply;
    }
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
    if (sending) return;
    const next = pick(await submit(bodyOf(event.currentTarget)));
    setErrors(next);
    focusFirst(next);
  }

  function writeAgain() {
    setErrors({});
    setHandle(false);
    formRef.current?.reset();
    again(() => formRef.current?.querySelector<HTMLInputElement>('input[name="nom"]')?.focus());
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
          <FormField label={c.name.label} htmlFor={ids.nom} error={errorText("nom")} errorId={errorId("nom")}>
            <Input
              id={ids.nom}
              name="nom"
              type="text"
              autoComplete="name"
              placeholder={c.name.placeholder}
              maxLength={CONTACT_LIMITS.nameMax}
              aria-invalid={errors.nom ? true : undefined}
              aria-describedby={errorId("nom")}
            />
          </FormField>

          <FormField label={c.reply.label} htmlFor={ids.contact} error={errorText("contact")} errorId={errorId("contact")}>
            <Input
              id={ids.contact}
              name="contact"
              type="text"
              inputMode="email"
              autoComplete={handle ? "off" : "email"}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder={c.reply.placeholder}
              maxLength={CONTACT_LIMITS.contactMax}
              aria-invalid={errors.contact ? true : undefined}
              aria-describedby={errorId("contact")}
              onChange={(event) => setHandle(event.target.value.trimStart().startsWith("@"))}
            />
          </FormField>

          <FormField group label={c.need} error={errorText("besoin")} errorId={errorId("besoin")}>
            <Choices invalid={!!errors.besoin}>
              {CONTACT_NEEDS.map((need) => (
                <Choice
                  key={need}
                  name="besoin"
                  value={need}
                  defaultChecked={variant === "agents" && need === "agents"}
                  label={localize(CONTACT_NEED_LABELS[need], lang)}
                />
              ))}
            </Choices>
          </FormField>

          <FormField label={c.message} htmlFor={ids.message} error={errorText("message")} errorId={errorId("message")}>
            <Textarea
              id={ids.message}
              name="message"
              placeholder={messagePlaceholder}
              maxLength={CONTACT_LIMITS.messageMax}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errorId("message")}
            />
          </FormField>

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
