'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ArrowFillButton from '../ArrowFillButton';

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
    label: 'Kotov Calculation Trees',
    query: 'How do titled players eliminate blunders in multi-move variations?',
    insight:
      'Rigorous candidate move selection: identifying forcing checks and captures first, pruning unproductive branches before committing deep mental energy.',
    discipline: 'Calculation Depth',
  },
  {
    id: 'pawn',
    label: 'Carlsbad Pawn Ecology',
    query: 'Why do solid positions collapse in the transition to the endgame?',
    insight:
      'Pawn structures function as dynamic tension lines rather than static shields. Master minority attack timing and color-complex dominance.',
    discipline: 'Structural Clamping',
  },
  {
    id: 'time',
    label: 'Time-Trouble Heuristics',
    query: 'How can players prevent tactical panic when the clock drops under 3 minutes?',
    insight:
      'Pre-programmed decision heuristics: switching from broad search to forcing candidate moves to conserve cognitive bandwidth.',
    discipline: 'Clock Management',
  },
  {
    id: 'lucena',
    label: 'Lucena Endgame Geometry',
    query: 'What separates master-level technique from club play in endgames?',
    insight:
      'Converting microscopic advantages through bridge building, cutting off the enemy king, and prioritizing active rook placement over passive defense.',
    discipline: 'Endgame Precision',
  },
  {
    id: 'safety',
    label: 'Prophylactic Clamping',
    query: 'How do Grandmasters neutralize opponent counterplay before it begins?',
    insight:
      'Anticipating opponent candidate breaks two moves ahead and neutralizing them with surgical pawn anchors and piece redeployment.',
    discipline: 'Prophylaxis First',
  },
];

