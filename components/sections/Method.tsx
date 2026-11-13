'use client';

import React from 'react';
import ElasticMesh from '../ElasticMesh';

export default function Method() {
  return (
    <section className="s1 py-20 sm:py-28 bg-canvas border-t border-border-subtle" id="about" data-theme="dark">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-[1]">
        {/* Left Flank: Unobstructed area for the 3D Rook */}
        <div className="hidden lg:block lg:col-span-5 pointer-events-none" aria-hidden="true" />

        {/* Clean Left-Aligned Editorial Text Column */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* High-Contrast Section Title */}
          <h2 className="reveal d1 font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-ink-primary max-w-2xl leading-[1.08]">
            Learn the Ideas Behind Every Move
          </h2>

          {/* High-Legibility Body Copy */}
          <p className="reveal d2 mt-6 text-base sm:text-lg text-ink-muted leading-relaxed max-w-2xl font-sans">
            Strong players do not rely on memorized lines. They evaluate structures, pawn imbalances, and prophylactic priorities. Every lesson is constructed to teach dynamic board calculation, ensuring your rating progresses sustainably long after each session concludes.
          </p>

          {/* Tactical Highlights Grid (Resend 12px Feature Cards) */}
          <div className="reveal d3 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl text-left">
            <div className="p-6 rounded-xl bg-surface-card border border-border-subtle hover:border-border-strong active:scale-[0.99] transition-[border-color,transform] duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-sans text-base sm:text-lg text-ink-primary font-semibold">
                  Pawn Ecology
                </h3>
                <svg className="w-5 h-5 text-accent-amber" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10 3a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
                  <path d="M7 11h6l1.5 5H5.5L7 11z" />
                  <path d="M4.5 17h11" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                Decode outposts, weak squares, and pawn breaks without memorizing hundred-move theory trees.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-surface-card border border-border-subtle hover:border-border-strong active:scale-[0.99] transition-[border-color,transform] duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-sans text-base sm:text-lg text-ink-primary font-semibold">
                  Calculation Trees
                </h3>
                <svg className="w-5 h-5 text-accent-amber" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="5" cy="5" r="2" />
                  <circle cx="15" cy="5" r="2" />
                  <circle cx="10" cy="15" r="2" />
                  <path d="M6.5 6.5L9 13.5" />
                  <path d="M13.5 6.5L11 13.5" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                Filter candidate moves systematically to calculate deeply without time-trouble paralysis.
              </p>
            </div>
          </div>

          {/* Interactive Positional Elasticity Specimen in Resend Terminal Shell */}
          <div className="reveal d3 mt-6 w-full max-w-2xl resend-window">
            <div className="resend-window-header">
              <div className="resend-dots">
                <span className="resend-dot bg-[#FF5F56]" />
                <span className="resend-dot bg-[#FFBD2E]" />
                <span className="resend-dot bg-[#27C93F]" />
                <span className="ml-2 font-mono text-xs text-ink-muted">tactile-specimen.sh</span>
              </div>
              <span className="font-sans text-xs text-accent-amber font-medium">
                2400 FIDE Benchmark
              </span>
            </div>

            <div className="p-5 sm:p-6 bg-surface-deep">
              <div className="w-full h-44 sm:h-52 relative rounded-lg bg-surface-card border border-border-subtle overflow-hidden flex items-center justify-center">
                <ElasticMesh
                  text="2400"
                  material="clay"
                  color="#FCFDFF"
                  theme="dark"
                  inflate={1.15}
                  stiffness={0.65}
                  wobble={0.45}
                  stretch={0.4}
                  press={0.6}
                  grabRadius={80}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-ink-muted font-sans">
                <span>Simulated structural resistance under pressure</span>
                <span className="hidden sm:inline font-sans">Click or drag to deform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
