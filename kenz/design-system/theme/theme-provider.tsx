"use client";

/**
 * Fournit le mode clair / sombre à React : `useTheme()` → { theme, setTheme, toggleTheme }.
 * Rendu serveur et hydratation : « dark » ; le vrai mode (déjà posé sur <html> par le script inline,
 * donc sans éclair) est lu juste après. Les styles, eux, lisent html[data-theme] directement.
 */
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";

import { getTheme, setTheme, subscribeTheme, syncThemeColor, type Theme } from "./theme-store";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => "dark" as const);
  const pathname = usePathname();

  // Chaque univers a son fond : la barre du navigateur suit la page.
  useEffect(() => {
    syncThemeColor();
  }, [pathname, theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark") }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme doit être utilisé sous <ThemeProvider>");
  return context;
}
