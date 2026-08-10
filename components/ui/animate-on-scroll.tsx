"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  variant?: "fade" | "slide-up" | "scale";
  delay?: number;
  duration?: number;
}

const variants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
};

export function AnimateOnScroll({
  children,
  className,
  variant = "slide-up",
  delay = 0,
  duration = 0.5,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
