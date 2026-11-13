'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ArrowFillButton from '../ArrowFillButton';
import BlurText from '../reactbits/BlurText';
import AnimatedList, { type AnimatedListEntry } from '../reactbits/AnimatedList';
import VariableProximity from '../reactbits/VariableProximity';
import ShinyText from '../reactbits/ShinyText';
import { playChessPieceThud } from '../SoundToggle';

interface AccessProps {
  onOpenBooking: () => void;
}

interface TacticalConcept {
  id: string;
  label: string;
  query: string;
  insight: string;
  discipline: string;
}

const CONCEPTS: TacticalConcept[] = [
  {
    id: 'calc',
    label: 'Kotov calculation',
    query: 'How do titled players eliminate blunders in multi-move variations?',
    insight:
      'Rigorous candidate move selection: inspect forcing checks and captures first, pruning unproductive branches before committing deep clock time.',
    discipline: 'Calculation depth',
  },
  {
    id: 'pawn',
    label: 'Carlsbad ecology',
    query: 'Why do solid positions collapse in the transition to the endgame?',
    insight:
      'Pawn structures function as dynamic tension lines rather than static shields. Master minority attack timing and color-complex control.',
    discipline: 'Structural clamping',
  },
  {
    id: 'time',
    label: 'Clock heuristics',
    query: 'How can players prevent tactical panic when the clock drops under 3 minutes?',
    insight:
      'Pre-programmed decision heuristics: switching from broad search to forcing candidate moves to conserve cognitive bandwidth.',
    discipline: 'Clock management',
  },
  {
    id: 'lucena',
    label: 'Lucena geometry',
    query: 'What separates master-level technique from club play in endgames?',
    insight:
      'Converting microscopic advantages through fourth-rank bridge building, cutting off the enemy king, and active rook placement.',
    discipline: 'Endgame precision',
  },
  {
    id: 'safety',
    label: 'Prophylaxis',
    query: 'How do Grandmasters neutralize opponent counterplay before it begins?',
    insight:
      'Anticipating opponent candidate breaks two moves ahead and neutralizing them with surgical pawn anchors and piece redeployment.',
    discipline: 'Prophylaxis first',
  },
];

const PEDIGREE_ENTRIES: AnimatedListEntry[] = [
  {
    id: 'norms',
    title: 'Titled player mentorship',
    meta: 'IM and FM norms',
    description:
      'Direct tournament preparation guiding ambitious competitors toward international title norms.',
  },
  {
    id: 'transformations',
    title: 'Rating transformations',
    meta: '2400+ apex',
    description:
      'Documented breakthroughs overcoming multi-year rating plateaus across classical time controls.',
  },
  {
    id: 'repertoires',
    title: 'Analytical repertoires',
    meta: 'Bespoke PGN',
    description:
      'Opening architecture grounded in pawn tension and structural clarity rather than fragile memorization.',
  },
];

