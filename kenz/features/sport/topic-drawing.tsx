/**
 * Les dessins au trait des sujets des Shorts (sport.html, `.short__art`) : pizza, patates, pancakes, gâteau whey.
 * Chaque trait a `pathLength=1` : il se trace à l'entrée (CSS). `.accent` : le vert ; `.filled` : un aplat du fond.
 */
import type { K15zeTopicDrawing } from "@/content/courses";
import styles from "./partage-section.module.css";

const acc = styles.accent;
const fill = styles.filled;

function Pizza() {
  return (
    <>
      <circle cx="60" cy="60" r="46" pathLength={1} />
      <circle cx="60" cy="60" r="38" pathLength={1} />
      <path d="M60 22V98M22 60H98M33.1 33.1L86.9 86.9M86.9 33.1L33.1 86.9" pathLength={1} />
      <circle className={acc} cx="82.2" cy="69.2" r="5" pathLength={1} />
      <circle className={acc} cx="50.8" cy="82.2" r="5" pathLength={1} />
      <circle className={acc} cx="37.8" cy="50.8" r="5" pathLength={1} />
      <circle className={acc} cx="69.2" cy="37.8" r="5" pathLength={1} />
    </>
  );
}

function Potatoes() {
  return (
    <>
      <ellipse cx="60" cy="80" rx="52" ry="22" pathLength={1} />
      <ellipse cx="60" cy="78" rx="40" ry="14" pathLength={1} />
      <ellipse className={fill} cx="62" cy="49" rx="9" ry="6" transform="rotate(4 62 49)" pathLength={1} />
      <ellipse className={fill} cx="53" cy="60" rx="11" ry="7" transform="rotate(10 53 60)" pathLength={1} />
      <ellipse className={fill} cx="71" cy="59" rx="10" ry="6.5" transform="rotate(-16 71 59)" pathLength={1} />
      <ellipse className={fill} cx="44" cy="71" rx="11" ry="7" transform="rotate(-14 44 71)" pathLength={1} />
      <ellipse className={fill} cx="62" cy="74" rx="12" ry="7.5" transform="rotate(8 62 74)" pathLength={1} />
      <ellipse className={fill} cx="79" cy="70" rx="10" ry="6.5" transform="rotate(20 79 70)" pathLength={1} />
      <path className={acc} d="M48 36C44 30 52 26 48 18M62 34C58 28 66 24 62 16M76 36C72 30 80 26 76 18" pathLength={1} />
    </>
  );
}

function Pancakes() {
  return (
    <>
      <ellipse cx="60" cy="96" rx="52" ry="9" pathLength={1} />
      <rect className={fill} x="20" y="80" width="80" height="12" rx="6" pathLength={1} />
      <rect className={fill} x="24" y="69" width="74" height="12" rx="6" pathLength={1} />
      <rect className={fill} x="19" y="58" width="78" height="12" rx="6" pathLength={1} />
      <rect className={fill} x="23" y="47" width="74" height="12" rx="6" pathLength={1} />
      <rect className={fill} x="52" y="37" width="16" height="10" rx="2.5" pathLength={1} />
      <path
        className={acc}
        d="M27 50C35 46 43 52 51 48C59 44 67 51 77 47C85 44 90 48 93 50M40 51V62M72 49V58M88 50V67"
        pathLength={1}
      />
    </>
  );
}

function WheyCake() {
  return (
    <>
      <path d="M12 100H108" pathLength={1} />
      <path className={fill} d="M24 56V86C24 94 40 98 60 98C80 98 96 94 96 86V56" pathLength={1} />
      <ellipse className={fill} cx="60" cy="56" rx="36" ry="11" pathLength={1} />
      <path className={acc} d="M24 72C24 80 40 84 60 84C80 84 96 80 96 72" pathLength={1} />
      <path d="M72 20H94V26C94 31.5 89.5 36 83 36C77 36 72 31.5 72 26Z" pathLength={1} />
      <path d="M72 23H54" pathLength={1} />
      <path className={acc} d="M83 40V42M78 45V47M88 45V47" pathLength={1} />
    </>
  );
}

const DRAWINGS = { pizza: Pizza, potatoes: Potatoes, pancakes: Pancakes, "whey-cake": WheyCake } as const;

export function TopicDrawing({ drawing }: { drawing: K15zeTopicDrawing }) {
  const Drawing = DRAWINGS[drawing];
  return (
    <svg className={styles.art} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <Drawing />
    </svg>
  );
}
