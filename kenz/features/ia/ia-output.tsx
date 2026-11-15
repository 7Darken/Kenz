/**
 * La sortie réelle d'un cas (maquettes/v6/shared/ia.js, `htmlSortie` et `fiche`) : une vraie capture
 * (portrait, paysage ou miniature de vidéo), ou la fiche projet dessinée (le vrai format, aucune donnée).
 * `shown` : elle apparaît (le reste du temps, son empreinte attend à sa place).
 */
import Image from "next/image";

import type { IaFrame, IaOutput as IaOutputData } from "@/content/ia";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { IaPictogram } from "./ia-picto";
import styles from "./ia-output.module.css";

interface IaOutputProps {
  output: IaOutputData;
  shown: boolean;
  compact: boolean;
}

/** La largeur affichée au plus (horizontale, grand écran), pour `sizes`. */
const MAX_WIDTH: Readonly<Record<IaFrame, number>> = { portrait: 230, landscape: 310, video: 310 };

export function IaOutput({ output, shown, compact }: IaOutputProps) {
  const { lang } = useLanguage();
  const attrs = { "data-shown": shown ? "" : undefined, "data-compact": compact ? "" : undefined };

  if (output.kind === "sheet") {
    return (
      <div className={`${styles.output} ${styles.sheet}`} {...attrs}>
        <p className={styles.sheetTitle}>
          <IaPictogram name="dossier" />
          <span>{localize(output.title, lang)}</span>
        </p>
        {output.rows.map((row, rowIndex) => (
          <p key={rowIndex} className={styles.sheetRow}>
            <b>{localize(row.label, lang)}</b>
            {row.lines.map((width, index) => (
              <i key={index} style={{ width: `${width}%` }} />
            ))}
          </p>
        ))}
      </div>
    );
  }

  const { image, frame } = output;
  return (
    <div className={`${styles.output} ${styles[frame]}`} {...attrs}>
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt ? localize(image.alt, lang) : ""}
        sizes={`${MAX_WIDTH[frame]}px`}
      />
      {frame === "video" ? (
        <span className={styles.play} aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M9.5 7.5v9l7.5-4.5z" />
          </svg>
        </span>
      ) : null}
    </div>
  );
}
