"use client";

import { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { motion } from "framer-motion";

import { useLanguage } from "@/contexts/language-context";
import { LANGUAGES, LANG_META, flagUrl } from "@/i18n/config";

/* Segmented FR / EN switch — mirrors the Pro/Moi mode toggle aesthetic.

   The white pill is a single, always-mounted element animated via measured
   { x, width } with `initial={false}`. It therefore animates ONLY when the
   active language changes (i.e. on click) — never on mount or on a route
   change (no `layout`/`layoutId`, which would re-measure on every re-render
   and slide the pill in from a transient position). */

const Toggle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  padding: 3px;
`;

const Option = styled.button<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.6rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: ${(p) => (p.$active ? "#000" : "rgba(255, 255, 255, 0.45)")};
  transition: color 0.35s ease;
  white-space: nowrap;
  user-select: none;

  img {
    display: block;
    border-radius: 3px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
    opacity: ${(p) => (p.$active ? 1 : 0.6)};
    transition: opacity 0.35s ease;
  }
`;

const Indicator = styled(motion.div)`
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 0;
  border-radius: 100px;
  background: #fff;
  z-index: 0;
`;

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState<{ x: number; width: number } | null>(null);

  // Mesure la position/largeur réelle de l'option active (gère des largeurs
  // inégales) et resynchronise au resize.
  useLayoutEffect(() => {
    const measure = () => {
      const el = optionRefs.current[lang];
      if (el) setPill({ x: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [lang]);

  return (
    <Toggle role="group" aria-label="Language / Langue">
      {pill && (
        <Indicator
          initial={false}
          animate={{ x: pill.x, width: pill.width }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      {LANGUAGES.map((code) => (
        <Option
          key={code}
          ref={(el) => {
            optionRefs.current[code] = el;
          }}
          type="button"
          $active={lang === code}
          aria-pressed={lang === code}
          aria-label={LANG_META[code].aria}
          onClick={() => setLang(code)}
        >
          <Image
            src={flagUrl(code)}
            alt=""
            width={20}
            height={15}
            unoptimized
          />
          {LANG_META[code].label}
        </Option>
      ))}
    </Toggle>
  );
}
