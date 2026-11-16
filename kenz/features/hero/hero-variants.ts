/**
 * Les deux heros : le même paysage de Kuala Lumpur (l'heure bleue côté Pro, l'heure dorée côté Créateur),
 * le portrait détouré de Kenz (content/site.ts), et le premier chapitre vers lequel mène le lien du bas.
 * Tailles réelles relevées avec `sips` sur public/assets/img.
 */
import { PORTRAITS } from "@/content/site";
import type { ImageAsset } from "@/content/types";
import type { DictKey } from "@/i18n/dictionaries";

export type HeroVariant = "pro" | "createur";

interface HeroVariantConfig {
  landscape: ImageAsset;
  portrait: ImageAsset;
  /** L'ancre du premier chapitre (« Voir ce que je construis » → #apps). */
  next: string;
  /** Les textes : `pro.hero` côté Pro, `createur.hero` côté Créateur. */
  title: DictKey;
  line: DictKey;
  down: DictKey;
  portraitAlt: DictKey;
}

export const HERO_VARIANTS: Readonly<Record<HeroVariant, HeroVariantConfig>> = {
  pro: {
    landscape: { src: "/assets/img/horizon-pro.jpg", width: 1672, height: 941 },
    portrait: PORTRAITS.pro,
    next: "apps",
    title: "pro.hero.title",
    line: "pro.hero.line",
    down: "pro.hero.down",
    portraitAlt: "pro.hero.portraitAlt",
  },
  createur: {
    landscape: { src: "/assets/img/horizon-createur.jpg", width: 1672, height: 941 },
    portrait: PORTRAITS.createur,
    next: "voyage",
    title: "createur.hero.title",
    line: "createur.hero.line",
    down: "createur.hero.down",
    portraitAlt: "createur.hero.portraitAlt",
  },
};
