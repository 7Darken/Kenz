"use client";

/**
 * La vidéo du voyage : l'affiche d'abord (le lecteur YouTube, sans cookies, ne se charge qu'au clic), puis la
 * phrase, « Regarder sur YouTube » et « S'abonner ».
 */
import Image from "next/image";
import { useState } from "react";

import type { Itinerary } from "@/content/itineraries";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Section } from "@/design-system/components/section";
import { Words } from "@/design-system/components/words";
import bezel from "@/design-system/styles/bezel.module.css";
import page from "@/design-system/styles/univers-page.module.css";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import { PlayIcon } from "./icons";
import { subscribeUrl, videoUrls } from "./trip";
import styles from "./video-section.module.css";

export function VideoSection({ itinerary, channel }: { itinerary: Itinerary; channel: string }) {
  const { lang, t } = useLanguage();
  const s = t.itineraire.video;
  const [playing, setPlaying] = useState(false);
  const { watch, embed } = videoUrls(itinerary);

  return (
    <Section id="video" aura="gauche" className={page.chapter} aria-labelledby="video-title">
      <Container>
        <div className={`${bezel.bezel} ${styles.card}`}>
          <div className={`${bezel.core} ${styles.core}`}>
            <div className={styles.media}>
              {playing ? (
                <iframe
                  className={styles.frame}
                  src={embed}
                  title={localize(itinerary.title, lang)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button type="button" className={styles.poster} onClick={() => setPlaying(true)} aria-label={s.play}>
                  <Image
                    className={styles.image}
                    src={itinerary.thumbnail.src}
                    alt=""
                    fill
                    sizes="(min-width: 900px) 640px, 100vw"
                  />
                  <span className={`${bezel.glass} ${styles.play}`} aria-hidden="true">
                    <PlayIcon />
                  </span>
                </button>
              )}
            </div>
            <div className={styles.copy}>
              <Words as="h2" id="video-title" className={styles.title} text={{ k: "itineraire.video.title" }} glow />
              <p className={styles.text}>{s.text}</p>
              <div className={styles.actions}>
                <Button href={watch} external>
                  {s.watch}
                </Button>
                <Button href={subscribeUrl(channel)} external variant="ghost">
                  {s.subscribe}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
