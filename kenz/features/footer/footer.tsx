"use client";

/**
 * Le pied de page compact, dans ses trois univers (monté par le layout de l'univers) :
 * - pro : la phrase ; Mes apps, Escapades Libres, Agents IA, Contact ; GitHub, LinkedIn ; le bouton de mode ;
 * - createur : la phrase ; Le voyage, Le sport ; les réseaux voyage et k15ze ; Marques & collaborations ;
 *   `sky` : l'emplacement du ciel secret (branché par features/passages) ;
 * - k15ze : la promesse ; Ce que je partage, Mes courses, Toute ma création de contenu ; YouTube k15ze.
 * Il ne lie ni ne nomme jamais l'autre univers. Le lien de la page courante devient une ancre (#top) avec
 * aria-current ; les liens vers une autre page portent les attributs du passage (couleur d'arrivée).
 * Le sélecteur de langue (absent de la maquette) est en ligne 2 ; sur téléphone, il se pose sur la ligne du logo,
 * pour que le pied de page garde la hauteur de la maquette.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";

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

  const renderLink = (link: FooterLink, className?: string) => {
    const target = resolve(link.href, pathname);
    const anchor = target.href.startsWith("#");
    const props = {
      className: className ? `${styles.link} ${className}` : styles.link,
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

  const cls = [styles.footer, variant === "createur" && styles.createur, variant === "k15ze" && styles.k15ze]
    .filter(Boolean)
    .join(" ");

  return (
    <footer ref={ref} className={cls} data-in={inView ? "" : undefined}>
      <div className={styles.inner}>
        <div className={styles.line1}>
          <p className={styles.id}>
            <span className={styles.logo}>
              Kenz<i className={styles.point} />
            </span>
            <span className={styles.phrase}>{phrase}</span>
          </p>
          <nav className={styles.nav} aria-label={f.label}>
            <ul className={styles.list} aria-label={f.navLabel}>
              {links.map((link) => (
                <li key={link.href}>{renderLink(link)}</li>
              ))}
            </ul>
            <ul className={`${styles.list} ${styles.social}`} aria-label={f.socialLabel}>
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
          </nav>
        </div>

        {variant === "createur" && sky ? <div className={styles.sky}>{sky}</div> : null}

        <div className={styles.bottom}>
          <p className={styles.copy}>{format(f.copyright, { year: COPYRIGHT_YEAR })}</p>
          {extra.map((link) => (
            <span key={link.href} className={styles.discreet}>
              {renderLink(link)}
            </span>
          ))}
          <div className={styles.end}>
            <LanguageToggle className={styles.lang} />
            {variant === "pro" ? <ThemeToggle bare /> : null}
            <a className={styles.link} href="#top">
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
