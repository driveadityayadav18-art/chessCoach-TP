'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playChessPieceThud } from './SoundToggle';
import ArrowFillButton from './ArrowFillButton';
import ChessboardPreview from './ChessboardPreview';

export interface CurriculumPillar {
  pillar: string;
  category: string;
  ratingTier: string;
  title: string;
  description: string;
  disciplines: string[];
}

const PILLARS: CurriculumPillar[] = [
  {
    pillar: '01',
    category: 'Pawn Ecology',
    ratingTier: '1400–1850 Elo',
    title: 'Carlsbad Structure Mastery',
    description:
      'Transitioning from reactive defense to proactive minority attack planning. Master outpost anchors, thematic pawn breaks, and prophylactic clamping in Queens Gambit structures.',
    disciplines: ['Minority attack execution', 'Outpost anchoring', 'Pawn break intuition'],
  },
  {
    pillar: '02',
    category: 'Calculation',
    ratingTier: '1600–2050 Elo',
    title: 'Candidate Move Tree Pruning',
    description:
      'Eliminating tactical blindness and time-trouble paralysis. Replace disorganized calculation with Kotov-grade candidate move selection, forcing check/capture priorities, and visualization trees.',
    disciplines: ['Candidate identification', 'Forcing variations', 'Visualization precision'],
  },
  {
    pillar: '03',
    category: 'Endgames',
    ratingTier: '1800–2200 Elo',
    title: 'Theoretical Rook Endgames',
    description:
      'Converting microscopic advantages into clean tournament wins. Deep study of Lucena and Philidor techniques, cutting off the king, active rook placement over passive defense, and pawn races.',
    disciplines: ['Lucena / Philidor mastery', 'Rook activity priority', 'Pawn race geometry'],
  },
  {
    pillar: '04',
    category: 'Prophylaxis',
    ratingTier: '2000–2350+ Elo',
    title: 'Grandmaster Prophylaxis & Prep',
    description:
      'Restricting active counterplay and building tournament psychological stamina. Techniques derived from collaborative preparation with elite Grandmasters to defuse opponent plans before they materialize.',
    disciplines: ['Counterplay neutralization', 'Color complex clamping', 'Psychological resilience'],
  },
];

interface FlexibleAccordionProps {
  onOpenBooking: () => void;
}

export default function FlexibleAccordion({ onOpenBooking }: FlexibleAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const switchTab = useCallback((index: number) => {
    setActiveIndex(index);
    playChessPieceThud(0.5);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chess-tab-change', { detail: { index } }));
    }
  }, []);

  const nextTab = useCallback(() => {
    const nextIdx = (activeIndex + 1) % PILLARS.length;
    switchTab(nextIdx);
  }, [activeIndex, switchTab]);

  const prevTab = useCallback(() => {
    const prevIdx = (activeIndex - 1 + PILLARS.length) % PILLARS.length;
    switchTab(prevIdx);
  }, [activeIndex, switchTab]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = (index + 1) % PILLARS.length;
      switchTab(nextIdx);
      const nextBtn = document.getElementById(`pillar-tab-${nextIdx}`);
      nextBtn?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = (index - 1 + PILLARS.length) % PILLARS.length;
      switchTab(prevIdx);
      const prevBtn = document.getElementById(`pillar-tab-${prevIdx}`);
      prevBtn?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      switchTab(0);
      document.getElementById('pillar-tab-0')?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      switchTab(PILLARS.length - 1);
      document.getElementById(`pillar-tab-${PILLARS.length - 1}`)?.focus();
    }
  };

  const current = PILLARS[activeIndex];

  return (
    <div className="w-full relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        
        {/* Left Content Card - Resend Surface Card (12px radius, hairline border) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-xl bg-surface-card border border-border-subtle relative z-10 hover:border-border-strong transition-[border-color] duration-200">
          
          {/* Top Tabs Header with ARIA Tablist */}
          <div className="w-full pb-3 sm:pb-4 border-b border-border-subtle">
            <div
              role="tablist"
              aria-label="Pedagogical Case Studies"
              className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-0.5"
            >
              {PILLARS.map((p, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={p.pillar}
                    id={`pillar-tab-${idx}`}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    aria-controls={`pillar-panel-${idx}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => switchTab(idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className={`font-sans text-xs sm:text-[13px] tracking-normal whitespace-nowrap px-3 py-1.5 rounded-md relative transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-ink-primary ${
                      isActive
                        ? 'text-ink-primary font-semibold bg-surface-elevated border border-border-strong'
                        : 'text-ink-muted hover:text-ink-primary hover:bg-surface-elevated/50'
                    }`}
                  >
                    <span>{p.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Middle Content Area with ARIA Tabpanel */}
          <div
            role="tabpanel"
            id={`pillar-panel-${activeIndex}`}
            aria-labelledby={`pillar-tab-${activeIndex}`}
            tabIndex={0}
            className="py-4 sm:py-6 my-auto min-h-[170px] sm:min-h-[190px] flex flex-col justify-center focus:outline-none"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {/* Rating Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-surface-deep border border-border-subtle text-accent-amber font-medium tabular-nums">
                    {current.ratingTier}
                  </span>
                  <span className="text-xs font-sans text-ink-muted">
                    {current.category}
                  </span>
                </div>

                {/* Pillar Headline */}
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-ink-primary font-semibold tracking-[-0.025em] leading-snug">
                  {current.title}
                </h3>

                {/* Pillar Description */}
                <p className="mt-3 text-sm text-ink-muted leading-relaxed font-sans">
                  {current.description}
                </p>

                {/* Core Disciplines List in Resend Monospace Pills */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {current.disciplines.map((discipline) => (
                    <span
                      key={discipline}
                      className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface-deep text-ink-primary text-xs font-mono border border-border-subtle"
                    >
                      {discipline}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Controls Row */}
          <div className="pt-4 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3">
            <ArrowFillButton size="md" onClick={onOpenBooking} text="Analyze Your Bottleneck" />

            {/* Step Counter & Nav Buttons */}
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs text-ink-muted select-none">
                Study <strong className="text-ink-primary font-semibold tabular-nums">{activeIndex + 1}</strong> of 4
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous study"
                  onClick={prevTab}
                  className="w-8 h-8 rounded-md border border-border-subtle hover:border-border-strong bg-surface-deep text-ink-primary flex items-center justify-center transition-[border-color,background-color] duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-ink-primary"
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5" aria-hidden="true">
                    <path d="M10 12L6 8L10 4" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Next study"
                  onClick={nextTab}
                  className="w-8 h-8 rounded-md border border-border-subtle hover:border-border-strong bg-surface-deep text-ink-primary flex items-center justify-center transition-[border-color,background-color] duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-ink-primary"
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5" aria-hidden="true">
                    <path d="M6 4L10 8L6 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Showcase Panel (Grandmaster Dossier Window + 3D Rook Perch Target) */}
        <div
          data-rook-perch="true"
          className="lg:col-span-7 relative min-h-[380px] sm:min-h-[440px] rounded-xl overflow-hidden flex flex-col border border-border-subtle bg-surface-card"
        >
          {/* Subtle 3D Rook Contact Shadow on obsidian card */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-6 pointer-events-none rounded-[100%] blur-[4px] -translate-y-1/2 z-20"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255, 128, 31, 0.25) 0%, transparent 75%)',
            }}
            aria-hidden="true"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex-1 flex flex-col"
            >
              <ChessboardPreview pillarId={current.pillar} />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
