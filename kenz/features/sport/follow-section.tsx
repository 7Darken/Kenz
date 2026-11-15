/** « Me suivre » côté k15ze (sport.html, `#suivre`) : la chaîne YouTube k15ze, en icône (TikTok pas encore lancé). */
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { SocialLinks } from "@/features/univers/social-links";
import page from "@/features/univers/page.module.css";
import { SweepTitle } from "@/features/univers/sweep-title";
import styles from "./follow-section.module.css";
import k15ze from "./sport.module.css";

export function FollowSection() {
  return (
    <Section id="suivre" aura="centre" className={page.chapter} aria-labelledby="suivre-title">
      <Container className={styles.inner}>
        <SweepTitle id="suivre-title" text={{ k: "sport.suivre.title" }} className={k15ze.title} />
        <Reveal variant="fade">
          <SocialLinks universe="k15ze" tone="k15ze" label={{ k: "sport.suivre.accounts" }} />
        </Reveal>
      </Container>
    </Section>
  );
}
