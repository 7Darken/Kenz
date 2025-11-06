"use client";

import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

import { fadeInUp, staggerChildren } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { IconLink } from "@/components/ui/icon-link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const contacts = [
  { label: "hello@kenz.dev", href: "mailto:hello@kenz.dev", icon: <Mail className="size-4" aria-hidden="true" /> },
  { label: "Book a call", href: "https://cal.com/kenz", icon: <Send className="size-4" aria-hidden="true" /> },
];

export function ContactSection() {
  return (
    <section id="contact" className="relative w-full pb-24">
      <motion.div
        className="flex flex-col gap-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.35 }}
        variants={staggerChildren(0.2)}
      >
        <SectionHeading
          eyebrow="Contact"
          title="Let's build the future together"
          description="Share a brief about your product vision, team, and timelines — I'll respond within 48 hours with next steps."
        />

        <motion.div variants={fadeInUp} className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <form className="flex flex-col gap-5" action="#" method="post">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input name="name" placeholder="Full name" required />
                <Input name="email" type="email" placeholder="Work email" required />
              </div>
              <Input name="company" placeholder="Company or product" />
              <Textarea name="message" placeholder="How can I help?" required />
              <Button type="submit" size="lg" className="w-fit">
                Send message
                <Send className="ml-2 size-4" aria-hidden="true" />
              </Button>
            </form>
          </Card>

          <motion.div variants={fadeInUp} className="flex flex-col gap-4">
            <Card subdued>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Availability</h3>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Booking new collaborations from <strong>January 2026</strong> onwards for startup and scaleup teams.
              </p>
            </Card>
            <Card subdued>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Preferred channels</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {contacts.map((contact) => (
                  <IconLink
                    key={contact.label}
                    href={contact.href}
                    label={contact.label}
                    icon={contact.icon}
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
