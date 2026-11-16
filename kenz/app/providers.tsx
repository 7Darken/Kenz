"use client";

/** Les providers du site, dans l'ordre : langue, thème, mouvement. */
import type { ReactNode } from "react";

import { ThemeProvider } from "@/design-system/theme/theme-provider";
import { MotionProvider } from "@/design-system/motion/motion-provider";
import { LanguageProvider } from "@/i18n/language-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <MotionProvider>{children}</MotionProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
