import { ReactNode } from "react";
import styled from "styled-components";

import { fadeInUp } from "@/lib/motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <HeadingReveal variants={fadeInUp} amount={0.35} $align={align}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
    </HeadingReveal>
  );
}

const HeadingReveal = styled(ScrollReveal)<{ $align: "left" | "center" }>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  text-align: ${({ $align }) => ($align === "center" ? "center" : "left")};
  align-items: ${({ $align }) => ($align === "center" ? "center" : "flex-start")};
`;

const Eyebrow = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--muted) 95%, transparent);
`;

const Title = styled.h2`
  font-size: clamp(2rem, 5vw, 3.125rem);
  font-weight: 600;
  line-height: 1.05;
  color: var(--foreground);
`;

const Description = styled.p`
  max-width: 48rem;
  font-size: clamp(1rem, 1.2vw, 1.1rem);
  line-height: 1.65;
  color: color-mix(in srgb, var(--muted) 88%, transparent);
`;
