import Image from "next/image";
import { Github, Linkedin, Youtube, Instagram, Share2, ExternalLink, Globe } from "lucide-react";
import { createElement, type ReactNode } from "react";

export type SocialLabel =
  | "TikTok"
  | "YouTube"
  | "GitHub"
  | "LinkedIn"
  | "Instagram"
  | "Product Hunt"
  | "Case Study"
  | "Apple"
  | "Website"
  | "Demo";

type IconFactory = (options?: { size?: number }) => ReactNode;

type SocialDefinition = {
  label: SocialLabel;
  icon: IconFactory;
};

const socialDefinitions: Record<SocialLabel, SocialDefinition> = {
  TikTok: {
    label: "TikTok",
    icon: ({ size = 16 } = {}) =>
      createElement(Image, {
        src: "/images/icons/tiktok_white.png",
        alt: "TikTok",
        width: size,
        height: size,
        "aria-hidden": true,
      }),
  },
  YouTube: {
    label: "YouTube",
    icon: ({ size = 16 } = {}) => createElement(Youtube, { size, "aria-hidden": true }),
  },
  GitHub: {
    label: "GitHub",
    icon: ({ size = 16 } = {}) => createElement(Github, { size, "aria-hidden": true }),
  },
  LinkedIn: {
    label: "LinkedIn",
    icon: ({ size = 16 } = {}) => createElement(Linkedin, { size, "aria-hidden": true }),
  },
  Instagram: {
    label: "Instagram",
    icon: ({ size = 16 } = {}) => createElement(Instagram, { size, "aria-hidden": true }),
  },
  "Product Hunt": {
    label: "Product Hunt",
    icon: ({ size = 16 } = {}) => createElement(Share2, { size, "aria-hidden": true }),
  },
  "Case Study": {
    label: "Case Study",
    icon: ({ size = 16 } = {}) => createElement(Share2, { size, "aria-hidden": true }),
  },
  Apple: {
    label: "Apple",
    icon: ({ size = 16 } = {}) =>
      createElement(Image, {
        src: "/images/icons/Apple_logo_white.png",
        alt: "Apple",
        width: size,
        height: size,
        "aria-hidden": true,
      }),
  },
  Website: {
    label: "Website",
    icon: ({ size = 16 } = {}) => createElement(Globe, { size, "aria-hidden": true }),
  },
  Demo: {
    label: "Demo",
    icon: ({ size = 16 } = {}) => createElement(ExternalLink, { size, "aria-hidden": true }),
  },
};

export function getSocialIcon(label: string, options?: { size?: number }): ReactNode {
  const definition = socialDefinitions[label as SocialLabel];
  if (definition) {
    return definition.icon(options);
  }

  return createElement(Share2, { size: options?.size ?? 16, "aria-hidden": true });
}

export type HeroSocial = {
  label: SocialLabel;
  href: string;
};

export const HERO_SOCIALS: HeroSocial[] = [
  { label: "TikTok", href: "https://www.tiktok.com/@7kinze" },
  { label: "YouTube", href: "https://www.youtube.com/@7Kinze" },
  { label: "GitHub", href: "https://github.com/7Darken" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kenz-narainen/" },
];

export const FOOTER_SOCIALS: HeroSocial[] = [
  { label: "GitHub", href: "https://github.com/7Darken" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kenz-narainen/" },
  { label: "TikTok", href: "https://www.tiktok.com/@7kinze" },
  { label: "YouTube", href: "https://www.youtube.com/@7Kinze" },
];