export default function Access({ onOpenBooking }: AccessProps) {
  const [selectedConcept, setSelectedConcept] = useState<TacticalConcept>(CONCEPTS[0]);

  return (
    <section className="access-section py-20 sm:py-28 bg-canvas border-t border-border-subtle" id="access" data-theme="dark">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Unified Display Face) */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2 className="reveal d1 font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-ink-primary leading-[1.08]">
            Grandmaster Pedagogy.<br />
            <span className="block text-ink-muted mt-1 font-normal">
              Verified Tournament Breakthroughs.
            </span>
          </h2>

          <p className="reveal d2 mt-4 text-base sm:text-lg text-ink-muted leading-relaxed font-sans max-w-2xl">
            Ten years of tournament mentorship, including collaborative preparation alongside Grandmasters <strong className="text-ink-primary font-semibold">Arjun Erigaisi</strong>, <strong className="text-ink-primary font-semibold">Praggnanandhaa</strong>, and <strong className="text-ink-primary font-semibold">Sam Shankland</strong>.
          </p>
        </div>

        {/* 3-Column Resend Feature Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          
          {/* Feature Card 1: Grandmaster Collaboration */}
          <div className="reveal rounded-xl bg-surface-card text-ink-primary p-6 sm:p-8 border border-border-subtle hover:border-border-strong transition-[border-color] duration-200 flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-border-subtle mb-5">
                <span className="text-xs font-mono text-accent-amber font-medium">
                  pedagogy.pedigree
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-ink-primary mt-1">
                  Master Mentorship
                </h3>
              </div>

              {/* Verified Student Milestones List */}
              <div className="divide-y divide-border-subtle">
                <div className="py-3.5 first:pt-0">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm font-semibold text-ink-primary">
                      Titled Player Mentorship
                    </span>
                    <span className="font-mono text-xs text-accent-amber px-2 py-0.5 rounded-md bg-surface-deep border border-border-subtle">
                      IM &amp; FM Norms
                    </span>
                  </div>
                  <span className="font-sans text-xs text-ink-muted mt-1 block">
                    Direct tournament preparation guiding students to international master norms.
                  </span>
                </div>

                <div className="py-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm font-semibold text-ink-primary">
                      Rating Transformations
                    </span>
                    <span className="font-mono text-xs text-accent-amber px-2 py-0.5 rounded-md bg-surface-deep border border-border-subtle tabular-nums">
                      2400+ Apex
                    </span>
                  </div>
                  <span className="font-sans text-xs text-ink-muted mt-1 block">
                    Documented breakthroughs overcoming multi-year rating plateaus.
                  </span>
                </div>

                <div className="py-3.5 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm font-semibold text-ink-primary">
                      Analytical Repertoires
                    </span>
                    <span className="font-mono text-xs text-ink-muted px-2 py-0.5 rounded-md bg-surface-deep border border-border-subtle">
                      Bespoke PGN
                    </span>
                  </div>
                  <span className="font-sans text-xs text-ink-muted mt-1 block">
                    Opening architecture based on pawn tension lines rather than memorized lines.
                  </span>
                </div>
              </div>
            </div>

            {/* Collaborators Footnote */}
            <div className="mt-8 pt-4 border-t border-border-subtle">
              <span className="font-sans text-xs text-ink-muted block">
                Collaborative prep with Arjun Erigaisi, R. Praggnanandhaa, and Sam Shankland.
              </span>
            </div>
          </div>

          {/* Feature Card 2: Structural Diagnosis */}
          <div className="reveal d1 rounded-xl bg-surface-card text-ink-primary p-6 sm:p-8 border border-border-subtle hover:border-border-strong transition-[border-color] duration-200 flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-border-subtle mb-5">
                <span className="text-xs font-mono text-accent-amber font-medium">
                  cognitive.analysis
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-ink-primary mt-1">
                  Structural Diagnosis
                </h3>
              </div>

              {/* Concept Selector Buttons */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {CONCEPTS.map((concept) => {
                  const isSelected = concept.id === selectedConcept.id;
                  return (
                    <button
                      key={concept.id}
                      type="button"
                      onClick={() => setSelectedConcept(concept)}
                      className={`px-2.5 py-1.5 rounded-md font-mono text-[11px] transition-colors cursor-pointer border focus-visible:outline-2 focus-visible:outline-ink-primary ${
                        isSelected
                          ? 'bg-surface-elevated text-ink-primary border-accent-amber font-medium'
                          : 'bg-surface-deep text-ink-muted border-border-subtle hover:text-ink-primary hover:border-border-strong'
                      }`}
                    >
                      {concept.label}
                    </button>
                  );
                })}
              </div>

              {/* Active Breakdown Details */}
              <div className="pt-4 border-t border-border-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-sans font-semibold text-ink-primary">
                    Pedagogical Inquiry
                  </span>
                  <span className="text-xs font-mono text-accent-amber">
                    {selectedConcept.discipline}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedConcept.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="font-sans text-sm font-semibold text-ink-primary leading-snug mb-2">
                      &ldquo;{selectedConcept.query}&rdquo;
                    </p>
                    <p className="font-sans text-xs sm:text-sm text-ink-muted leading-relaxed">
                      {selectedConcept.insight}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border-subtle">
              <span className="font-sans text-xs text-ink-muted block">
                Structured diagnostic audit conducted in the initial consultation session.
              </span>
            </div>
          </div>

          {/* Feature Card 3: Individual Mentorship */}
          <div className="reveal d2 rounded-xl bg-surface-card text-ink-primary p-6 sm:p-8 border border-border-subtle hover:border-border-strong transition-[border-color] duration-200 flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-border-subtle mb-5">
                <span className="text-xs font-mono text-accent-amber font-medium">
                  tournament.regimen
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-ink-primary mt-1">
                  Individual Mentorship
                </h3>
              </div>

              {/* 3 Phases List */}
              <div className="divide-y divide-border-subtle mb-6">
                <div className="py-3 first:pt-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-sans text-sm font-semibold text-ink-primary">
                      Classical Repertoire Overhaul
                    </h4>
                    <span className="font-mono text-xs text-accent-amber">
                      Phase 1
                    </span>
                  </div>
                  <p className="font-sans text-xs text-ink-muted leading-relaxed">
                    Custom PGN trees tailored to your cognitive style and sharpest pawn structures.
                  </p>
                </div>

                <div className="py-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-sans text-sm font-semibold text-ink-primary">
                      Psychological Debriefs
                    </h4>
                    <span className="font-mono text-xs text-accent-amber">
                      Phase 2
                    </span>
                  </div>
                  <p className="font-sans text-xs text-ink-muted leading-relaxed">
                    Post-round analysis to eradicate tilt, calculation fatigue, and time trouble.
                  </p>
                </div>

                <div className="py-3 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-sans text-sm font-semibold text-ink-primary">
                      Endgame Conversion
                    </h4>
                    <span className="font-mono text-xs text-accent-amber">
                      Phase 3
                    </span>
                  </div>
                  <p className="font-sans text-xs text-ink-muted leading-relaxed">
                    Converting microscopic advantages into points using Lucena and rook protocols.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Action CTA */}
            <div className="pt-4 border-t border-border-subtle">
              <ArrowFillButton
                fullWidth
                size="md"
                onClick={onOpenBooking}
                text="Apply for 1-on-1 Mentorship"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
