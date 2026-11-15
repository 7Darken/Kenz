/** Bouton rond à icône seule (48 px, 44 px en `sm`). `label` est obligatoire : c'est son nom accessible. */
import type { ComponentPropsWithoutRef } from "react";

import { Icon, type IconName } from "./icon";
import styles from "./icon-button.module.css";

type IconButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children" | "aria-label"> & {
  icon: IconName;
  label: string;
  size?: "md" | "sm";
};

export function IconButton({ icon, label, size = "md", className, type = "button", ...props }: IconButtonProps) {
  const cls = [styles.iconButton, size === "sm" && styles.sm, className].filter(Boolean).join(" ");
  return (
    <button className={cls} type={type} aria-label={label} {...props}>
      <Icon name={icon} />
    </button>
  );
}
