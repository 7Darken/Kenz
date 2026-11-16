/**
 * La page d'une app (`/apps/[slug]`, app.html) : le récit en 7 chapitres, chacun un nœud du fil.
 * Arrivée sous l'arche → problème → comment ça marche → l'IA en clair et sous le capot → en vrai → l'action
 * → l'histoire suivante. Escapades Libres (projet d'équipe web) : le motif au lieu de l'icône, « Mon rôle »,
 * un chapitre « 54 heures » en plus, la plateforme dans une fenêtre de navigateur ; sa suite est Oshii.
 * Composant serveur : chaque chapitre ne charge du JS que pour son mouvement.
 */
import { apps, getNextSlug, type App } from "@/content/apps";
import { Action } from "./action";
import { AiChapter } from "./ai-chapter";
import styles from "./app-detail.module.css";
import { AppTint } from "./app-tint";
import { Arrival } from "./arrival";
import { BrowserShowcase } from "./browser-showcase";
import { InRealLife } from "./in-real-life";
import { NextStory } from "./next-story";
import { Problem } from "./problem";
import { HowItWorksChapter } from "./scenes/registry";
import { Weekend } from "./weekend";

export function AppDetail({ app }: { app: App }) {
  const next = apps[getNextSlug(app.slug)];
  return (
    <div className={styles.page} data-app-page={app.slug}>
      <AppTint app={app} next={next} />
      <Arrival app={app} />
      <Problem app={app} />
      <HowItWorksChapter app={app} />
      <AiChapter app={app} />
      {app.kind === "web" ? (
        <>
          <Weekend app={app} />
          <BrowserShowcase app={app} />
        </>
      ) : (
        <InRealLife app={app} />
      )}
      <Action app={app} />
      <NextStory next={next} />
    </div>
  );
}
