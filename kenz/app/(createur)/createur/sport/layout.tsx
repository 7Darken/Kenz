/** Univers k15ze (`/createur/sport`) : son identité (fond #0D0F0E, vert), sa nav et son pied de page. */
import type { ReactNode } from "react";

import { UniverseShell } from "../../../_components/universe-shell";

export default function SportLayout({ children }: { children: ReactNode }) {
  return <UniverseShell universe="k15ze">{children}</UniverseShell>;
}
