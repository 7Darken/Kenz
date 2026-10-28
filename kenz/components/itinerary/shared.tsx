"use client";

import styled, { css } from "styled-components";
import { motion } from "framer-motion";
import {
  BrickWall,
  Building,
  Building2,
  CreditCard,
  Flower2,
  Landmark,
  Languages,
  Mountain,
  MoonStar,
  Navigation,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Sailboat,
  ShoppingBag,
  Ship,
  Stamp,
  Sun,
  ThermometerSun,
  TrainFront,
  Trees,
  UtensilsCrossed,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import type { ActivityKind, DayIcon, EssentialIcon, PriceRange, TravelMode } from "@/data/itineraries";
import type { Dictionary } from "@/i18n/dictionaries";

/* ═══════════════════════════════════════════
   TOKENS
   ═══════════════════════════════════════════ */

export const tokens = {
  card: "rgba(255, 255, 255, 0.035)",
  cardHover: "rgba(255, 255, 255, 0.06)",
  border: "rgba(255, 255, 255, 0.08)",
  borderStrong: "rgba(255, 255, 255, 0.16)",
  text: "#f5f5f7",
  muted: "rgba(255, 255, 255, 0.6)",
  faint: "rgba(255, 255, 255, 0.38)",
  youtube: "#ff0033",
  /** Height of the fixed site navbar, for sticky elements and scroll offsets. */
  navOffset: 88,
};

export const EASE = [0.22, 1, 0.36, 1] as const;
export const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

/* ═══════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════ */

export const DAY_ICONS: Record<DayIcon, LucideIcon> = {
  arrival: PlaneLanding,
  palace: Landmark,
  wall: BrickWall,
  temple: Sun,
  plane: Plane,
  train: TrainFront,
  city: Building2,
  river: Ship,
  mountain: Mountain,
  garden: Flower2,
  skyline: Building,
  water: Sailboat,
  departure: PlaneTakeoff,
};

export const TRAVEL_ICONS: Record<TravelMode, LucideIcon> = {
  plane: Plane,
  train: TrainFront,
};

export const KIND_STYLES: Record<ActivityKind, { icon: LucideIcon; color: string }> = {
  sight: { icon: Landmark, color: "#f5c76b" },
  food: { icon: UtensilsCrossed, color: "#ff7a59" },
  nature: { icon: Trees, color: "#3ddc97" },
  night: { icon: MoonStar, color: "#a58bff" },
  transport: { icon: Navigation, color: "#7cc4ff" },
  shopping: { icon: ShoppingBag, color: "#ff7ac6" },
};

export const ESSENTIAL_ICONS: Record<EssentialIcon, LucideIcon> = {
  visa: Stamp,
  payment: CreditCard,
  internet: Wifi,
  transport: Navigation,
  season: ThermometerSun,
  language: Languages,
};

/* ═══════════════════════════════════════════
   FORMATTING
   ═══════════════════════════════════════════ */

type ItineraryStrings = Dictionary["itinerary"];

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

export const padDay = (day: number) => String(day).padStart(2, "0");

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} h` : `${hours} h ${String(rest).padStart(2, "0")}`;
}

export function formatPrice(price: PriceRange, t: ItineraryStrings) {
  if (price.min === 0 && !price.max) return t.day.free;
  const value = price.max ? `${price.min}–${price.max}` : price.min;
  return `≈ ${fill(t.yuan, { value })}`;
}

export const formatEuroRange = (range: { min: number; max: number }, t: ItineraryStrings) =>
  fill(t.euroRange, range);

/* ── Dates ── a trip start is stored as "YYYY-MM-DD" and handled in UTC
   so that no viewer timezone can shift a day. */

export function parseIsoDate(value: string | null): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86_400_000);
}

export function formatDate(date: Date, locale: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).format(date);
}

/* ═══════════════════════════════════════════
   PRIMITIVES
   ═══════════════════════════════════════════ */

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${tokens.faint};
`;

export const SectionTitle = styled(motion.h2)`
  font-family: ${(p) => p.theme.fonts.aesthetic};
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1;
  letter-spacing: -0.02em;
  color: ${tokens.text};
`;

export const glass = css`
  position: relative;
  border-radius: 28px;
  background: ${tokens.card};
  border: 1px solid ${tokens.border};
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 30px 60px -30px rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(18px);
`;

export const GlassCard = styled.div`
  ${glass}
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 2rem);
`;
