"use client";

/** La phrase du hero : ses mots montent à l'arrivée du hero (et non à l'entrée à l'écran). */
import { Words } from "@/design-system/components/words";
import type { DictKey } from "@/i18n/dictionaries";
import { useHeroEntered } from "./hero-director";

export function HeroLine({ textKey, className }: { textKey: DictKey; className: string }) {
  const entered = useHeroEntered();
  return <Words as="p" text={{ k: textKey }} glow play={entered} className={className} />;
}
