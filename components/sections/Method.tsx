'use client';

import React from 'react';
import { motion } from 'motion/react';
import ElasticMesh from '../ElasticMesh';
import BlurText from '../reactbits/BlurText';

export default function Method() {
  return (
    <section
      className="py-[var(--section-gap-s)] bg-paper border-t border-rule"
      id="about"
      data-theme="dark"
    >
      <div className="kiln-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-[1]">
        {/* Left Flank: Spatial Stage for the 3D Sculptural Rook */}
        <div
          className="hidden lg:block lg:col-span-5 pointer-events-none min-h-[360px]"
          aria-hidden="true"
        />

        {/* Right Column: Asymmetric Pedagogy & Tactile Specimen */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <BlurText
              as="h2"
              text="Learn the ideas behind every move"
              animateBy="words"
              direction="bottom"
              delay={45}
              stepDuration={0.38}
              blur={7}
              distance={16}
              className="font-serif text-[length:var(--text-section)] font-medium tracking-[-0.025em] text-ink max-w-2xl leading-[1.06]"
            />

            <p className="mt-5 text-base sm:text-lg text-ink-2 leading-relaxed max-w-2xl font-sans">
              Strong players do not rely on memorized opening lines. They evaluate pawn structures, piece outposts, and prophylactic priorities, building board intuition that compounds across every tournament.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl pt-8 border-t border-rule"
          >
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-ink font-medium">
                Pawn ecology
              </h3>
              <p className="mt-2.5 text-sm text-muted leading-relaxed font-sans">
                Decode outposts, weak squares, and thematic pawn breaks without memorizing hundred-move theory trees.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-ink font-medium">
                Calculation trees
              </h3>
              <p className="mt-2.5 text-sm text-muted leading-relaxed font-sans">
                Filter candidate moves systematically to calculate deeply without falling into time-trouble paralysis.
              </p>
            </div>
          </motion.div>

          <motion.figure
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 w-full max-w-2xl kiln-well p-4 sm:p-6"
          >
            <div className="w-full h-44 sm:h-52 relative overflow-hidden flex items-center justify-center">
              <ElasticMesh
                text="2400"
                material="clay"
                color="#f3eadf"
                theme="dark"
                inflate={1.15}
                stiffness={0.65}
                wobble={0.45}
                stretch={0.4}
                press={0.6}
                grabRadius={80}
              />
            </div>

            <figcaption className="mt-3 pt-3 border-t border-rule flex items-center justify-between text-xs text-muted font-sans">
              <span>Tactile structural resistance, 2400 FIDE benchmark</span>
              <span className="hidden sm:inline text-ink-2">Click or drag to test</span>
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
