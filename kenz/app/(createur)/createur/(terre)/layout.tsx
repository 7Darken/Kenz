/** Univers Créateur, DA « Terre » (`/createur`, `/createur/voyage`) : la nav et le pied de page Créateur. */
import type { ReactNode } from "react";

import { UniverseShell } from "../../../_components/universe-shell";

export default function TerreLayout({ children }: { children: ReactNode }) {
  // features/passages branchera ici le cordon du logo (navDot) et le ciel du pied de page (sky).
  return <UniverseShell universe="createur">{children}</UniverseShell>;
}
