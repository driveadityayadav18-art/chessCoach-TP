'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { playChessPieceThud } from './SoundToggle';
import ArrowFillButton from './ArrowFillButton';
import Counter from './reactbits/Counter';
import ChessboardPreview from './ChessboardPreview';
import { CURRICULUM_STUDIES } from '@/lib/chessStudies';

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
    switchTab((activeIndex + 1) % CURRICULUM_STUDIES.length);
  }, [activeIndex, switchTab]);

  const prevTab = useCallback(() => {
    switchTab((activeIndex - 1 + CURRICULUM_STUDIES.length) % CURRICULUM_STUDIES.length);
  }, [activeIndex, switchTab]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = (index + 1) % CURRICULUM_STUDIES.length;
      switchTab(nextIdx);
      document.getElementById(`pillar-tab-${nextIdx}`)?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = (index - 1 + CURRICULUM_STUDIES.length) % CURRICULUM_STUDIES.length;
      switchTab(prevIdx);
      document.getElementById(`pillar-tab-${prevIdx}`)?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      switchTab(0);
      document.getElementById('pillar-tab-0')?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      switchTab(CURRICULUM_STUDIES.length - 1);
      document.getElementById(`pillar-tab-${CURRICULUM_STUDIES.length - 1}`)?.focus();
    }
  };

  const current = CURRICULUM_STUDIES[activeIndex];
  const ratingMatch = current.ratingTier.match(/(\d+)\s+to\s+(\d+)(\+)?/);
  const minElo = ratingMatch ? Number(ratingMatch[1]) : 1400;
  const maxElo = ratingMatch ? Number(ratingMatch[2]) : 1850;
  const hasPlus = Boolean(ratingMatch?.[3]);

  return (
    <div className="w-full relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        {/* Left Editorial Study Index (Zero Box Chrome) */}
        <div className="lg:col-span-5 flex flex-col justify-between py-2">
          <div className="w-full pb-4 border-b border-rule">
            <div
              role="tablist"
              aria-label="Pedagogical case studies"
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
            >
              {CURRICULUM_STUDIES.map((study, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={study.pillar}
                    id={`pillar-tab-${idx}`}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    aria-controls={`pillar-panel-${idx}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => switchTab(idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className={`font-sans text-xs sm:text-sm whitespace-nowrap shrink-0 px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
                      isActive
                        ? 'text-ink font-medium bg-paper-2 border border-rule-strong'
                        : 'text-muted hover:text-ink border border-transparent'
                    }`}
                  >
                    {study.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            role="tabpanel"
            id={`pillar-panel-${activeIndex}`}
            aria-labelledby={`pillar-tab-${activeIndex}`}
            tabIndex={0}
            className="py-6 my-auto min-h-[200px] flex flex-col justify-center focus:outline-none"
          >
            <div className="flex items-center gap-4 text-xs text-muted mb-3">
              <span className="text-ink-2 tabular-nums inline-flex items-baseline gap-1.5 font-sans">
                <Counter
                  value={minElo}
                  format={{ useGrouping: false }}
                  duration={0.65}
                  intro={false}
                  fontSize="inherit"
                  fontWeight={500}
                  className="font-mono"
                />
                <span>to</span>
                <Counter
                  value={maxElo}
                  format={{ useGrouping: false }}
                  duration={0.75}
                  intro={false}
                  fontSize="inherit"
                  fontWeight={500}
                  suffix={hasPlus ? '+ Elo' : ' Elo'}
                  className="font-mono"
                />
              </span>
              <span className="font-sans">{current.category}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <h3 className="font-serif text-2xl sm:text-3xl text-ink font-medium tracking-[-0.02em] leading-snug">
                  {current.title}
                </h3>

                <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed font-sans">
                  {current.description}
                </p>

                <ul className="mt-6 pt-4 border-t border-rule flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-sans text-ink-2">
                  {current.disciplines.map((discipline) => (
                    <li key={discipline}>{discipline}</li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pt-4 border-t border-rule flex flex-wrap items-center justify-between gap-4">
            <ArrowFillButton
              size="md"
              variant="primary"
              onClick={onOpenBooking}
              text="Analyze your bottleneck"
            />

            <div className="flex items-center gap-3">
              <span className="font-sans text-xs text-muted select-none tabular-nums">
                Study <strong className="text-ink font-medium">{activeIndex + 1}</strong> of{' '}
                {CURRICULUM_STUDIES.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous study"
                  onClick={prevTab}
                  className="w-8 h-8 rounded-sm border border-rule hover:border-rule-strong bg-paper-2 text-ink flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next study"
                  onClick={nextTab}
                  className="w-8 h-8 rounded-sm border border-rule hover:border-rule-strong bg-paper-2 text-ink flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Showcase Panel (Single Kiln Well + 3D Rook Perch) */}
        <div
          data-rook-perch="true"
          className="lg:col-span-7 relative min-h-[430px] sm:min-h-[470px] kiln-well overflow-hidden flex flex-col"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
