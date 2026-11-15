/**
 * 5. En vrai (apps mobiles) : les vraies captures en bento, l'icône et la sortie sur l'App Store,
 * la dernière version. La loupe grossit les captures.
 */
import Image from "next/image";

import type { MobileApp } from "@/content/apps";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { T } from "@/i18n/text";
import page from "./app-detail.module.css";
import { ContentImage } from "./content-image";
import styles from "./in-real-life.module.css";
import { ParallaxShot } from "./parallax-shot";
import { ReleaseSince, ReleaseVersion } from "./release-lines";
import { SweepTitle } from "./sweep-title";

const TITLE_ID = "vrai-titre";

export function InRealLife({ app }: { app: MobileApp }) {
  const { shots, release } = app.story;
  const portrait = shots.layout !== "land";
  const shotClass = portrait ? styles.portrait : styles.landscape;
  const sizes = portrait ? "(min-width: 900px) 300px, 45vw" : "(min-width: 900px) 760px, 100vw";

  return (
    <Section className={`${styles.real} ${styles[shots.layout]}`} aura="droite" aria-labelledby={TITLE_ID}>
      <Container>
        <SweepTitle id={TITLE_ID} className={page.h2}>
          <T k="apps.real.title" />
        </SweepTitle>
        <div className={styles.bento}>
          <Reveal className={`${styles.cell} ${styles.info}`} index={0}>
            <div className={page.bezel}>
              <div className={`${page.bezelCore} ${styles.infoCore}`}>
                <Image className={styles.infoIcon} src={app.icon.src} width={app.icon.width} height={app.icon.height} alt="" sizes="72px" />
                <p className={styles.line}>
                  <ReleaseSince release={release} />
                </p>
              </div>
            </div>
          </Reveal>
          {shots.images.map((image, index) => (
            <Reveal
              key={image.src}
              as="figure"
              className={`${styles.cell} ${styles.shot} ${shotClass} ${index ? styles.second : styles.first}`}
              index={index + 1}
            >
              <div className={page.bezel}>
                <div className={`${page.bezelCore} ${styles.shotCore}`}>
                  {portrait ? (
                    <ParallaxShot image={image} className={styles.shotImg} sizes={sizes} depth={index ? 1 : 0} />
                  ) : (
                    <ContentImage image={image} className={styles.shotImg} sizes={sizes} loupe />
                  )}
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal className={`${styles.cell} ${styles.update}`} index={shots.images.length + 1}>
            <div className={page.bezel}>
              <div className={`${page.bezelCore} ${styles.updateCore}`}>
                <span className={styles.glyph} aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                    <circle cx="10" cy="10" r="7.25" />
                    <path d="M10 6v4.2l2.8 1.8" />
                  </svg>
                </span>
                <p className={styles.line}>
                  <ReleaseVersion release={release} />
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
