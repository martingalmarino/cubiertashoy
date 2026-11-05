"use client";

import { motion, useReducedMotion } from "framer-motion";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
};

const ease = [0.2, 0.8, 0.2, 1] as const;

export function FadeIn({
  children,
  className,
  delay = 0,
  as = "div",
}: FadeInProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];

  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduce ? 0 : 0.4, ease, delay }}
    >
      {children}
    </Comp>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: reduce ? 0 : 0.04 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: reduce ? 0 : 0.4, ease },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
