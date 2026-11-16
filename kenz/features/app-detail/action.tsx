/**
 * 6. L'action (#action, la cible du bouton « Essayer » de la nav) : pour une app mobile, ses badges officiels
 * (Oshii : App Store et Google Play ; les autres : App Store) et son site ; pour Escapades Libres, « Le site est
 * en ligne. » et « Voir le site ».
 */

import type { App } from "@/content/apps";
import { Button } from "@/design-system/components/button";
import { EscapadesMark } from "@/design-system/components/escapades-mark";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { StoreBadge } from "@/design-system/components/store-badge";
import { ThemedImage } from "@/design-system/components/themed-image";
import { Words } from "@/design-system/components/words";
import { T } from "@/i18n/text";
import styles from "./action.module.css";
import page from "./app-detail.module.css";

const TITLE_ID = "action-titre";

export function Action({ app }: { app: App }) {
  return (
    <Section id="action" className={styles.action} aura="centre" fil="center" tabIndex={-1} aria-labelledby={TITLE_ID}>
      {app.kind === "mobile" ? (
        <>
          <Reveal>
            <ThemedImage className={styles.icon} src={app.icon.src} darkSrc={app.iconDark?.src} width={app.icon.width} height={app.icon.height} alt="" sizes="100px" />
          </Reveal>
          <Words as="h2" id={TITLE_ID} className={page.say} text={{ k: "apps.action.title" }} />
          <Reveal variant="fade" index={4} className={styles.buttons}>
            {app.story.stores.map((link) => (
              <StoreBadge key={link.store} store={link.store} href={link.href} />
            ))}
          </Reveal>
          {app.story.site ? (
            <Reveal variant="fade" index={5}>
              <a className={page.link} href={app.story.site} target="_blank" rel="noopener">
                <T k="apps.action.site" vars={{ app: app.name }} />
              </a>
            </Reveal>
          ) : null}
        </>
      ) : (
        <>
          <Reveal className={styles.mark}>
            <EscapadesMark className={page.mark} />
          </Reveal>
          <Words as="h2" id={TITLE_ID} className={page.say} text={{ k: "apps.action.webTitle" }} />
          <Reveal variant="fade" index={4} className={styles.buttons}>
            <Button className={styles.light} variant="light" href={app.story.site} external>
              <T k="apps.action.seeSite" />
            </Button>
          </Reveal>
        </>
      )}
    </Section>
  );
}