export default function Access({ onOpenBooking }: AccessProps) {
  const [selectedConcept, setSelectedConcept] = useState<TacticalConcept>(CONCEPTS[0]);
  const regimenRef = useRef<HTMLOListElement>(null);

  return (
    <section
      className="access-section py-[var(--section-gap-s)] bg-paper-2 border-y border-rule"
      id="access"
      data-theme="dark"
    >
      <div className="kiln-container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-14 sm:mb-16"
        >
          <BlurText
            as="h2"
            text="Grandmaster mentorship, verified tournament results"
            animateBy="words"
            direction="bottom"
            delay={45}
            stepDuration={0.38}
            blur={7}
            distance={16}
            className="font-serif text-[length:var(--text-section)] font-medium tracking-[-0.025em] text-ink leading-[1.06]"
          />

          <p className="mt-4 text-base sm:text-lg text-ink-2 leading-relaxed font-sans max-w-2xl">
            Ten years of international coaching, including collaborative preparation alongside Grandmasters{' '}
            <strong className="text-ink font-medium">Arjun Erigaisi</strong>,{' '}
            <strong className="text-ink font-medium">R. Praggnanandhaa</strong>, and{' '}
            <strong className="text-ink font-medium">Sam Shankland</strong>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Chronicle */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-ink pb-4 border-b border-rule mb-2">
              Master mentorship record
            </h3>

            <AnimatedList
              items={PEDIGREE_ENTRIES}
              initialSelectedIndex={0}
              selectOnHover
              enableArrowNavigation
              animation="fade"
              animateOnce
              stagger={0.07}
              frame={false}
              showGradients={false}
              displayScrollbar={false}
              radius={8}
              gap={0}
              onItemSelect={() => playChessPieceThud(0.35)}
            />
          </motion.div>

          {/* Right Diagnostic Well & Regimen */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="group p-6 sm:p-8 rounded-well bg-paper border border-rule">
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-rule mb-5">
                <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-ink">
                  Structural diagnosis
                </h3>
                <ShinyText
                  text={selectedConcept.discipline}
                  className="font-mono text-xs"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {CONCEPTS.map((concept) => {
                  const isSelected = concept.id === selectedConcept.id;
                  return (
                    <button
                      key={concept.id}
                      type="button"
                      onClick={() => {
                        setSelectedConcept(concept);
                        playChessPieceThud(0.35);
                      }}
                      className={`px-3.5 py-1.5 rounded-sm font-sans text-xs transition-colors cursor-pointer border ${
                        isSelected
                          ? 'bg-accent text-accent-ink border-transparent font-medium'
                          : 'bg-paper-2 text-muted border-rule hover:text-ink hover:border-rule-strong'
                      }`}
                    >
                      {concept.label}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedConcept.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="font-sans text-sm sm:text-base font-medium text-ink leading-snug mb-2">
                    &ldquo;{selectedConcept.query}&rdquo;
                  </p>
                  <p className="font-sans text-sm text-muted leading-relaxed">
                    {selectedConcept.insight}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="pt-2">
              <h3 className="font-serif text-2xl font-medium tracking-[-0.02em] text-ink mb-5">
                Individual mentorship regimen
              </h3>

              <ol ref={regimenRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 pb-8 border-b border-rule list-none">
                <li className="group rounded-sm p-4 border border-rule sm:border-transparent hover:border-rule hover:bg-paper transition-colors">
                  <h4 className="font-serif text-lg font-medium text-ink mb-1.5">
                    <ShinyText text="1. Repertoire overhaul" tone="ink" className="font-serif" />
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
                    <VariableProximity
                      label="Custom PGN trees tailored to your cognitive style and sharpest pawn structures."
                      fromFontVariationSettings="'wght' 400"
                      toFontVariationSettings="'wght' 680"
                      containerRef={regimenRef}
                      radius={80}
                      falloff="gaussian"
                    />
                  </p>
                </li>

                <li className="group rounded-sm p-4 border border-rule sm:border-transparent hover:border-rule hover:bg-paper transition-colors">
                  <h4 className="font-serif text-lg font-medium text-ink mb-1.5">
                    <ShinyText text="2. Psychological debriefs" tone="ink" className="font-serif" />
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
                    <VariableProximity
                      label="Post-round analysis to eliminate tilt, calculation fatigue, and time trouble."
                      fromFontVariationSettings="'wght' 400"
                      toFontVariationSettings="'wght' 680"
                      containerRef={regimenRef}
                      radius={80}
                      falloff="gaussian"
                    />
                  </p>
                </li>

                <li className="group rounded-sm p-4 border border-rule sm:border-transparent hover:border-rule hover:bg-paper transition-colors">
                  <h4 className="font-serif text-lg font-medium text-ink mb-1.5">
                    <ShinyText text="3. Endgame conversion" tone="ink" className="font-serif" />
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
                    <VariableProximity
                      label="Converting microscopic advantages into tournament points using rook protocols."
                      fromFontVariationSettings="'wght' 400"
                      toFontVariationSettings="'wght' 680"
                      containerRef={regimenRef}
                      radius={80}
                      falloff="gaussian"
                    />
                  </p>
                </li>
              </ol>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="font-sans text-xs sm:text-sm text-muted max-w-sm">
                  Every training regimen begins with an objective diagnostic audit of your recent tournament games.
                </p>
                <ArrowFillButton
                  size="md"
                  variant="primary"
                  onClick={onOpenBooking}
                  text="Apply for 1-on-1 mentorship"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
