"use client";

/**
 * La navigation fixe, dans ses trois univers (montée par le layout de l'univers) :
 * - pro : « Kenz· », le bouton de mode, « Me contacter » (#contact) ; sur une page d'app, l'icône de l'app
 *   et « Essayer » (#action) ;
 * - createur : sur l'accueil, la barre « stories » et le nom du chapitre en cours ; sur une page d'univers
 *   (voyage), le retour « Création de contenu » ;
 * - k15ze : le retour « Création de contenu ».
 * `dot` : le point du logo. Par défaut un simple point ; côté Créateur, features/passages y branche le cordon.
 * Aucun lien visible vers l'autre univers.
 */
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

import { apps, isAppSlug } from "@/content/apps";
import { passageAttributes, ROUTES, type Universe } from "@/content/site";
import { EscapadesMark } from "@/design-system/components/escapades-mark";
import { Icon } from "@/design-system/components/icon";
import { ThemeToggle } from "@/design-system/components/theme-toggle";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import styles from "./nav.module.css";
import { StoryBar, type StoryChapter } from "./story-bar";

interface NavProps {
  variant: Universe;
  /** Le point du logo (ex. le cordon, branché par features/passages). */
  dot?: ReactNode;
}

const STORY_IDS = ["top", "voyage", "sport", "suivre"] as const;

/* Le voile de la nav apparaît dès qu'on a quitté le haut de la page. */
const subscribeScroll = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};
const useScrolled = () =>
  useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 24,
    () => false,
  );

export function Nav({ variant, dot }: NavProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const scrolled = useScrolled();
  const [chapterIndex, setChapterIndex] = useState(0);

  const isCreateurHome = variant === "createur" && pathname === ROUTES.createur;
  const appSlug = variant === "pro" ? pathname.match(/^\/apps\/([^/]+)/)?.[1] : undefined;
  const app = appSlug && isAppSlug(appSlug) ? apps[appSlug] : undefined;
  const storyChapters = useMemo<StoryChapter[]>(
    () => STORY_IDS.map((id) => ({ id, label: t.createur.chapters[id] })),
    [t],
  );

  // Le logo : sur la page d'accueil de l'univers, il remonte en haut ; ailleurs, il y mène.
  const homeHref = variant === "pro" ? ROUTES.home : ROUTES.createur;
  const logoHref = pathname === homeHref ? "#top" : homeHref;
  const logoPassage = variant !== "pro" && pathname !== homeHref ? passageAttributes("createur") : undefined;

  const cls = [styles.nav, isCreateurHome && styles.withStory].filter(Boolean).join(" ");

  return (
    <header className={cls} data-scrolled={scrolled ? "" : undefined}>
      {isCreateurHome ? (
        <StoryBar chapters={storyChapters} label={t.common.nav.chapters} onChapterChange={setChapterIndex} />
      ) : null}
      <div className={styles.inner}>
        <Link className={styles.logo} href={logoHref} {...logoPassage}>
          Kenz{dot ?? <span className={styles.dot} aria-hidden="true" />}
        </Link>

        {isCreateurHome ? (
          <p className={styles.chapter} aria-hidden="true">
            <span key={chapterIndex} className={styles.chapterText}>
              {storyChapters[chapterIndex]?.label}
            </span>
          </p>
        ) : null}

        {variant !== "pro" && !isCreateurHome ? (
          <Link className={styles.back} href={ROUTES.createur} {...passageAttributes("createur")}>
            <span className={styles.backIco} aria-hidden="true">
              <Icon name="arrow-left" />
            </span>
            <span className={styles.backLong}>{t.common.nav.back}</span>
            <span className={styles.backShort}>{t.common.nav.backShort}</span>
          </Link>
        ) : null}

        <ThemeToggle />

        {app?.kind === "mobile" ? (
          <a className={styles.app} href="#action" aria-label={format(t.common.nav.tryAppLabel, { app: app.name })}>
            <Image src={app.icon.src} alt="" width={34} height={34} sizes="34px" />
            <span>{t.common.nav.tryApp}</span>
          </a>
        ) : null}

        {app?.kind === "web" ? (
          <a className={styles.app} href="#action" aria-label={format(t.common.nav.seeSiteLabel, { app: app.name })}>
            <span className={styles.mark} aria-hidden="true">
              <EscapadesMark />
            </span>
            <span>{t.common.nav.seeSite}</span>
          </a>
        ) : null}

        {variant === "pro" && !app ? (
          <a className={styles.cta} href="#contact">
            <span>{t.common.nav.contact}</span>
            <span className={styles.ctaIco} aria-hidden="true">
              <Icon name="arrow-up-right" />
            </span>
          </a>
        ) : null}
      </div>
    </header>
  );
}
