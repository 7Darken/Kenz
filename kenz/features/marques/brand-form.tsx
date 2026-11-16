"use client";

/**
 * Le formulaire Marques & collaborations (voyage.html, `.form`) : la marque, l'e-mail ou le @ (pour pouvoir
 * répondre), l'idée, un ordre de budget facultatif. Validation douce (au départ, puis à la frappe sur un champ
 * en erreur) avec le même code que le serveur (`validateContact`, content/contact.ts), envoi vers
 * `POST /api/contact` (type « marques ») puis « Merci, c'est noté. » : `useContactSubmit`, partagé avec le
 * contact Pro. `website` : un piège à robots, caché et laissé vide.
 */
import { useId, useRef, useState, type FormEvent } from "react";

import {
  BRAND_BUDGET_LABELS,
  BRAND_BUDGET_VALUES,
  CONTACT_LIMITS,
  validateContact,
  type BrandBudget,
  type ContactFieldError,
  type ContactFieldErrors,
  type ContactRequest,
} from "@/content/contact";
import { Button } from "@/design-system/components/button";
import { Choice, Choices, FormField, Input, Textarea } from "@/design-system/components/form-field";
import { useMotion } from "@/design-system/motion/motion-provider";
import { useInView } from "@/design-system/motion/use-in-view";
import { useContactSubmit } from "@/features/contact/use-contact-submit";
import bezel from "@/features/univers/bezel.module.css";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./brand-form.module.css";

type FieldName = "nom" | "contact" | "message" | "besoin";
type Errors = Partial<Record<FieldName, ContactFieldError>>;

const pick = ({ nom, contact, message, besoin }: ContactFieldErrors): Errors => ({ nom, contact, message, besoin });

