# Prompt — Analyse technique d'une app pour le portfolio

> Colle ce prompt **à la racine du repo de l'app concernée** (Claude Code, Cursor, ou toute IA ayant accès au code).
> Il analyse le vrai code et te renvoie un bloc `technical` prêt à coller dans `data/projects.ts` du portfolio,
> dans le `detail` du projet correspondant.

---

Tu es en train d'analyser le code source de cette application mobile pour alimenter mon **portfolio de développeur**.
Objectif : qu'un recruteur ou un dev qui regarde la page de l'app comprenne **les technos réellement utilisées**, **les intégrations IA**, et **les choix techniques** — le tout replacé dans le **contexte fonctionnel** de l'app.

## Ce que tu dois faire

1. **Analyse le repo réellement.** Inspecte notamment :
   - `package.json` / lockfile (dépendances, versions clés)
   - les fichiers de config (`app.json`, `app.config.*`, `eas.json`, `tsconfig`, etc.)
   - le code des appels réseau / clients API / SDK
   - les **noms** de variables d'environnement (jamais les valeurs/secrets) pour repérer les services tiers
   - tout ce qui touche à l'IA (SDK OpenAI/Anthropic/autre, appels modèles, prompts, transcription, embeddings…)
2. **N'invente rien.** Ne liste que des technos/services réellement présents dans le code. Si tu n'es pas sûr d'un point, omets-le.
3. **Replace tout dans le contexte de l'app** : explique à quoi sert chaque techno IA *pour cette app précise*.
4. **Reste concis et lisible** : chips = 1 à 3 mots ; descriptions = 1 à 2 phrases max ; en **français**.

## Format de sortie — IMPORTANT

Renvoie **uniquement** un bloc de code TypeScript contenant l'objet `technical` ci-dessous (rien d'autre, pas de blabla autour),
prêt à coller dans le `detail` du projet dans `data/projects.ts` :

```ts
technical: {
  // Résumé de l'architecture en 1 à 2 phrases (stack principale + ce qui fait la spécificité technique de l'app)
  summary: "…",

  // Groupes de stack. Catégories suggérées : "Frontend", "Backend & Data", "IA & ML", "Infra & Outils", "Temps réel & Data", "APIs & Services"…
  stack: [
    { label: "Frontend", items: ["React Native", "Expo", "TypeScript"] },
    { label: "Backend & Data", items: ["Supabase", "PostgreSQL"] },
    { label: "IA & ML", items: ["OpenAI GPT-4o"] },
    { label: "Infra & Outils", items: ["EAS Build", "RevenueCat"] },
  ],

  // Intégrations IA : 1 entrée par usage distinct de l'IA dans l'app. Omettre la clé `ai` si l'app n'utilise pas d'IA.
  ai: [
    {
      title: "…",        // ce que l'IA fait, côté utilisateur
      model: "…",        // modèle / SDK exact, ex: "OpenAI GPT-4o (JSON mode)", "Whisper", "Anthropic Claude"
      description: "…",  // comment c'est concrètement utilisé dans cette app
    },
  ],

  // Défis techniques notables résolus dans l'app (2 à 3 max). Optionnel mais valorisant.
  highlights: [
    { title: "…", description: "…" },
  ],
}
```

## Règles de qualité

- **Honnêteté technique** : un dev qui lit ça doit te croire. Pas de buzzwords creux, pas de techno fantôme.
- **Versions** : seulement si elles sont marquantes (ex: "Expo SDK 52"), sinon laisse le nom seul.
- **IA en valeur** : c'est ce qui m'intéresse le plus à mettre en avant — sois précis sur le(s) modèle(s) et le pipeline.
- **Pas de secrets** : ne recopie jamais une clé, un token ou une URL privée.
- Si une catégorie est vide, **ne crée pas le groupe** plutôt que de mettre du remplissage.

Renvoie le bloc `technical` final, et rien d'autre.
