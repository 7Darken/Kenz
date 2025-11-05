"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { FOOTER_SOCIALS, getSocialIcon, type HeroSocial } from "@/lib/socials";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      className="flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)] md:flex-row"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <p>
        © {year} Kenz.
      </p>
      <nav className="flex items-center gap-3">
        {FOOTER_SOCIALS.map(({ label, href }: HeroSocial) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="inline-flex size-9 items-center justify-center rounded-full border border-transparent text-[var(--muted)] transition hover:border-[var(--border)] hover:text-[var(--foreground)]"
          >
            <span className="flex items-center justify-center" aria-hidden="true">
              {getSocialIcon(label, { size: 16 })}
            </span>
          </Link>
        ))}
      </nav>
    </motion.footer>
  );
}
