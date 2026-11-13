'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number; opacity: number; filter: string };
    visible: { y: number; opacity: number; filter: string };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
}

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.45,
  delay = 0,
  yOffset = 8,
  inView = true,
}: BlurFadeProps) {
  const shouldReduceMotion = useReducedMotion();

  const defaultVariants = {
    hidden: {
      y: shouldReduceMotion ? 0 : yOffset,
      opacity: 0,
      filter: shouldReduceMotion ? 'none' : 'blur(6px)',
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
  };

  const combinedVariants = variant || defaultVariants;

  return (
    <motion.div
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={combinedVariants}
      transition={{
        delay: 0.04 + delay,
        duration: shouldReduceMotion ? 0.1 : duration,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
