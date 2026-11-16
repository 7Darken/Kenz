"use client";

/**
 * 7. L'histoire suivante : la question de l'app suivante, dans sa couleur ; son icône se pose au survol.
 * Sur écran tactile, elle s'allume quand elle passe au centre de l'écran. Le lien part avec le passage
 * coloré (features/passages), dans la teinte de l'app suivante.
 */
import Link from "next/link";
import { useEffect, useRef } from "react";

import type { MobileApp } from "@/content/apps";
import { ROUTES } from "@/content/site";
import { Container } from "@/design-system/components/container";
import { Icon } from "@/design-system/components/icon";
import { Rich } from "@/design-system/components/rich";
import { Section } from "@/design-system/components/section";
import { ThemedImage } from "@/design-system/components/themed-image";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import { localize } from "@/i18n/localize";
import styles from "./next-story.module.css";

const CAPTION_ID = "suite-legende";

export function NextStory({ next }: { next: MobileApp }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { lang, t } = useLanguage();

  // Tactile : la suite s'allume quand elle traverse le centre de l'écran.
  useEffect(() => {
    const link = linkRef.current;
    const section = link?.closest("section");
    if (!link || !section || window.matchMedia("(hover: hover)").matches) return;
    const io = new IntersectionObserver(([e]) => section.toggleAttribute("data-hot", !!e?.isIntersecting), {
      rootMargin: "-36% 0px -36% 0px",
    });
    io.observe(link);
    return () => {
      io.disconnect();
      section.removeAttribute("data-hot");
    };
  }, []);

  return (
    <Section className={styles.next} aura="bas" aria-label={t.apps.next.label}>
      <Container>
        <Link
          ref={linkRef}
          className={styles.question}
          href={ROUTES.app(next.slug)}
          aria-describedby={CAPTION_ID}
          data-passage=""
          data-couleur={next.colors.tint}
        >
          <Rich text={localize(next.story.question, lang)} />
          {"⁠"}
          <ThemedImage className={styles.icon} src={next.icon.src} darkSrc={next.iconDark?.src} width={next.icon.width} height={next.icon.height} alt="" sizes="120px" />
        </Link>
        <p className={styles.caption} id={CAPTION_ID}>
          {format(t.apps.next.caption, { app: next.name })}
          <Icon name="arrow-right" />
        </p>
      </Container>
    </Section>
  );
}
