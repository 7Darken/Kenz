"use client";

import { motion } from "framer-motion";

import { fadeInUp } from "@/lib/motion";
import { ProjectList } from "@/components/ui/project-card";

export function ProjectsSection() {
  return (
    <section id="projects" className="relative w-full pb-24">
      <motion.div
        className="flex flex-col gap-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeInUp}>
          <ProjectList />
        </motion.div>
      </motion.div>
    </section>
  );
}
