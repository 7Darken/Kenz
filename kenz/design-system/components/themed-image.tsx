/**
 * Une image qui suit le thème du site (`data-theme` sur <html>) : sa version sombre en mode sombre, la claire sinon.
 * Les deux images sont dans le HTML et le CSS n'en montre qu'une : aucun flash, ni au chargement ni au changement de
 * thème. La version cachée, en chargement différé (par défaut), n'est pas téléchargée.
 * Sans `darkSrc`, une seule image. Les attributs (className, data-*, ref) vont aux deux : pour mesurer celle qui est
 * affichée, `shownImage` ci-dessous.
 */
import Image, { type ImageProps } from "next/image";

import styles from "./themed-image.module.css";

type ThemedImageProps = ImageProps & { darkSrc?: ImageProps["src"] };

export function ThemedImage({ darkSrc, className, alt, ...props }: ThemedImageProps) {
  if (!darkSrc) return <Image className={className} alt={alt} {...props} />;
  const cls = (theme: string) => [className, theme].filter(Boolean).join(" ");
  return (
    <>
      <Image className={cls(styles.light)} alt={alt} {...props} />
      <Image className={cls(styles.dark)} alt={alt} {...props} src={darkSrc} />
    </>
  );
}

/** Parmi les éléments qui correspondent à `selector` dans `root`, celui qui est affiché (l'autre version est cachée). */
export function shownImage<T extends Element = HTMLImageElement>(root: ParentNode | null | undefined, selector = "img"): T | null {
  if (!root) return null;
  const all = Array.from(root.querySelectorAll<T & Element>(selector));
  return (all.find((el) => el.getClientRects().length > 0) ?? all[0] ?? null) as T | null;
}
