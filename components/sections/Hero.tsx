'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ArrowFillButton from '../ArrowFillButton';
import Counter from '../reactbits/Counter';
import VariableProximity from '../reactbits/VariableProximity';
import ShinyText from '../reactbits/ShinyText';
import { playChessPieceThud } from '../SoundToggle';

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const heroLeadRef = useRef<HTMLDivElement>(null);
  const [counterReady, setCounterReady] = useState(false);

  useEffect(() => {
    const isAlreadyRevealed =
      document.documentElement.dataset.heroReveal === '1' ||
      document.documentElement.dataset.preloaderDone === '1' ||
      !document.documentElement.dataset.preloaderActive;

    if (isAlreadyRevealed) {
      setCounterReady(true);
      return;
    }

    let delayTimer: ReturnType<typeof setTimeout> | null = null;
    const onPreloaderExit = () => {
      delayTimer = setTimeout(() => {
        setCounterReady(true);
      }, 280);
    };

    const safetyTimer = setTimeout(() => {
      setCounterReady(true);
    }, 3000);

    window.addEventListener('kiln-preloader-exit', onPreloaderExit, { once: true });
    return () => {
      window.removeEventListener('kiln-preloader-exit', onPreloaderExit);
      if (delayTimer) clearTimeout(delayTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

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
          <div ref={heroLeadRef} className="lg:col-span-6 flex flex-col items-start text-left">
            <h1 className="hero-stage-item hero-step-1 font-serif text-[length:var(--text-display)] font-medium tracking-[-0.025em] text-ink leading-[1.02]">
              Grandmaster chess pedagogy
            </h1>

            <p className="hero-stage-item hero-step-2 mt-5 text-[length:var(--text-lead)] text-ink-2 leading-relaxed font-sans max-w-lg cursor-default">
              <VariableProximity
                label="One-on-one mentorship turning candidate calculation and pawn structure into master intuition."
                fromFontVariationSettings="'wght' 400"
                toFontVariationSettings="'wght' 760"
                containerRef={heroLeadRef}
                radius={95}
                falloff="gaussian"
              />
            </p>

            <div className="hero-stage-item hero-step-3 mt-7 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <ArrowFillButton
                size="lg"
                variant="primary"
                onClick={onOpenBooking}
                text="Schedule evaluation"
              />

              <a
                href="#reel"
                onClick={handleScrollToReel}
                className="kiln-btn kiln-btn--ghost justify-center"
              >
                Watch match reel
              </a>
            </div>

            <dl className="hero-stage-item hero-step-4 mt-10 sm:mt-12 pt-6 border-t border-rule w-full max-w-lg grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-4 text-xs sm:text-sm font-sans text-muted">
              <div className="group">
                <dt className="sr-only">Rating range</dt>
                <dd className="text-sm sm:text-base font-medium text-ink tabular-nums flex items-baseline gap-1.5 flex-wrap font-sans">
                  <Counter
                    value={1400}
                    intro={counterReady}
                    format={{ useGrouping: false }}
                    duration={0.85}
                    fontSize="inherit"
                    fontWeight={500}
                    className="font-mono"
                  />
                  <span>to</span>
                  <Counter
                    value={2400}
                    intro={counterReady}
                    format={{ useGrouping: false }}
                    duration={0.95}
                    fontSize="inherit"
                    fontWeight={500}
                    suffix="+"
                    className="font-mono"
                  />
                </dd>
                <ShinyText text="Competitor rating" className="mt-0.5 text-xs sm:text-sm" />
              </div>
              <div className="group">
                <dt className="sr-only">Format</dt>
                <dd className="font-mono text-sm sm:text-base font-medium text-ink">
                  1-on-1 bespoke
                </dd>
                <ShinyText text="Tournament prep" className="mt-0.5 text-xs sm:text-sm" />
              </div>
              <div className="group col-span-2 sm:col-span-1">
                <dt className="sr-only">Experience</dt>
                <dd className="font-mono text-sm sm:text-base font-medium text-ink tabular-nums">
                  <Counter
                    value={10}
                    intro={counterReady}
                    duration={0.75}
                    fontSize="inherit"
                    fontWeight={500}
                    suffix=" years"
                  />
                </dd>
                <ShinyText text="Master coaching" className="mt-0.5 text-xs sm:text-sm" />
              </div>
            </dl>
          </div>

          {/* Right Stage: Grounded Studio Plate + 3D Rook Focal Centerpiece */}
          <div className="lg:col-span-6 relative">
            <div className="hero-plate-item kiln-photo relative aspect-[4/3] lg:aspect-[5/4] w-full bg-paper-2">
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
