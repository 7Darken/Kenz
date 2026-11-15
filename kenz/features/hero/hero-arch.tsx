"use client";

/** L'arche de lumière derrière le portrait : son fil se dessine pendant que le portrait arrive. */
import { Arch } from "@/design-system/components/arch";
import { useHeroEntered } from "./hero-director";

export function HeroArch({ className }: { className: string }) {
  const entered = useHeroEntered();
  return (
    <Arch
      variant="lumiere"
      ratio={0.47}
      traceGap={16}
      trace={{ traced: entered }}
      className={className}
      data-hero-arch=""
      aria-hidden="true"
    />
  );
}
