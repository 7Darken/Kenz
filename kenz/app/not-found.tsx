/**
 * La page 404 : hors des univers (pas de nav ni de pied de page), en français côté serveur, en anglais côté
 * client si besoin. Le retour mène à l'accueil de l'univers de l'adresse demandée : jamais d'un univers à l'autre.
 */
import type { Metadata } from "next";

import { LanguageProvider } from "@/i18n/language-provider";
import { getDictionary, universeMessages } from "@/i18n/server";
import { NotFoundView } from "./_components/not-found-view";

export const metadata: Metadata = {
  title: { absolute: getDictionary().common.notFound.meta },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <LanguageProvider messages={universeMessages("page")}>
      <NotFoundView />
    </LanguageProvider>
  );
}
