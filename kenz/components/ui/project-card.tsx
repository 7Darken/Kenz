"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import styled from "styled-components";
import type { ReactNode } from "react";

import { projects } from "@/data/projects";
import type { ProjectLink as ProjectSocialLink } from "@/data/projects";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getSocialIcon } from "@/lib/socials";

const projectReveal = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.14 },
  },
};

const projectSection = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.12 },
  },
};

const projectChild = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

type ProjectLink = {
  href: string;
  label: string;
  icon?: ReactNode;
};

export function ProjectList() {
  return (
    <ProjectListRoot>
      {projects.map((project, index) => {
        const [firstWord, ...restWords] = project.name.split(" ");
        const accentColor = project.glowColor ?? "#ff8a1f";

        const socialLinks: ProjectSocialLink[] = project.socials ?? [];
        const brandedSocials = socialLinks.filter(
          (link): link is ProjectSocialLink & { icon: string } => Boolean(link.icon)
        );
        const standardSocials = socialLinks.filter((link) => !link.icon);

        const primaryLink: ProjectLink = {
          href: `/projets/${project.slug}`,
          label: "Voir détails",
        };

        const secondaryLinks: ProjectLink[] = [];

        if (project.repoUrl) {
          secondaryLinks.push({
            href: project.repoUrl,
            label: "GitHub",
            icon: getSocialIcon("GitHub", { size: 18 }),
          });
        }

        standardSocials.forEach((link) => {
          secondaryLinks.push({
            href: link.href,
            label: link.label,
            icon: getSocialIcon(link.label, { size: 18 }),
          });
        });

        return (
          <CardReveal
            key={project.id}
            variants={projectReveal}
            amount={0.3}
            delay={index * 0.12}
            duration={0.75}
          >
            <ProjectCard variants={projectSection} $reverse={index % 2 === 1}>
              <TextColumn variants={projectChild}>
                <Eyebrow>{project.period}</Eyebrow>
                <Title>
                  <Accent $color={accentColor}>{firstWord}</Accent>
                  {restWords.length > 0 ? ` ${restWords.join(" ")}` : ""}
                </Title>
                <Description>{project.description}</Description>

                <Actions>
                  <PrimaryAction href={primaryLink.href} $color={accentColor}>
                    <span>{primaryLink.label}</span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </PrimaryAction>

                  {(brandedSocials.length > 0 || secondaryLinks.length > 0) && (
                    <SocialActions>
                      {brandedSocials.map((link) => (
                        <BrandedSocialLink
                          key={`${link.href}-${link.label}`}
                          href={link.href}
                          label={link.label}
                          title={link.title ?? link.label}
                          icon={link.icon}
                        />
                      ))}
                      {secondaryLinks.slice(0, 2).map((link) => (
                        <SecondaryAction
                          key={`${link.href}-${link.label}`}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.icon && <ActionIcon>{link.icon}</ActionIcon>}
                          <span>{link.label}</span>
                        </SecondaryAction>
                      ))}
                    </SocialActions>
                  )}
                </Actions>
              </TextColumn>

              <VisualColumn variants={projectChild}>
                <VisualGlow $color={project.glowColor} />
                <Thumbnail>
                  <Image src={project.thumbnail} alt={`${project.name} preview`} fill sizes="(max-width: 768px) 100vw, 480px" priority={index === 0} />
                </Thumbnail>
              </VisualColumn>
            </ProjectCard>
          </CardReveal>
        );
      })}
    </ProjectListRoot>
  );
}

const ProjectListRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(15.5rem, 9vw, 7.5rem);
  margin-top: 10rem;
`;

const CardReveal = styled(ScrollReveal)`
  width: 100%;
`;

const ProjectCard = styled(motion.article)<{ $reverse: boolean }>`
  display: flex;
  flex-direction: column;
  gap: clamp(3.5rem, 9vw, 6rem);
  align-items: stretch;

  @media (min-width: 960px) {
    column-gap: clamp(6rem, 12vw, 12rem);
    flex-direction: ${({ $reverse }) => ($reverse ? "row-reverse" : "row")};
    align-items: center;
  }
