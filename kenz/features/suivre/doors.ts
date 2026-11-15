/**
 * Les deux portes de « Me suivre » : le voyage (Kenz en Asie, la DA Terre) et le sport (k15ze).
 * Chacune : ses comptes (content/socials), sa page, la couleur de son passage, la photo de son arche.
 */
import { ROUTES, type PassageTarget } from "@/content/site";
import type { SocialUniverse } from "@/content/socials";
import type { ImageAsset } from "@/content/types";

export interface FollowDoorConfig {
  /** Le bloc de textes `createur.follow.<key>`. */
  key: "voyage" | "sport";
  socials: SocialUniverse;
  href: string;
  passage: PassageTarget;
  background: ImageAsset;
}

export const FOLLOW_DOORS: readonly FollowDoorConfig[] = [
  {
    key: "voyage",
    socials: "voyage",
    href: ROUTES.voyage,
    passage: "voyage",
    background: { src: "/assets/img/video-japon.jpg", width: 960, height: 540 },
  },
  {
    key: "sport",
    socials: "k15ze",
    href: ROUTES.sport,
    passage: "sport",
    background: { src: "/assets/img/hyrox-1.jpg", width: 733, height: 1100 },
  },
];
