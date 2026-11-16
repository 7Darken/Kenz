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
 * L'arrivée (app.html, agents.html, voyage.html, sport.html) : sur une page d'app, sur /agents et sur les pages
 * d'univers, la barre apparaît en fondu quand la page arrive (au chargement, ou quand le voile du passage se lève :
 * `usePassageArrival` de features/passages), 1,4 s après sur une page d'app ; pendant l'arrivée d'un passage,
 * le retour reste masqué (shared/passage.css, `.kz-passage-arrivee .kz-back`).
 */
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

import type { NavApp } from "@/content/apps";
import { passageAttributes, ROUTES, type Universe } from "@/content/site";
import { EscapadesMark } from "@/design-system/components/escapades-mark";
import { Icon } from "@/design-system/components/icon";
import { ThemeToggle } from "@/design-system/components/theme-toggle";
import { usePassageArrival } from "@/features/passages";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import styles from "./nav.module.css";
import { StoryBar, type StoryChapter } from "./story-bar";

interface NavProps {
  variant: Universe;
  /** Le point du logo (ex. le cordon, branché par features/passages). */
  dot?: ReactNode;
  /** Pro : les apps (nom, type, icône), passées par le layout serveur pour ne pas embarquer content/apps. */
  apps?: Readonly<Record<string, NavApp>>;
}

const STORY_IDS = ["top", "voyage", "sport", "suivre"] as const;

/** Le fondu d'arrivée de la barre : `app` (1,4 s après l'arrivée), `page` (0,2 s après), ou aucun (accueils). */
type NavFade = "app" | "page" | null;

function navFade(variant: Universe, pathname: string, isApp: boolean): NavFade {
  if (isApp) return "app";
  if (variant === "pro") return pathname === ROUTES.agents ? "page" : null;
  return pathname === ROUTES.createur ? null : "page";
}

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

export function Nav({ variant, dot, apps }: NavProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const scrolled = useScrolled();
  const [chapterIndex, setChapterIndex] = useState(0);

  const isCreateurHome = variant === "createur" && pathname === ROUTES.createur;
  const appSlug = variant === "pro" ? pathname.match(/^\/apps\/([^/]+)/)?.[1] : undefined;
  const app = appSlug && apps && Object.hasOwn(apps, appSlug) ? apps[appSlug] : undefined;
  const fade = navFade(variant, pathname, !!app);
  const { via, ready } = usePassageArrival();
  // La page arrivée (son chemin) : la barre apparaît une image après, et disparaît d'un coup à la page suivante.
  const [arrivedPath, setArrivedPath] = useState<string | null>(null);

  useEffect(() => {
    if (!fade || !ready) return;
    const frame = requestAnimationFrame(() => setArrivedPath(pathname));
    return () => cancelAnimationFrame(frame);
  }, [fade, ready, pathname]);
  const storyChapters = useMemo<StoryChapter[]>(
    () => STORY_IDS.map((id) => ({ id, label: t.createur.chapters[id] })),
    [t],
  );

  // Le logo : sur la page d'accueil de l'univers, il remonte en haut ; ailleurs, il y mène.
  const homeHref = variant === "pro" ? ROUTES.home : ROUTES.createur;
  const logoHref = pathname === homeHref ? "#top" : homeHref;
  const logoPassage = variant !== "pro" && pathname !== homeHref ? passageAttributes("createur") : undefined;
  const logo = <>Kenz{dot ?? <span className={styles.dot} aria-hidden="true" />}</>;

  const cls = [styles.nav, isCreateurHome && styles.withStory].filter(Boolean).join(" ");

  return (
    <header
      className={cls}
      data-scrolled={scrolled ? "" : undefined}
      data-fade={fade ?? undefined}
      data-in={fade && arrivedPath === pathname ? "" : undefined}
      data-arriving={via && !ready ? "" : undefined}
    >
      {isCreateurHome ? (
        <StoryBar chapters={storyChapters} label={t.common.nav.chapters} onChapterChange={setChapterIndex} />
      ) : null}
      <div className={styles.inner}>
        {logoHref === "#top" ? (
          // Sur l'accueil, une ancre simple : MotionProvider remonte en douceur (next/link prendrait le clic).
          <a className={styles.logo} href={logoHref}>
            {logo}
          </a>
        ) : (
          <Link className={styles.logo} href={logoHref} {...logoPassage}>
            {logo}
          </Link>
        )}

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

        {app?.kind === "mobile" && app.icon ? (
          <a className={styles.app} href="#action" aria-label={format(t.common.nav.tryAppLabel, { app: app.name })}>
            <Image src={app.icon} alt="" width={34} height={34} sizes="34px" />
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
