"use client";

/**
 * Le pied de page, classique et compact, dans ses trois univers (monté par le layout de l'univers).
 * Une grille de colonnes alignées sur la même ligne de base :
 *   la marque et la phrase · la navigation · les réseaux · (Créateur) le ciel secret ;
 * puis une barre du bas : « © 2026 Kenz » (et « Marques & collaborations » côté Créateur) à gauche,
 * les réglages (langue, thème) et « Revenir en haut » à droite.
 * 1024 px et plus : les colonnes côte à côte (le ciel sous la marque, puis à droite dès 1200) ; 560 à 1023 : la marque,
 * puis deux colonnes (le ciel sous la navigation) ; en dessous : une colonne.
 * Il ne lie ni ne nomme jamais l'autre univers. Le lien de la page courante devient une ancre (#top) avec
 * aria-current ; les liens vers une autre page portent les attributs du passage (couleur d'arrivée).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useRef, type ReactNode } from "react";

import { COPYRIGHT_YEAR, passageAttributes, ROUTES, type PassageTarget, type Universe } from "@/content/site";
import { socialsOf, type Social } from "@/content/socials";
import { Icon } from "@/design-system/components/icon";
import { LanguageToggle } from "@/design-system/components/language-toggle";
import { ThemeToggle } from "@/design-system/components/theme-toggle";
import { useInView } from "@/design-system/motion/use-in-view";
import { format } from "@/i18n/format";
import { useLanguage } from "@/i18n/language-provider";
import styles from "./footer.module.css";

interface FooterLink {
  label: string;
  /** Chemin, éventuellement avec ancre : « /agents », « /#apps », « #partage ». */
  href: string;
  passage?: PassageTarget;
  /** Flèche de retour (vers l'accueil Créateur). */
  back?: boolean;
}

interface FooterProps {
  variant: Universe;
  /** Créateur : le ciel secret (features/passages). */
  sky?: ReactNode;
}

/** Sur la page visée, le lien devient une ancre interne ; la page elle-même, #top (aria-current). */
function resolve(href: string, pathname: string) {
  const [path, hash] = href.split("#");
  if (!path || path === pathname) return hash ? { href: `#${hash}` } : { href: "#top", current: true };
  return { href };
}

export function Footer({ variant, sky }: FooterProps) {
  const pathname = usePathname();
  const { lang, t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { threshold: 0, rootMargin: "0px 0px -4% 0px" });
  const navTitleId = useId();
  const socialTitleId = useId();
  const f = t.footer;

  const content: Record<Universe, { phrase: string; links: FooterLink[]; socials: Social[]; extra: FooterLink[] }> = {
    pro: {
      phrase: f.pro.phrase,
      links: [
        { label: f.pro.apps, href: `${ROUTES.home}#apps`, passage: "pro" },
        { label: f.pro.escapades, href: ROUTES.app("escapades-libres"), passage: "escapades" },
        { label: f.pro.agents, href: ROUTES.agents, passage: "agents" },
        {
          label: f.pro.contact,
          href: pathname === ROUTES.agents ? `${ROUTES.agents}#contact` : `${ROUTES.home}#contact`,
          passage: "pro",
        },
      ],
      socials: socialsOf("pro"),
      extra: [],
    },
    createur: {
      phrase: f.createur.phrase,
      links: [
        { label: f.createur.voyage, href: ROUTES.voyage, passage: "voyage" },
        { label: f.createur.sport, href: ROUTES.sport, passage: "sport" },
      ],
      socials: [...socialsOf("voyage"), ...socialsOf("k15ze")],
      extra: [{ label: f.createur.brands, href: `${ROUTES.voyage}#marques`, passage: "voyage" }],
    },
    k15ze: {
      phrase: f.k15ze.phrase,
      links: [
        { label: f.k15ze.partage, href: `${ROUTES.sport}#partage` },
        { label: f.k15ze.courses, href: `${ROUTES.sport}#courses` },
        { label: f.k15ze.createur, href: ROUTES.createur, passage: "createur", back: true },
      ],
      socials: socialsOf("k15ze"),
      extra: [],
    },
  };
  const { phrase, links, socials, extra } = content[variant];

  const renderLink = (link: FooterLink) => {
    const target = resolve(link.href, pathname);
    const anchor = target.href.startsWith("#");
    const props = {
      className: styles.link,
      href: target.href,
      "aria-current": target.current ? ("page" as const) : undefined,
      ...(link.passage && !anchor ? passageAttributes(link.passage) : undefined),
    };
    const body = (
      <>
        {link.back ? (
          <i className={`${styles.ico} ${styles.icoBack}`}>
            <Icon name="arrow-left" />
          </i>
        ) : null}
        <span className={styles.text}>{link.label}</span>
      </>
    );
    // Une ancre de la page reste un simple <a> : next/link prendrait le clic, et MotionProvider ne pourrait plus
    // défiler en douceur ni donner le focus à la section (comme Button).
    return anchor ? <a {...props}>{body}</a> : <Link {...props}>{body}</Link>;
  };

  // Créateur : la chaîne k15ze se distingue de la chaîne voyage par son libellé.
  const socialLabel = (social: Social) =>
    variant === "createur" && social.universe === "k15ze" ? f.createur.youtubeK15ze : social.label;

  const withSky = variant === "createur" && Boolean(sky);
  const cls = [styles.footer, styles[variant], withSky && styles.withSky].filter(Boolean).join(" ");

  return (
    <footer ref={ref} className={cls} data-in={inView ? "" : undefined}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <p className={styles.logo}>
              Kenz<i className={styles.point} />
            </p>
            <p className={styles.phrase}>{phrase}</p>
          </div>

          <nav className={styles.nav} aria-labelledby={navTitleId}>
            <h2 id={navTitleId} className={styles.title}>
              {f.navLabel}
            </h2>
            <ul className={styles.list}>
              {links.map((link) => (
                <li key={link.href}>{renderLink(link)}</li>
              ))}
            </ul>
          </nav>

          <div className={styles.social}>
            <h2 id={socialTitleId} className={styles.title}>
              {f.socialLabel}
            </h2>
            <ul className={styles.list} aria-labelledby={socialTitleId}>
              {socials.map((social) => (
                <li key={social.id}>
                  <a
                    className={styles.link}
                    href={social.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={social.account ? social.ariaLabel[lang] : undefined}
                  >
                    <span className={styles.text}>{socialLabel(social)}</span>
                    <i className={`${styles.ico} ${styles.icoOut}`}>
                      <Icon name="arrow-up-right" />
                    </i>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {withSky ? <div className={styles.sky}>{sky}</div> : null}
        </div>

        <div className={styles.bar}>
          <div className={styles.legal}>
            <p className={styles.copy}>{format(f.copyright, { year: COPYRIGHT_YEAR })}</p>
            {extra.map((link) => (
              <span key={link.href}>{renderLink(link)}</span>
            ))}
          </div>
          <div className={styles.settings}>
            <LanguageToggle />
            <ThemeToggle bare className={styles.theme} />
            <a className={`${styles.link} ${styles.top}`} href="#top">
              <span className={styles.text}>{t.common.actions.backToTop}</span>
              <i className={`${styles.ico} ${styles.icoUp}`}>
                <Icon name="arrow-up" />
              </i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
