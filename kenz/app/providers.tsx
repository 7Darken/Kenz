"use client";

/**
 * Les providers communs à tout le site : thème, puis mouvement. La langue a un provider par univers
 * (monté par `UniverseShell`, avec les seuls textes de l'univers).
 */
import type { ReactNode } from "react";

import { ThemeProvider } from "@/design-system/theme/theme-provider";
import { MotionProvider } from "@/design-system/motion/motion-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionProvider>{children}</MotionProvider>
    </ThemeProvider>
  );
}
