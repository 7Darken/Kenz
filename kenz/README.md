# kenzenbien.fr

Le site de Kenz : deux univers séparés, **Pro** (l'espace : apps, agents IA) et **Créateur** (la Terre : le voyage en Asie, le sport avec k15ze), en français et en anglais, en mode clair et en mode sombre.

## Installation

Prérequis : Node 22.

```bash
npm install
cp .env.local.example .env.local   # TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID (formulaires)
```

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production, puis sitemap (`next-sitemap`) |
| `npm run start` | Sert le build |
| `npm run lint` | ESLint (flat config) |
| `npx tsc --noEmit` | Vérification des types |

## Pile

- Next.js 16 (App Router, React Compiler)
- React 19
- TypeScript 6, en mode strict
- CSS Modules et jetons CSS
- GSAP et ScrollTrigger, Lenis
- three.js pour la Terre

## Architecture

```
app/                 routes : (pro) /, /apps/[slug], /agents · (createur) /createur, /createur/voyage, /createur/sport
                     layout racine (polices, script de thème, providers), api/contact (Telegram)
design-system/       tokens.css, base.css, thème, primitives (Button, Arch, Fil, Aura, Loupe, Reveal, Words, Dialog…)
features/            un dossier par module (motion, nav, footer, hero, apps-space, victoire, ia, terre, courses, passages…)
content/             données typées et localisées : apps, startup-weekend, ia, series, courses, socials, site, contact
i18n/                FR par défaut, `?lang=en` ; dictionnaires par espace de noms ; <T>, useTranslation, localize
public/assets/       images, captures, objets 3D et textures de la maquette
docs/refonte-v6/     ARCHITECTURE.md (décisions), CARTE.md (maquette → code), CONVENTIONS.md (écrire un module)
```

La maquette de référence est dans `maquettes/v6/`. Les anciennes adresses (`/projets/*`, `/destination/*`) redirigent en 308.
