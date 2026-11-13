'use client';

import React from 'react';
import { motion } from 'motion/react';
import MatchReelPlayer from '../MatchReelPlayer';
import BlurText from '../reactbits/BlurText';

export default function MatchReelSection() {
  return (
    <section
      className="py-[var(--section-gap-s)] bg-paper border-t border-rule relative overflow-clip"
      id="reel"
      data-theme="dark"
    >
      <div className="kiln-container relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12"
        >
          <div className="max-w-2xl">
            <BlurText
              as="h2"
              text="Calculated motion and variation flow"
              animateBy="words"
              direction="bottom"
              delay={45}
              stepDuration={0.38}
              blur={7}
              distance={16}
              className="font-serif text-[length:var(--text-section)] font-medium tracking-[-0.025em] text-ink leading-[1.06]"
            />
          </div>

          <p className="text-sm sm:text-base text-muted leading-relaxed font-sans max-w-md">
            Scrub through annotated tournament games to inspect how candidate pruning, pawn breaks, and fourth-rank bridges unfold move by move.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          <MatchReelPlayer />
        </motion.div>
      </div>
    </section>
  );
}
