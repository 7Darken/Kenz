"use client";

/**
 * Un ticket du « vrai prix » (voyage.html, `.tk`) : l'en-tête (l'objet, le poste, le prix court quand le ticket
 * passe dessous), puis le prix en grand et son dessin. La finale (l'iPhone) : le prix attendu barré, sa source.
 * Épinglé (ordinateur) : `shown` et `under` viennent de l'empilement ; sinon, le ticket entre à l'écran seul.
 */
import { useRef, type CSSProperties } from "react";

import type { PriceTicket as PriceTicketData } from "@/content/series";
import { useInView } from "@/features/motion/use-in-view";
import { useLanguage } from "@/i18n/language-provider";
import { localize, type Localized } from "@/i18n/localize";
import { PhoneArt, PriceIcon } from "./price-icon";
import styles from "./price-section.module.css";

interface PriceTicketProps {
  ticket: PriceTicketData;
  index: number;
  /** Épinglé : le ticket est posé (sinon : à l'entrée à l'écran). */
  shown?: boolean;
  /** Épinglé : un autre ticket est posé dessus. */
  under?: boolean;
}

export function PriceTicket({ ticket, index, shown, under = false }: PriceTicketProps) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { threshold: 0.3, rootMargin: "0px 0px -8% 0px" });
  const { lang } = useLanguage();
  const final = ticket.icon === "phone";
  const text = (value?: Localized<string>) => (value ? localize(value, lang) : null);
  const cls = [styles.ticket, final && styles.final].filter(Boolean).join(" ");

  return (
    <li
      ref={ref}
      className={cls}
      style={{ "--k": index } as CSSProperties}
      data-in={(shown ?? inView) ? "" : undefined}
      data-under={under ? "" : undefined}
    >
      <article className={styles.shell}>
        <div className={styles.core}>
          <div className={styles.top}>
            <span className={styles.ico} aria-hidden="true">
              <PriceIcon icon={ticket.icon} />
            </span>
            <h3 className={styles.item}>{text(ticket.item)}</h3>
            <span className={styles.mini} aria-hidden="true">
              {text(ticket.compact)}
            </span>
          </div>
          <div className={styles.body}>
            <p className={styles.value}>
              {ticket.was ? (
                <span className={styles.was}>
                  <s className={styles.old}>
                    {text(ticket.was.amount)}
                    <svg className={styles.strike} viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M3 31 C 22 27, 40 24, 58 21 S 98 13, 117 8" />
                    </svg>
                  </s>
                  <span className={styles.source}>{text(ticket.was.source)}</span>
                </span>
              ) : null}
              {ticket.prefix ? <span className={styles.pre}>{text(ticket.prefix)}</span> : null}
              {ticket.detail ? <span className={styles.pre}>{text(ticket.detail)}</span> : null}
              <span className={styles.price}>
                <span className={styles.slit}>
                  <span className={styles.num}>{text(ticket.amount)}</span>
                </span>
              </span>
              {ticket.suffix ? <span className={styles.suffix}>{text(ticket.suffix)}</span> : null}
            </p>
            {final ? <PhoneArt className={styles.art} /> : <PriceIcon icon={ticket.icon} className={styles.art} />}
          </div>
        </div>
      </article>
    </li>
  );
}
