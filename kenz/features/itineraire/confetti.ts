/**
 * Les confettis du déblocage, en GSAP (sans dépendance) : deux salves depuis les coins bas de l'écran, aux couleurs
 * des villes. Dans un calque fixe posé dans `host` (le dialogue : il est au premier plan). Renvoie le nettoyage.
 */
import { gsap } from "@/design-system/motion/gsap";
import styles from "./confetti.module.css";

const SALVOS = [
  { x: 0.15, angle: 60 },
  { x: 0.85, angle: 120 },
] as const;

export function burst(host: HTMLElement, colors: readonly string[], perSalvo: number): () => void {
  const layer = document.createElement("div");
  layer.className = styles.layer;
  layer.setAttribute("aria-hidden", "true");
  host.appendChild(layer);

  const { innerWidth: w, innerHeight: h } = window;
  const timeline = gsap.timeline({ onComplete: () => layer.remove() });
  SALVOS.forEach((salvo) => {
    const x0 = salvo.x * w;
    const y0 = 0.8 * h;
    for (let i = 0; i < perSalvo; i += 1) {
      const piece = document.createElement("span");
      piece.style.background = colors[i % colors.length];
      layer.appendChild(piece);
      const angle = ((salvo.angle + gsap.utils.random(-35, 35)) * Math.PI) / 180;
      const reach = gsap.utils.random(0.35, 0.75) * h;
      const duration = gsap.utils.random(1.6, 2.4);
      const up = duration * 0.4;
      timeline
        .set(piece, { x: x0, y: y0, rotation: gsap.utils.random(0, 360) }, 0)
        .to(piece, { x: x0 + Math.cos(angle) * reach * 1.3, rotation: `+=${gsap.utils.random(-540, 540)}`, duration, ease: "power2.out" }, 0)
        .to(piece, { y: y0 - Math.sin(angle) * reach, duration: up, ease: "power2.out" }, 0)
        .to(piece, { y: h + 40, duration: duration - up, ease: "power2.in" }, up)
        .to(piece, { opacity: 0, duration: 0.4 }, duration - 0.4);
    }
  });

  return () => {
    timeline.kill();
    layer.remove();
  };
}