`;

const TextColumn = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  max-width: 34rem;
`;

const Eyebrow = styled.span`
  font-size: 0.75rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--muted) 95%, transparent);
`;

const Title = styled.h3`
  font-size: clamp(2.2rem, 4vw, 3rem);
  font-weight: 600;
  line-height: 1.05;
  color: var(--foreground);
`;

const Accent = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
`;

const Description = styled.p`
  font-size: clamp(1rem, 1.4vw, 1.125rem);
  line-height: 1.65;
  color: color-mix(in srgb, var(--muted) 88%, transparent);
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(1rem, 2vw, 1.4rem);
`;

const SocialActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

const actionBase = `
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 1.35rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  text-decoration: none;
`;

const PrimaryAction = styled(Link)<{ $color: string }>`
  ${actionBase}
  background: transparent;
  color: var(--foreground);
  border: 1px solid ${({ $color }) => $color};
  box-shadow: 0 16px 40px ${({ $color }) => `color-mix(in srgb, ${$color} 35%, transparent)`};
  margin-bottom: 2.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 48px ${({ $color }) => `color-mix(in srgb, ${$color} 45%, transparent)`};
  }
`;

const SecondaryAction = styled(Link)`
  ${actionBase}
  padding-block: 0.75rem;
  padding-inline: 1.1rem;
  border: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
  color: color-mix(in srgb, var(--foreground) 92%, transparent);
  background: color-mix(in srgb, var(--background) 92%, transparent);

  &:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--accent) 65%, transparent);
    color: var(--accent);
  }
`;

const ActionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

type BrandedSocialLinkProps = {
  href: string;
  label: string;
  title: string;
  icon: string;
};

function BrandedSocialLink({ href, label, title, icon }: BrandedSocialLinkProps) {
  return (
    <BrandedButton href={href} target="_blank" rel="noreferrer" aria-label={`${label} · ${title}`}>
      <BrandedIcon src={icon} alt={label} width={28} height={28} />
      <BrandedCopy>
        <BrandedLabel>{label}</BrandedLabel>
        <BrandedTitle>{title}</BrandedTitle>
      </BrandedCopy>
    </BrandedButton>
  );
}

const BrandedButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1.4rem;
  border-radius: 0.95rem;
  background: linear-gradient(160deg, #121212 0%, #040404 100%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #f5f6f8;
  text-decoration: none;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(160deg, #1a1a1a 0%, #050505 100%);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.5);
  }
`;

const BrandedIcon = styled(Image)`
  width: 28px;
  height: 28px;
`;

const BrandedCopy = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
`;

const BrandedLabel = styled.span`
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
`;

const BrandedTitle = styled.span`
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.01em;
`;

const VisualColumn = styled(motion.div)`
  position: relative;
  width: clamp(11rem, 42vw, 15.5rem);
  margin-inline: auto;

  @media (min-width: 960px) {
    margin-inline: 0;
  }
`;

const VisualGlow = styled.div<{ $color?: string }>`
  position: absolute;
  inset: -8% -25% -18% -25%;
  background: ${({ $color }) =>
    `radial-gradient(circle at top, ${$color ?? "rgba(255, 138, 31, 0.25)"}, transparent 45%)`};
  filter: blur(55px);
  z-index: -1;
`;

const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: clamp(1.8rem, 4vw, 2.6rem);
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--border) 65%, transparent);
  background: linear-gradient(145deg, color-mix(in srgb, var(--background) 92%, transparent) 0%,
      color-mix(in srgb, var(--card) 70%, transparent) 100%);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(16px);

  &::before {
    content: "";
    position: absolute;
    inset: 8% 12% auto 12%;
    height: 40%;
    border-radius: inherit;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.22), transparent 60%);
    opacity: 0.75;
  }

  img {
    object-fit: cover;
    inset: 0;
  }
`;
