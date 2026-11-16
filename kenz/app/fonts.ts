/**
 * Les polices du site, servies par next/font (auto-hébergées, sans requête vers Google au chargement).
 * Leurs variables (--font-*) alimentent les jetons --f-title, --f-text, --f-word, --f-num.
 */
import { Anton, Instrument_Serif, Inter } from "next/font/google";
import localFont from "next/font/local";

/** Le texte : Inter variable (graisse et taille optique). */
const inter = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-inter",
  display: "swap",
});

/** Le mot mis en valeur : Instrument Serif, droit et italique. */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

/** Les chiffres k15ze. Pas de préchargement : seulement sur les pages sport. */
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
  preload: false,
});

/** Les titres et le logo : Melodrama variable (300 à 700), extraite de maquettes/v6/assets/melodrama.css. */
const melodrama = localFont({
  src: "./fonts/Melodrama-Variable.woff2",
  weight: "300 700",
  variable: "--font-melodrama",
  display: "swap",
});

export const fontVariables = [inter.variable, instrumentSerif.variable, anton.variable, melodrama.variable].join(" ");
