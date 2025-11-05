"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

import { ThemeToggle } from "@/components/theme/theme-toggle";

const navigation = [
  { href: "#home", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const HeaderRoot = styled.header<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 120;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem clamp(1.25rem, 4vw, 3rem);
  border-bottom: 1px solid
    ${({ $scrolled }) =>
      $scrolled
        ? "color-mix(in srgb, var(--border) 75%, transparent)"
        : "color-mix(in srgb, transparent 100%, transparent)"};
  background: ${({ $scrolled }) =>
    $scrolled
      ? "linear-gradient(180deg, color-mix(in srgb, var(--background) 92%, transparent) 0%, color-mix(in srgb, var(--background) 35%, transparent) 100%)"
      : "transparent"};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? "blur(18px)" : "none")};
  transition: background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  transition: transform 0.3s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
  }
`;

const BrandLogo = styled(Image)`
  height: clamp(3.8rem, 2.5vw, 2.3rem);
  width: auto;
`;

const NavBar = styled.nav`
  display: none;
  align-items: center;
  gap: 0.75rem;
  border-radius: 16px;
  background-color: transparent;
  padding: 0.55rem 1.5rem;

  @media (min-width: 640px) {
    display: inline-flex;
  }
`;

const NavLink = styled.a`
  font-size: clamp(0.75rem, 0.6vw + 0.7rem, 0.95rem);
  font-weight: 500;
  color: color-mix(in srgb, var(--muted) 70%, var(--foreground) 30%);
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  transition: color 0.25s ease, background-color 0.25s ease, transform 0.25s ease;

  &:hover,
  &:focus-visible {
    color: var(--foreground);
    background-color: color-mix(in srgb, var(--foreground) 14%, transparent);
    transform: translateY(-1px);
  }
`;

const Divider = styled.span`
  display: block;
  width: 1px;
  height: 1.25rem;
  background-color: color-mix(in srgb, var(--border) 60%, transparent);
  margin-inline: 0.25rem;
`;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <HeaderRoot $scrolled={scrolled}>
      <Brand href="#home">
        <BrandLogo src="/images/KzLogo.png" alt="Kenz" width={120} height={48} priority />
      </Brand>
      <NavBar>
        {navigation.map((item) => (
          <NavLink key={item.href} href={item.href}>
            {item.label}
          </NavLink>
        ))}
        <Divider />
        <ThemeToggle />
      </NavBar>
    </HeaderRoot>
  );
}
