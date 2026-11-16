/**
 * Le fondu du hero Créateur, piloté de l'extérieur (createur.html, `opacitesVu`). Sur l'écran statique « vu une fois »
 * de la Terre, les deux compositions (« hero » et « voyage ») sont reliées par un fondu court : le paysage et la scène
 * du portrait le suivent, comme le globe, au lieu de s'effacer au défilement.
 * - `value` entre 0 et 1 : leur opacité, qui prime sur le départ au défilement de HeroDirector ;
 * - `null` : le défilement reprend la main.
 */
export function setHeroFade(hero: HTMLElement, value: number | null) {
  if (value === null) {
    hero.removeAttribute("data-fade");
    hero.style.removeProperty("--hero-fade");
    return;
  }
  hero.setAttribute("data-fade", "");
  hero.style.setProperty("--hero-fade", Math.min(1, Math.max(0, value)).toFixed(3));
}
