"use client";

import { motion } from "framer-motion";

import { fadeInUp, staggerChildren } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";

const values = [
  {
    title: "Craft",
    description: "I obsess over micro-interactions, spatial rhythm, and accessible motion so products feel instinctive.",
  },
  {
    title: "Systems",
    description: "Scalable design systems and resilient architectures keep teams shipping fast without chaos.",
  },
  {
    title: "Outcomes",
    description: "Strategic alignment, data-informed loops, and measurable outcomes drive every build decision.",
  },
];

const badges = ["Next.js", "TypeScript", "Node & Edge runtimes", "React Native", "Cloudflare", "AWS", "PostgreSQL", "LangChain"];

export function AboutSection() {
  return (
    <section id="about" className="relative pb-24">
      <motion.div
        className="flex flex-col gap-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.35 }}
        variants={staggerChildren(0.2)}
      >
        <SectionHeading
          eyebrow="About"
          title="Engineer, product partner, systems thinker"
          description="I help founders and product teams craft future-ready experiences — from strategy to shippable software. My background spans CTO roles, realtime collaboration suites, AI platforms, and high-growth fintech."
        />

        <motion.div variants={fadeInUp} className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title} subdued className="h-full">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{value.description}</p>
            </Card>
          ))}
        </motion.div>

        <motion.div variants={fadeInUp} className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Toolkit</h3>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge) => (
              <Tag key={badge}>{badge}</Tag>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
