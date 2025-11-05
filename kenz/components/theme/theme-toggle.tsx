"use client";

import * as Switch from "@radix-ui/react-switch";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
        <Sun className={cn("size-4 transition-opacity", isDark && "opacity-40")}
             aria-hidden="true"
        />
        <Switch.Root
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          aria-label="Toggle theme"
          className="relative inline-flex h-6 w-12 items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
        >
          <Switch.Thumb
            className={cn(
              "block size-4 rounded-full bg-[var(--accent)] shadow shadow-[var(--accent-soft)] transition-transform",
              isDark ? "translate-x-5" : "translate-x-0",
            )}
          />
        </Switch.Root>
        <Moon className={cn("size-4 transition-opacity", !isDark && "opacity-40")} aria-hidden="true" />
      </div>
    </motion.div>
  );
}
