"use client";

/**
 * La dernière vidéo (voyage.html, `#derniere`) : la miniature dans sa coque, qui s'ouvre comme un masque au
 * défilement (ordinateur, hors mouvement réduit), le pavé « lecture » qui s'étire au survol, le titre et la date.
 * Souris : l'image reçoit la loupe ; un clic sur l'image ouvre aussi la vidéo.
 */
import Image from "next/image";
import { useRef } from "react";

import { LATEST_VIDEO } from "@/content/series";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { ScrollTrigger } from "@/design-system/motion/gsap";
import { useGsap } from "@/design-system/motion/use-gsap";
import { useInView } from "@/design-system/motion/use-in-view";
import { useMediaQuery } from "@/design-system/motion/use-media-query";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import bezel from "@/features/univers/bezel.module.css";
import page from "@/features/univers/page.module.css";
import { SweepTitle } from "@/design-system/components/sweep-title";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./latest-video.module.css";

const PIN = "(min-width: 900px) and (min-height: 600px)";

export function LatestVideo() {
  const posterRef = useRef<HTMLElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { lang, t } = useLanguage();
  const inView = useInView(posterRef, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
  const pinnable = useMediaQuery(PIN);
  const reduced = useReducedMotion();
  const masked = pinnable && !reduced;
  const video = LATEST_VIDEO;
  const title = localize(video.title, lang);
  const [before, after] = t.voyage.latest.published.split("{date}");
  const date = new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(video.publishedAt),
  );

  // Le masque : --m va de 0 (la miniature en retrait, arrondie) à 1 (pleine) entre ces deux repères.
  useGsap(
    () => {
      const poster = posterRef.current;
      if (!masked || !poster) return;
      const apply = (self: ScrollTrigger) => poster.style.setProperty("--m", self.progress.toFixed(4));
      ScrollTrigger.create({ trigger: poster, start: "top 92%", end: "center 55%", onUpdate: apply, onRefresh: apply });
      return () => poster.style.removeProperty("--m");
    },
    posterRef,
    [masked],
  );

  return (
    <Section
      id="derniere"
      aura="gauche"
      className={`${page.chapter} ${page.screen}`}
      aria-labelledby="latest-title"
    >
      <Container className={styles.grid}>
        <div className={styles.head}>
          <SweepTitle id="latest-title" text={{ k: "voyage.latest.title" }} className={`${page.title} ${styles.title}`} />
        </div>
        <figure
          ref={posterRef}
          className={`${bezel.bezel} ${styles.poster}`}
          data-in={inView ? "" : undefined}
          data-mask={masked ? "" : undefined}
        >
          <div
            className={`${bezel.core} ${styles.core}`}
            onClick={(event) => {
              if (!(event.target as Element).closest("a")) linkRef.current?.click();
            }}
          >
            <a
              ref={linkRef}
              className={styles.link}
              href={video.href}
              target="_blank"
              rel="noopener"
              aria-label={format(t.voyage.latest.watchLabel, { title })}
            >
              <Image
                className={styles.image}
                src={video.image.src}
                alt={video.image.alt ? localize(video.image.alt, lang) : ""}
                fill
                sizes="(min-width: 900px) 720px, 100vw"
                data-loupe=""
              />
              <span className={`${bezel.glass} ${styles.play}`} aria-hidden="true">
                <span className={styles.playIcon}>
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M7 4.8v14.4c0 .6.7 1 1.2.7l11.3-7.2a.8.8 0 0 0 0-1.4L8.2 4.1C7.7 3.8 7 4.2 7 4.8z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className={styles.playLabel}>{t.voyage.latest.watch}</span>
              </span>
            </a>
          </div>
        </figure>
        <Reveal variant="fade" as="p" index={2} className={styles.meta}>
          {title}
          <span className={styles.date}>
            {before}
            <time dateTime={video.publishedAt}>{date}</time>
            {after}
          </span>
        </Reveal>
      </Container>
    </Section>
  );
}
