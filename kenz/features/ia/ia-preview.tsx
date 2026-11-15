/** L'aperçu de la machine, pour l'accueil Pro (contrat public : voir ./index.ts). */
import { isIaCaseId } from "@/content/ia";
import { ROUTES } from "@/content/site";
import { IaMachine } from "./ia-machine";

export interface IaPreviewProps {
  /** `recette | assiette | video | projet` ; défaut et id inconnu : `recette`. */
  caseId?: string;
  /** Cible de « Voir comment » (défaut `/agents`) ; `""` : pas de lien. */
  href?: string;
}

export function IaPreview({ caseId = "recette", href = ROUTES.agents }: IaPreviewProps) {
  return <IaMachine mode="preview" caseId={isIaCaseId(caseId) ? caseId : "recette"} href={href} />;
}
