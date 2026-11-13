'use client';

import React from 'react';
import ArrowFillButton from '../ArrowFillButton';
import { BlurFade } from '../magicui/BlurFade';

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const handleScrollToMethod = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: Element, opts?: { offset?: number; duration?: number }) => void } }).__lenis;
    const targetEl = document.querySelector('#about');
    if (targetEl) {
      if (lenis) {
        lenis.scrollTo(targetEl, { offset: 0, duration: 1.2 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      className="hero relative min-h-[92dvh] sm:min-h-dvh flex items-center bg-canvas pt-24 pb-16 sm:pt-28 sm:pb-20 overflow-clip"
      id="top"
      data-theme="dark"
    >
      {/* Resend Signature Atmospheric Warm Amber Radial Glow (#FF801F) */}
      <div className="hero-glow" aria-hidden="true" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Editorial Copy Column */}
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            
            <BlurFade delay={0.05} yOffset={10}>
              {/* Authoritative Display Serif H1 Headline (Resend / Domaine Style) */}
              <h1 className="reveal d1 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-semibold tracking-[-0.03em] text-ink-primary leading-[1.04]">
                <span>Grandmaster Pedagogy.</span>
                <span className="block text-ink-muted mt-1 sm:mt-1.5 text-3xl sm:text-4xl md:text-5xl lg:text-[3.85rem] font-normal">
                  Deep Structural Understanding.
                </span>
              </h1>
            </BlurFade>

            {/* Authentic Subhead (Hallmark Gate 58: <= 12 words per sentence) */}
            <BlurFade delay={0.12} yOffset={10}>
              <p className="reveal d2 mt-6 text-base sm:text-lg md:text-xl text-ink-muted leading-relaxed font-sans max-w-2xl">
                Tournament mentorship transforming candidate calculation and deep pawn ecology into master intuition.
              </p>
            </BlurFade>

            {/* Primary & Secondary Action Center */}
            <BlurFade delay={0.18} yOffset={10}>
              <div className="reveal d3 mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
                <ArrowFillButton
                  size="lg"
                  onClick={onOpenBooking}
                  text="Schedule Diagnostic Evaluation"
                />

                <a
                  href="#about"
                  onClick={handleScrollToMethod}
                  className="font-sans text-sm text-ink-muted hover:text-ink-primary active:text-ink-primary transition-colors py-3 px-3 underline-offset-4 hover:underline active:scale-[0.98] rounded focus-visible:outline-2 focus-visible:outline-ink-primary"
                >
                  The Method
                </a>
              </div>
            </BlurFade>

            {/* Key Program Signals (Untracked Body Font, Hairline Dividers) */}
            <BlurFade delay={0.24} yOffset={10}>
              <div className="reveal d3 mt-12 sm:mt-16 pt-8 border-t border-border-subtle w-full max-w-2xl flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm font-sans text-ink-muted">
                <div>
                  <strong className="block font-sans text-sm sm:text-base font-semibold text-ink-primary tabular-nums">
                    1400 to 2400+
                  </strong>
                  <span>Target competitor rating</span>
                </div>
                <div className="w-px h-8 bg-border-subtle hidden sm:block" aria-hidden="true" />
                <div>
                  <strong className="block font-sans text-sm sm:text-base font-semibold text-ink-primary">
                    1-on-1 Bespoke
                  </strong>
                  <span>Tournament preparation</span>
                </div>
                <div className="w-px h-8 bg-border-subtle hidden sm:block" aria-hidden="true" />
                <div>
                  <strong className="block font-sans text-sm sm:text-base font-semibold text-ink-primary tabular-nums">
                    10 Years
                  </strong>
                  <span>International coaching</span>
                </div>
              </div>
            </BlurFade>

          </div>

          {/* Right Flank: Reserved Space for the 3D Sculptural Rook in Desktop */}
          <div className="hidden lg:block lg:col-span-4 pointer-events-none" aria-hidden="true" />

        </div>
      </div>
    </section>
  );
}
