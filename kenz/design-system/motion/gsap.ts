/**
 * GSAP et ScrollTrigger, enregistrés une seule fois pour tout le site.
 * Toujours importer GSAP d'ici : `import { gsap, ScrollTrigger } from "@/design-system/motion/gsap";`
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
