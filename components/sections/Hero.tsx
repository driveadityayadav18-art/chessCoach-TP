'use client';

import React from 'react';
import Image from 'next/image';
import ArrowFillButton from '../ArrowFillButton';
import Counter from '../reactbits/Counter';
import { playChessPieceThud } from '../SoundToggle';

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const handleScrollToReel = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    playChessPieceThud(0.6);
    const lenis = (
      window as unknown as {
        __lenis?: { scrollTo: (target: Element, opts?: { offset?: number; duration?: number }) => void };
      }
    ).__lenis;
    const targetEl = document.querySelector('#reel');
    if (targetEl) {
      if (lenis) {
        lenis.scrollTo(targetEl, { offset: 0, duration: 1.1 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      className="hero relative bg-paper"
      id="top"
      data-theme="dark"
    >
      <div className="kiln-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Stage */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <h1 className="font-serif text-[length:var(--text-display)] font-medium tracking-[-0.025em] text-ink leading-[1.02]">
              Grandmaster chess pedagogy
            </h1>

            <p className="mt-5 text-[length:var(--text-lead)] text-ink-2 leading-relaxed font-sans max-w-lg">
              One-on-one mentorship turning candidate calculation and pawn structure into master intuition.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ArrowFillButton
                size="lg"
                variant="primary"
                onClick={onOpenBooking}
                text="Schedule evaluation"
              />

              <a
                href="#reel"
                onClick={handleScrollToReel}
                className="kiln-btn kiln-btn--ghost"
              >
                Watch match reel
              </a>
            </div>

            <dl className="mt-12 pt-6 border-t border-rule w-full max-w-lg grid grid-cols-3 gap-5 text-xs sm:text-sm font-sans text-muted">
              <div>
                <dt className="sr-only">Rating range</dt>
                <dd className="text-sm sm:text-base font-medium text-ink tabular-nums flex items-baseline gap-1.5 flex-wrap font-sans">
                  <Counter
                    value={1400}
                    format={{ useGrouping: false }}
                    duration={0.85}
                    fontSize="inherit"
                    fontWeight={500}
                    className="font-mono"
                  />
                  <span>to</span>
                  <Counter
                    value={2400}
                    format={{ useGrouping: false }}
                    duration={0.95}
                    fontSize="inherit"
                    fontWeight={500}
                    suffix="+"
                    className="font-mono"
                  />
                </dd>
                <span className="block mt-0.5">Competitor rating</span>
              </div>
              <div>
                <dt className="sr-only">Format</dt>
                <dd className="font-mono text-sm sm:text-base font-medium text-ink">
                  1-on-1 bespoke
                </dd>
                <span className="block mt-0.5">Tournament prep</span>
              </div>
              <div>
                <dt className="sr-only">Experience</dt>
                <dd className="font-mono text-sm sm:text-base font-medium text-ink tabular-nums">
                  <Counter
                    value={10}
                    duration={0.75}
                    fontSize="inherit"
                    fontWeight={500}
                    suffix=" years"
                  />
                </dd>
                <span className="block mt-0.5">Master coaching</span>
              </div>
            </dl>
          </div>

          {/* Right Stage: Grounded Studio Plate + 3D Rook Focal Centerpiece */}
          <div className="lg:col-span-6 relative">
            <div className="kiln-photo relative aspect-[4/3] lg:aspect-[5/4] w-full bg-paper-2">
              <Image
                src="/images/hero-chess-studio.jpg"
                alt="Hand-turned wooden Staunton chess pieces under warm studio lighting"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                referrerPolicy="no-referrer"
                className="object-cover object-center opacity-75"
              />
              <div className="kiln-scrim absolute inset-0 pointer-events-none" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
