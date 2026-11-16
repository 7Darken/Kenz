"use client";

/**
 * « Ma checklist » : de vraies cases à cocher, gardées sur l'appareil (localStorage, une liste par itinéraire),
 * l'anneau qui se remplit, et « Prêt pour le départ ! » quand tout est coché.
 */
import bezel from "@/design-system/styles/bezel.module.css";
import type { Itinerary } from "@/content/itineraries";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./checklist.module.css";
import { TripIcon } from "./icons";
import { useStoredState } from "./use-stored-state";

function parseIds(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

interface ChecklistProps {
  slug: string;
  items: Itinerary["checklist"];
}

export function Checklist({ slug, items }: ChecklistProps) {
  const { lang, t } = useLanguage();
  const s = t.itineraire.essentials;
  const [stored, setStored] = useStoredState(`kenz-trip-checklist:${slug}`);
  const checked = new Set(parseIds(stored));
  const total = items.length;
  const done = items.filter((item) => checked.has(item.id)).length;
  const complete = done === total;

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setStored(JSON.stringify([...next]));
  };

  return (
    <div className={`${bezel.core} ${styles.core}`}>
      <div className={styles.head}>
        <div>
          <h3 id="checklist-title" className={styles.title}>
            {s.checklist}
          </h3>
          <p className={styles.count}>
            {done}/{total}
          </p>
        </div>
        <svg className={styles.ring} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
          <circle cx="20" cy="20" r="16" />
          <circle cx="20" cy="20" r="16" pathLength={1} style={{ strokeDashoffset: 1 - done / total }} data-on={done ? "" : undefined} />
        </svg>
      </div>

      <ul className={styles.list} aria-labelledby="checklist-title">
        {items.map((item) => (
          <li key={item.id}>
            <label className={styles.row}>
              <input
                className={styles.input}
                type="checkbox"
                checked={checked.has(item.id)}
                onChange={() => toggle(item.id)}
              />
              <span className={styles.box} aria-hidden="true">
                <TripIcon name="check" strokeWidth={3} />
              </span>
              <span className={styles.label}>{localize(item.label, lang)}</span>
            </label>
          </li>
        ))}
      </ul>

      <p className={styles.footer} data-ready={complete ? "" : undefined} aria-live="polite">
        {complete ? <TripIcon name="check" className={styles.readyIcon} /> : null}
        {complete ? s.ready : s.checklistHint}
      </p>
    </div>
  );
}
