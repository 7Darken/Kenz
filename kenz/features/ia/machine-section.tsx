/** La machine sur /agents (mode complet) : le premier chapitre du fil, juste sous la phrase forte. */
import { Section } from "@/design-system/components/section";
import { T } from "@/i18n/text";
import { IaMachine } from "./ia-machine";

export function MachineSection() {
  return (
    <Section id="machine" aura="droite" aria-labelledby="machine-t">
      <h2 id="machine-t" className="sr">
        <T k="agents.machine.label" />
      </h2>
      <IaMachine mode="complete" caseId="recette" />
    </Section>
  );
}
