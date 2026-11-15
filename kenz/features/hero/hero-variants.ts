/**
 * Les deux heros : le même paysage de Kuala Lumpur (l'heure bleue côté Pro, l'heure dorée côté Créateur),
 * le portrait détouré de Kenz, et le premier chapitre vers lequel mène le lien du bas.
 * Tailles réelles relevées avec `sips` sur public/assets/img.
 */
import type { ImageAsset } from "@/content/types";
import type { DictKey } from "@/i18n/dictionaries";

export type HeroVariant = "pro" | "createur";

interface HeroVariantConfig {
  landscape: ImageAsset;
  portrait: ImageAsset;
  /** L'ancre du premier chapitre (« Voir ce que je construis » → #apps). */
  next: string;
  line: DictKey;
  down: DictKey;
  portraitAlt: DictKey;
}

export const HERO_VARIANTS: Readonly<Record<HeroVariant, HeroVariantConfig>> = {
  pro: {
    landscape: { src: "/assets/img/horizon-pro.jpg", width: 1672, height: 941 },
    portrait: { src: "/assets/img/kenz-pro.webp", width: 1080, height: 1920 },
    next: "apps",
    line: "pro.hero.pro.line",
    down: "pro.hero.pro.down",
    portraitAlt: "pro.hero.pro.portraitAlt",
  },
  createur: {
    landscape: { src: "/assets/img/horizon-createur.jpg", width: 1672, height: 941 },
    portrait: { src: "/assets/img/kenz-moi.webp", width: 1080, height: 1920 },
    next: "voyage",
    line: "pro.hero.createur.line",
    down: "pro.hero.createur.down",
    portraitAlt: "pro.hero.createur.portraitAlt",
  },
};
