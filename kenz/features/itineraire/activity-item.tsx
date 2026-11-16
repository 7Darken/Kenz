/**
 * Une étape du jour : l'heure, le pictogramme de son genre sur le fil de la journée, puis la carte (genre, durée,
 * prix, titre, description, l'astuce, le lien vers la carte). Les couleurs des genres sont celles de l'ancienne page.
 */
import type { CSSProperties } from "react";

import type { ActivityKind, ItineraryActivity } from "@/content/itineraries";
import { Icon } from "@/design-system/components/icon";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./activity-item.module.css";
import { formatDuration, formatPrice } from "./format";
import { TripIcon } from "./icons";

const KIND_COLORS: Readonly<Record<ActivityKind, string>> = {
  sight: "#f5c76b",
  food: "#ff7a59",
  nature: "#3ddc97",
  night: "#a58bff",
  transport: "#7cc4ff",
  shopping: "#ff7ac6",
  wellness: "#56d6e8",
};

const mapUrl = (place: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;

export function ActivityItem({ activity, last }: { activity: ItineraryActivity; last: boolean }) {
  const { lang, t } = useLanguage();
  const s = t.itineraire;

  return (
    <li className={styles.item} style={{ "--k": KIND_COLORS[activity.kind] } as CSSProperties} data-rise="">
      <time className={styles.time} dateTime={activity.time}>
        {activity.time}
      </time>
      <span className={styles.rail} aria-hidden="true">
        <span className={styles.node}>
          <TripIcon name={activity.kind} />
        </span>
        {last ? null : <span className={styles.line} data-line="" />}
      </span>
      <div className={styles.card}>
        <p className={styles.meta}>
          <span className={styles.kind}>{s.kinds[activity.kind]}</span>
          <span className={styles.mobileTime} aria-hidden="true">
            {activity.time}
          </span>
          <span className={styles.chip}>{formatDuration(activity.durationMin)}</span>
          {activity.price ? (
            <span className={styles.chip}>{formatPrice(activity.price, { free: s.day.free, yuan: s.yuan })}</span>
          ) : null}
        </p>
        <h4 className={styles.title}>{localize(activity.title, lang)}</h4>
        <p className={styles.text}>{localize(activity.description, lang)}</p>
        {activity.tip ? (
          <p className={styles.tip}>
            <TripIcon name="tip" className={styles.tipIcon} />
            <span>
              <strong>{s.day.tip}</strong> {localize(activity.tip, lang)}
            </span>
          </p>
        ) : null}
        {activity.place ? (
          <a className={styles.map} href={mapUrl(activity.place)} target="_blank" rel="noopener">
            <TripIcon name="pin" className={styles.mapIcon} />
            {s.day.openMap}
            <Icon name="arrow-up-right" className={styles.mapArrow} />
          </a>
        ) : null}
      </div>
    </li>
  );
}
