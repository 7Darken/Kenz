/** Univers Créateur, DA « Terre » (`/createur`, `/createur/voyage`) : la nav et le pied de page Créateur. */
import type { ReactNode } from "react";

import { Cordon, StarSky } from "@/features/passages";
import { UniverseShell } from "../../../_components/universe-shell";

export default function TerreLayout({ children }: { children: ReactNode }) {
  // Les passages secrets vers l'univers Pro : le cordon du point du logo et le ciel du pied de page.
  return (
    <UniverseShell universe="createur" navDot={<Cordon />} sky={<StarSky />}>
      {children}
    </UniverseShell>
  );
}
