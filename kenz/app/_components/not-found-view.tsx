"use client";

/** Le contenu de la page 404, dans l'univers de l'adresse demandée (ses couleurs, et le retour à son accueil). */
import { usePathname } from "next/navigation";

import { ROUTES, type Universe } from "@/content/site";
import { Button } from "@/design-system/components/button";
import { Rich } from "@/design-system/components/rich";
import { useTranslation } from "@/i18n/language-provider";
import styles from "./not-found-view.module.css";

const HOMES: Readonly<Record<Universe, string>> = { pro: ROUTES.home, createur: ROUTES.createur, k15ze: ROUTES.sport };

function universeOf(pathname: string): Universe {
  if (pathname === ROUTES.sport || pathname.startsWith(`${ROUTES.sport}/`)) return "k15ze";
  if (pathname === ROUTES.createur || pathname.startsWith(`${ROUTES.createur}/`)) return "createur";
  return "pro";
}

export function NotFoundView() {
  const t = useTranslation().common.notFound;
  const universe = universeOf(usePathname());

  return (
    <div data-univers={universe}>
      <main className={styles.page}>
        <h1 className={styles.title}>
          <Rich text={t.title} />
        </h1>
        <p className={styles.text}>{t.text}</p>
        <Button href={HOMES[universe]} icon="arrow-left">
          {t.back}
        </Button>
      </main>
    </div>
  );
}
