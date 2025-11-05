"use client";

import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import { useMemo } from "react";

const baseVariants = (duration: number, delay: number): Variants => ({
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  },
});

type ScrollRevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  variants?: Variants;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  once = true,
  amount = 0.45,
  variants,
  ...props
}: ScrollRevealProps) {
  const computedVariants = useMemo(
    () => variants ?? baseVariants(duration, delay),
    [variants, duration, delay],
  );

  return (
    <motion.div
      className={className}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount }}
      variants={computedVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
