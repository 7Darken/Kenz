/**
 * Bouton de la maquette (« le bouton dans le bouton ») : variantes light (principal), ghost (secondaire),
 * accent (lumière de l'univers), tailles md / sm, icône ronde à droite. Rend un <a> (lien interne via
 * next/link, externe dans un nouvel onglet) ou un <button>. Une ancre de la page (`#contact`) reste un simple <a> :
 * next/link prendrait le clic, et MotionProvider ne pourrait plus défiler en douceur ni donner le focus.
 */
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import styles from "./button.module.css";
import { Icon, type IconName } from "./icon";

type Variant = "light" | "ghost" | "accent";
type Size = "md" | "sm";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  /** Icône ronde à droite (null : aucune). */
  icon?: IconName | null;
  className?: string;
  children: ReactNode;
}

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps | "href"> & {
    href: string;
    /** Lien externe : nouvel onglet, rel="noopener". */
    external?: boolean;
  };

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: never;
    external?: never;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

function classes({ variant = "light", size = "md", icon, className }: CommonProps) {
  return [styles.button, styles[variant], size === "sm" && styles.sm, icon === null && styles.plain, className]
    .filter(Boolean)
    .join(" ");
}

function Content({ icon, children }: Pick<CommonProps, "icon" | "children">) {
  return (
    <>
      {children}
      {icon === null ? null : (
        <span className={styles.ico} aria-hidden="true">
          <Icon name={icon ?? "arrow-up-right"} />
        </span>
      )}
    </>
  );
}

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant, size, icon, className, children, href, external, ...rest } = props;
    const cls = classes({ variant, size, icon, className, children });
    const content = <Content icon={icon}>{children}</Content>;
    if (external) {
      return (
        <a className={cls} href={href} target="_blank" rel="noopener" {...rest}>
          {content}
        </a>
      );
    }
    if (href.startsWith("#")) {
      return (
        <a className={cls} href={href} {...rest}>
          {content}
        </a>
      );
    }
    return (
      <Link className={cls} href={href} {...rest}>
        {content}
      </Link>
    );
  }
  const { variant, size, icon, className, children, type = "button", ...rest } = props;
  return (
    <button className={classes({ variant, size, icon, className, children })} type={type} {...rest}>
      <Content icon={icon}>{children}</Content>
    </button>
  );
}
