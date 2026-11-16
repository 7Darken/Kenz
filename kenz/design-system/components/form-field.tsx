/**
 * Les champs de formulaire de la maquette (shared/theme.css : .field, .input, .choices, .choice, .field__err).
 * - `FormField` : le libellé, le contrôle, puis l'erreur (annoncée : `aria-live`, masquée tant qu'elle est vide).
 *   Un champ simple (`htmlFor` : le <label> du contrôle) ou un groupe de choix (`group` : un <fieldset> et sa légende,
 *   décrit par l'erreur). `hint` : une précision discrète après le libellé (« (facultatif) »).
 * - `Input`, `Textarea` : les contrôles (toutes les props natives, `ref` compris).
 * - `Choices`, `Choice` : des boutons radio en pastilles (`invalid` : le groupe est en erreur).
 */
import type { ComponentProps, ReactNode } from "react";

import styles from "./form-field.module.css";

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

type FormFieldProps = {
  label: ReactNode;
  hint?: ReactNode;
  /** Le message d'erreur ; vide, rien n'est affiché. */
  error?: string;
  /** L'id du message (le contrôle s'y relie par `aria-describedby`). */
  errorId?: string;
  className?: string;
  children: ReactNode;
} & ({ group?: false; htmlFor: string } | { group: true; htmlFor?: never });

export function FormField({ label, hint, error, errorId, className, children, ...kind }: FormFieldProps) {
  const title = (
    <>
      {label}
      {hint ? (
        <>
          {" "}
          <small className={styles.hint}>{hint}</small>
        </>
      ) : null}
    </>
  );
  const message = (
    <p className={styles.error} id={errorId} aria-live="polite">
      {error}
    </p>
  );
  if (kind.group) {
    return (
      <fieldset className={cx(styles.field, className)} aria-describedby={errorId}>
        <legend>{title}</legend>
        {children}
        {message}
      </fieldset>
    );
  }
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={kind.htmlFor}>{title}</label>
      {children}
      {message}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cx(styles.input, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cx(styles.input, styles.textarea, className)} {...props} />;
}

export function Choices({ invalid = false, children }: { invalid?: boolean; children: ReactNode }) {
  return (
    <div className={styles.choices} data-invalid={invalid ? "" : undefined}>
      {children}
    </div>
  );
}

type ChoiceProps = Omit<ComponentProps<"input">, "type" | "className"> & { label: ReactNode };

export function Choice({ label, ...input }: ChoiceProps) {
  return (
    <label className={styles.choice}>
      <input type="radio" {...input} />
      <span>{label}</span>
    </label>
  );
}
