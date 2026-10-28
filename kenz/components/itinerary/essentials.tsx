"use client";

import { useMemo } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper } from "lucide-react";

import type { Itinerary } from "@/data/itineraries";
import { useLanguage } from "@/contexts/language-context";
import { localize } from "@/i18n/localize";
import { useStoredState } from "@/lib/browser-state";
import { Container, EASE, ESSENTIAL_ICONS, Eyebrow, SectionTitle, glass, tintText, tokens } from "./shared";

const READY = "#2fd6a3";

function parseIds(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function Essentials({ itinerary }: { itinerary: Itinerary }) {
  const { lang, t } = useLanguage();
  const s = t.itinerary.essentials;
  const [stored, setStored] = useStoredState(`kenz-trip-checklist:${itinerary.slug}`);
  const checked = useMemo(() => new Set(parseIds(stored)), [stored]);

  const total = itinerary.checklist.length;
  const done = itinerary.checklist.filter((item) => checked.has(item.id)).length;
  const complete = done === total;

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setStored(JSON.stringify([...next]));
  };

  return (
    <Section aria-labelledby="essentials-title">
      <Container>
        <Header>
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <SectionTitle id="essentials-title">{s.title}</SectionTitle>
        </Header>

        <Grid
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {itinerary.essentials.map((item) => {
            const Icon = ESSENTIAL_ICONS[item.icon];
            return (
              <InfoCard
                key={item.icon}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
                }}
              >
                <IconBox>
                  <Icon size={18} />
                </IconBox>
                <h3>{localize(item.title, lang)}</h3>
                <p>{localize(item.text, lang)}</p>
              </InfoCard>
            );
          })}

          <Checklist
            aria-labelledby="checklist-title"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
            }}
          >
            <ChecklistHead>
              <div>
                <h3 id="checklist-title">{s.checklist}</h3>
                <small>
                  {done}/{total}
                </small>
              </div>
              <Ring viewBox="0 0 40 40" aria-hidden>
                <circle cx="20" cy="20" r="16" />
                <motion.circle
                  cx="20"
                  cy="20"
                  r="16"
                  initial={false}
                  animate={{ pathLength: done / total, opacity: done ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </Ring>
            </ChecklistHead>

            <List>
              {itinerary.checklist.map((item) => {
                const isChecked = checked.has(item.id);
                return (
                  <li key={item.id}>
                    <CheckRow type="button" role="checkbox" aria-checked={isChecked} onClick={() => toggle(item.id)}>
                      <Box $checked={isChecked}>
                        <svg viewBox="0 0 24 24" aria-hidden>
                          <motion.path
                            d="M5 12.5l4.5 4.5L19 7.5"
                            initial={false}
                            animate={{ pathLength: isChecked ? 1 : 0 }}
                            transition={{ duration: 0.3, ease: EASE }}
                          />
                        </svg>
                      </Box>
                      <Label $checked={isChecked}>{localize(item.label, lang)}</Label>
                    </CheckRow>
                  </li>
                );
              })}
            </List>

            <AnimatePresence mode="wait" initial={false}>
              <Footer
                key={complete ? "ready" : "hint"}
                $ready={complete}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {complete && <PartyPopper size={15} />}
                {complete ? s.ready : s.checklistHint}
              </Footer>
            </AnimatePresence>
          </Checklist>
        </Grid>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */

const Section = styled.section`
  padding: clamp(2rem, 6vw, 4rem) 0;
`;

const Header = styled.div`
  margin-bottom: 1.75rem;

  h2 {
    margin-top: 0.6rem;
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, 1.15fr);
  gap: 0.9rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled(motion.article)`
  ${glass}
  padding: 1.35rem;
  border-radius: 22px;
  transition:
    border-color 0.3s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  h3 {
    margin-top: 1rem;
    font-size: 1rem;
    font-weight: 650;
    color: ${tokens.ink};
  }

  p {
    margin-top: 0.4rem;
    font-size: 0.86rem;
    line-height: 1.6;
    color: ${tokens.muted};
  }

  &:hover {
    border-color: ${tokens.borderStrong};
    transform: translateY(-3px);
  }
`;

const IconBox = styled.span`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: ${tokens.ink};
  background: linear-gradient(140deg, ${tokens.fillStrong}, ${tokens.fill});
  border: 1px solid ${tokens.border};
`;

const Checklist = styled(motion.section)`
  ${glass}
  grid-column: 4;
  grid-row: 1 / span 2;
  display: flex;
  flex-direction: column;
  padding: 1.35rem;
  border-radius: 22px;

  @media (max-width: 1100px) {
    grid-column: 1 / -1;
    grid-row: auto;
  }
`;

const ChecklistHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-family: ${(p) => p.theme.fonts.aesthetic};
    font-size: 1.5rem;
    font-weight: 400;
    font-style: italic;
    color: ${tokens.ink};
  }

  small {
    font-family: ${(p) => p.theme.fonts.mono};
    font-size: 0.75rem;
    color: ${tokens.faint};
  }
`;

const Ring = styled.svg`
  width: 44px;
  height: 44px;
  transform: rotate(-90deg);

  circle {
    fill: none;
    stroke-width: 3.5;
    stroke-linecap: round;
  }

  circle:first-child {
    stroke: ${tokens.fillStrong};
  }

  circle:last-child {
    stroke: ${READY};
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-top: 1rem;
  list-style: none;
`;

const CheckRow = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.55rem 0.5rem;
  border-radius: 12px;
  text-align: left;
  transition: background 0.2s ease;

  &:hover {
    background: ${tokens.fill};
  }

  &:focus-visible {
    outline: 2px solid ${READY};
    outline-offset: 1px;
  }
`;

const Box = styled.span<{ $checked: boolean }>`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 7px;
  color: ${(p) => (p.$checked ? "#03140e" : "transparent")};
  background: ${(p) => (p.$checked ? READY : "transparent")};
  border: 1.5px solid ${(p) => (p.$checked ? READY : tokens.faint)};
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: scale(${(p) => (p.$checked ? 1.06 : 1)});

  svg {
    width: 14px;
    height: 14px;
    fill: none;
    stroke: currentColor;
    stroke-width: 3.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

const Label = styled.span<{ $checked: boolean }>`
  font-size: 0.88rem;
  line-height: 1.4;
  color: ${(p) => (p.$checked ? tokens.faint : tokens.ink)};
  text-decoration: line-through;
  text-decoration-color: ${(p) => (p.$checked ? tokens.faint : "transparent")};
  transition:
    color 0.3s ease,
    text-decoration-color 0.3s ease;
`;

const Footer = styled(motion.p)<{ $ready: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: auto;
  padding-top: 1rem;
  font-size: 0.78rem;
  font-weight: ${(p) => (p.$ready ? 650 : 400)};
  color: ${(p) => (p.$ready ? tintText(READY) : tokens.faint)};
`;
