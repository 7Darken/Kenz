/**
 * C3 « Me suivre » (#suivre) : deux univers, deux compositions posées sur le fond (sans cartes). Ordinateur : côte à
 * côte, en miroir et en rythmes décalés (le sport plus bas), une lumière diffuse entre les deux ; mobile : l'une sous
 * l'autre. Un inconnu comprend qu'il y a deux univers et choisit le sien.
 */
import { Container } from "@/design-system/components/container";
import { Section } from "@/design-system/components/section";
import { Words } from "@/design-system/components/words";
import { SweepTitle } from "@/features/terre/sweep-title";
import { FOLLOW_DOORS } from "./doors";
import { FollowDoor } from "./follow-door";
import styles from "./suivre-section.module.css";

const TITLE_ID = "suivre-t";

export function SuivreSection() {
  return (
    <Section id="suivre" aura="calme" aria-labelledby={TITLE_ID} className={styles.section}>
      <Container>
        <header className={styles.head}>
          <SweepTitle id={TITLE_ID} text={{ k: "createur.follow.title" }} className={styles.title} />
          <Words text={{ k: "createur.follow.lead" }} glow className={styles.lead} />
        </header>
        <div className={styles.list}>
          {FOLLOW_DOORS.map((door, index) => (
            <FollowDoor key={door.key} door={door} index={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