export function BrandForm({ labelledBy }: { labelledBy: string }) {
  const uid = useId();
  const ids = { nom: `${uid}-marque`, contact: `${uid}-contact`, message: `${uid}-idee` };
  const { lang, t } = useLanguage();
  const m = t.voyage.marques;
  const motion = useMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const ideaRef = useRef<HTMLTextAreaElement>(null);
  const trapRef = useRef<HTMLInputElement>(null);
  const inView = useInView(formRef, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
  const [nom, setNom] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState<BrandBudget | "">("");
  const [errors, setErrors] = useState<Errors>({});
  // Sur téléphone, le formulaire est plus haut que l'écran : au merci, on remonte pour le voir.
  const { submit, again, sending, failed, okShown, sent, okRef, okTitleRef } = useContactSubmit({
    focusDelay: 300,
    onSent: () => {
      const form = formRef.current;
      if (form && form.getBoundingClientRect().top < 0) motion.scrollTo(form, { offset: -88 });
    },
  });

  const body = (): ContactRequest => ({
    type: "marques",
    nom: nom.trim(),
    contact: contact.trim(),
    message: message.trim(),
    ...(budget && { besoin: budget }),
    website: trapRef.current?.value ?? "",
  });

  const errorText = (field: FieldName, error: ContactFieldError | undefined) => {
    if (!error) return "";
    if (field === "besoin") return m.errors.budget;
    if (error === "tooLong") return m.errors.tooLong;
    if (field === "contact") {
      if (error === "tooShort") return format(m.errors.replyShort, { min: CONTACT_LIMITS.handleMin });
      return error === "invalid" ? m.errors.replyInvalid : m.errors.reply;
    }
    return field === "nom" ? m.errors.brand : m.errors.idea;
  };

  const focusFirst = (next: Errors) => {
    if (next.nom) nameRef.current?.focus();
    else if (next.contact) contactRef.current?.focus();
    else if (next.message) ideaRef.current?.focus();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const next = pick(await submit(body()));
    setErrors(next);
    focusFirst(next);
  };

  const writeAgain = () => {
    setNom("");
    setContact("");
    setMessage("");
    setBudget("");
    setErrors({});
    again(() => nameRef.current?.focus({ preventScroll: true }));
  };

  const onEdit = (field: "nom" | "contact" | "message", value: string) => {
    if (field === "nom") setNom(value);
    else if (field === "contact") setContact(value);
    else setMessage(value);
    // Un champ en erreur se revérifie à la frappe (la même règle qu'à l'envoi).
    if (errors[field]) {
      const error = validateContact({ ...body(), [field]: value })[field];
      setErrors((current) => ({ ...current, [field]: error }));
    }
  };

  return (
    <form
      ref={formRef}
      className={`${bezel.bezel} ${styles.form}`}
      data-in={inView ? "" : undefined}
      data-sent={sent ? "" : undefined}
      noValidate
      aria-labelledby={labelledBy}
      onSubmit={onSubmit}
    >
      <div className={`${bezel.core} ${styles.core}`}>
        <div className={styles.body} inert={sent}>
          <FormField label={m.brand} htmlFor={ids.nom} error={errorText("nom", errors.nom)} errorId={`${ids.nom}-err`}>
            <Input
              ref={nameRef}
              id={ids.nom}
              name="marque"
              type="text"
              autoComplete="organization"
              placeholder={m.brandPlaceholder}
              maxLength={CONTACT_LIMITS.nameMax}
              value={nom}
              onChange={(event) => onEdit("nom", event.target.value)}
              aria-invalid={errors.nom ? true : undefined}
              aria-describedby={`${ids.nom}-err`}
            />
          </FormField>
          <FormField
            label={m.reply}
            htmlFor={ids.contact}
            error={errorText("contact", errors.contact)}
            errorId={`${ids.contact}-err`}
          >
            <Input
              ref={contactRef}
              id={ids.contact}
              name="contact"
              type="text"
              inputMode="email"
              // Un @pseudo n'est pas une adresse : le navigateur ne propose alors plus d'e-mail enregistré.
              autoComplete={contact.trimStart().startsWith("@") ? "off" : "email"}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder={m.replyPlaceholder}
              maxLength={CONTACT_LIMITS.contactMax}
              value={contact}
              onChange={(event) => onEdit("contact", event.target.value)}
              aria-invalid={errors.contact ? true : undefined}
              aria-describedby={`${ids.contact}-err`}
            />
          </FormField>
          <FormField
            label={m.idea}
            htmlFor={ids.message}
            error={errorText("message", errors.message)}
            errorId={`${ids.message}-err`}
          >
            <Textarea
              ref={ideaRef}
              id={ids.message}
              name="idee"
              placeholder={m.ideaPlaceholder}
              maxLength={CONTACT_LIMITS.messageMax}
              value={message}
              onChange={(event) => onEdit("message", event.target.value)}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={`${ids.message}-err`}
            />
          </FormField>
          <FormField
            group
            label={m.budget}
            hint={m.optional}
            error={errorText("besoin", errors.besoin)}
            errorId={`${uid}-budget-err`}
            className={styles.budget}
          >
            <Choices invalid={!!errors.besoin}>
              {BRAND_BUDGET_VALUES.map((value) => (
                <Choice
                  key={value}
                  name="budget"
                  value={value}
                  checked={budget === value}
                  onChange={() => setBudget(value)}
                  label={localize(BRAND_BUDGET_LABELS[value], lang)}
                />
              ))}
            </Choices>
          </FormField>
          <div className={styles.trap} aria-hidden="true">
            <input ref={trapRef} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>
          <div className={styles.foot}>
            <p className={styles.failure} role="status">
              {failed ? m.errors.unavailable : ""}
            </p>
            <Button type="submit" disabled={sending}>
              {sending ? m.sending : m.send}
            </Button>
          </div>
        </div>
      </div>

      <div ref={okRef} className={styles.ok} hidden={!okShown}>
        <svg className={styles.check} viewBox="0 0 48 48" aria-hidden="true">
          <circle pathLength={1} cx="24" cy="24" r="22" />
          <path pathLength={1} d="M15 24.5l6 6L33.5 18" />
        </svg>
        <h3 ref={okTitleRef} tabIndex={-1}>
          {m.sent.title}
        </h3>
        <p>{m.sent.text}</p>
        <Button variant="ghost" size="sm" icon="arrow-right" onClick={writeAgain}>
          {m.sent.again}
        </Button>
      </div>
    </form>
  );
}
