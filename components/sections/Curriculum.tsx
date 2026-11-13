'use client';

import React from 'react';
import { motion } from 'motion/react';
import FlexibleAccordion from '../FlexibleAccordion';
import BlurText from '../reactbits/BlurText';

interface CurriculumProps {
  onOpenBooking?: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Curriculum({ onOpenBooking = () => {} }: CurriculumProps) {
  return (
    <section
      className="curriculum bg-paper py-[var(--section-gap-s)] border-t border-rule"
      id="curriculum"
      data-theme="dark"
    >
      <div className="kiln-container relative z-[1]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="max-w-3xl mb-10 sm:mb-12"
        >
          <BlurText
            as="h2"
            text="Proven rating milestones and tactical pedagogy"
            animateBy="words"
            direction="bottom"
            delay={45}
            stepDuration={0.38}
            blur={7}
            distance={16}
            className="font-serif text-[length:var(--text-section)] font-medium tracking-[-0.025em] text-ink leading-[1.06]"
          />

          <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed font-sans max-w-xl">
            Documented plateau breakthroughs from club to master level. Inspect candidate calculation trees and test your own move selection directly on the board.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.06, ease: EASE }}
        >
          <FlexibleAccordion onOpenBooking={onOpenBooking} />
        </motion.div>
      </div>
    </section>
  );
}
