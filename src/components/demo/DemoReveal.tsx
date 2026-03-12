"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type DemoRevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  distance?: number;
};

export default function DemoReveal({
  children,
  className,
  delay = 0,
  distance = 26,
  ...rest
}: DemoRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: distance }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={prefersReducedMotion ? undefined : { once: true, margin: "-72px" }}
      transition={
        prefersReducedMotion
          ? undefined
          : { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }
      }
      {...rest}
    >
      {children}
    </motion.div>
  );
}
