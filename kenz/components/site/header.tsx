"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  padding-top: calc(0.85rem + env(safe-area-inset-top, 0px));
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
  -webkit-backdrop-filter: ${({ $scrolled }) => ($scrolled ? "blur(18px)" : "none")};
  will-change: background, border-color, backdrop-filter;
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

const MenuButton = styled.button<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
  background: ${({ $active }) =>
    $active
      ? "color-mix(in srgb, var(--card) 60%, transparent)"
      : "color-mix(in srgb, var(--card) 40%, transparent)"};
  color: var(--foreground);
  transition: transform 0.25s ease, background-color 0.25s ease;
  box-shadow: ${({ $active }) => ($active ? "0 18px 38px rgba(15, 23, 42, 0.18)" : "0 10px 20px rgba(15, 23, 42, 0.12)")};

  &:hover,
  &:focus-visible {
    transform: translateY(-1px);
    background: color-mix(in srgb, var(--card) 55%, transparent);
  }

  @media (min-width: 640px) {
    display: none;
  }
`;

const MenuIconLine = styled.span<{ $index: number; $active: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: center;

  ${({ $index, $active }) => {
    if ($index === 0) {
      return $active
        ? "transform: translate(-50%, -50%) rotate(45deg);"
        : "transform: translate(-50%, calc(-50% - 5px));";
    }
    if ($index === 1) {
      return $active
        ? "opacity: 0; transform: translate(-50%, -50%);"
        : "opacity: 1; transform: translate(-50%, -50%);";
    }
    return $active
      ? "transform: translate(-50%, -50%) rotate(-45deg);"
      : "transform: translate(-50%, calc(-50% + 5px));";
  }}
`;

const MobileMenuContainer = styled(motion.aside)`
  position: fixed;
  inset: 0;
  z-index: 160;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: linear-gradient(160deg, color-mix(in srgb, var(--background) 96%, transparent) 0%, rgba(12, 12, 12, 0.82) 100%);
  backdrop-filter: blur(18px);
  padding: clamp(1rem, 6vw, 2.25rem) clamp(1.25rem, 7vw, 2.5rem);
  gap: clamp(1.75rem, 6vw, 2.5rem);

  @media (min-width: 640px) {
    display: none;
  }
`;

const MobileLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MobileNavLink = styled(Link)`
  font-size: 1.25rem;
  font-weight: 600;
  color: color-mix(in srgb, var(--foreground) 92%, transparent);
  padding: 0.75rem 1rem;
  border-radius: 16px;
  background: color-mix(in srgb, var(--card) 24%, transparent);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.22);
  text-decoration: none;
  transition: transform 0.25s ease, background-color 0.25s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
    background: color-mix(in srgb, var(--card) 40%, transparent);
  }
`;

const MobileMeta = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const MobileBackdrop = styled(motion.button)`
  position: fixed;
  inset: 0;
  z-index: 150;
  background: rgba(8, 8, 8, 0.45);
  backdrop-filter: blur(6px);
  border: none;
  padding: 0;
`;

const MobileModeLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: color-mix(in srgb, var(--muted) 85%, transparent);
`;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <HeaderRoot $scrolled={scrolled}>
        <Brand href="/" onClick={() => setMenuOpen(false)}>
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
        <MenuButton
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="site-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          $active={menuOpen}
        >
          {[0, 1, 2].map((index) => (
            <MenuIconLine key={index} $index={index} $active={menuOpen} />
          ))}
        </MenuButton>
      </HeaderRoot>

      <AnimatePresence>
        {menuOpen && (
          <>
            <MobileBackdrop
              aria-hidden
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <MobileMenuContainer
              id="site-mobile-menu"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <Brand href="/" onClick={() => setMenuOpen(false)}>
                <BrandLogo src="/images/KzLogo.png" alt="Kenz" width={112} height={44} priority />
              </Brand>
              <MobileLinks>
                {navigation.map((item) => (
                  <MobileNavLink key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </MobileNavLink>
                ))}
              </MobileLinks>
              <MobileMeta>
                <MobileModeLabel>Mode</MobileModeLabel>
                <ThemeToggle />
              </MobileMeta>
            </MobileMenuContainer>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
