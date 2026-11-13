'use client';

import React, { useState, useEffect } from 'react';
import { playChessPieceThud } from '../SoundToggle';
import ArrowFillButton from '../ArrowFillButton';

interface FooterProps {
  onOpenBooking: () => void;
}

export default function Footer({ onOpenBooking }: FooterProps) {
  const [istTime, setIstTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        };
        setIstTime(new Intl.DateTimeFormat('en-GB', options).format(now));
      } catch {
        setIstTime('12:00:00');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    playChessPieceThud(0.6);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: Element, opts?: { offset?: number; duration?: number }) => void } }).__lenis;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      if (lenis) {
        lenis.scrollTo(targetEl, { offset: 0, duration: 1.2 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="foot py-16 sm:py-24 bg-canvas text-ink-primary relative z-20 overflow-clip border-t border-border-subtle" id="contact" data-theme="dark">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-border-subtle relative">
          
          {/* Column 1: Brand & Pedagogy Statement */}
          <div className="md:col-span-5 flex flex-col justify-between pr-0 lg:pr-8">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink-primary font-semibold tracking-[-0.03em] leading-tight">
                Aditya Yadav
              </h2>
              <p className="mt-4 text-sm sm:text-base text-ink-muted leading-relaxed font-sans max-w-sm">
                Elite chess mentorship built on deep structural understanding. Ten years guiding tournament competitors from foundational concepts to international master execution.
              </p>

              {/* Studio Telemetry (IST Clock & Cohort Status) */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-ink-muted">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" aria-hidden="true" />
                  <span>Q4 Cohort · 3 Slots Open</span>
                </div>
                <div className="w-px h-3.5 bg-border-subtle hidden sm:block" aria-hidden="true" />
                {istTime && (
                  <div className="tabular-nums">
                    <span>New Delhi · {istTime} IST</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 font-sans text-xs text-ink-muted">
              &copy; 2026 Aditya Yadav. Master Chess Mentorship. All rights reserved.
            </div>
          </div>

          {/* Column 2: Action Center */}
          <div className="md:col-span-4 flex flex-col justify-between py-2 border-t md:border-t-0 md:border-l border-border-subtle md:pl-8">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ink-primary font-semibold tracking-[-0.03em] leading-tight">
                Master the Board.<br />
                <span className="text-ink-muted font-normal">Eradicate Plateaus.</span>
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-ink-muted font-sans leading-relaxed max-w-sm">
                Every breakthrough begins with an objective diagnostic audit of your candidate move selection, clock management, and endgame technique.
              </p>

              <div className="mt-6">
                <ArrowFillButton size="md" onClick={onOpenBooking} text="Schedule Diagnostic Session" />
              </div>
            </div>

            {/* Direct Network (Resend Ghost Pills) */}
            <div className="mt-8 pt-6 border-t border-border-subtle">
              <span className="font-mono text-xs text-accent-amber block mb-3">
                network.direct
              </span>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-md bg-surface-deep border border-border-subtle hover:border-accent-amber/50 active:scale-[0.98] text-xs font-mono text-ink-muted hover:text-ink-primary transition-[border-color,color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-amber"
                  onMouseEnter={() => playChessPieceThud(0.4)}
                >
                  Discord
                </a>
                <a
                  href="https://lichess.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-md bg-surface-deep border border-border-subtle hover:border-accent-amber/50 active:scale-[0.98] text-xs font-mono text-ink-muted hover:text-ink-primary transition-[border-color,color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-amber"
                  onMouseEnter={() => playChessPieceThud(0.4)}
                >
                  Lichess Club
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Navigation Colophon */}
          <div className="md:col-span-3 flex flex-col justify-between py-2 border-t md:border-t-0 md:border-l border-border-subtle md:pl-8">
            <div>
              <span className="font-mono text-xs text-accent-amber block mb-4">
                index.navigation
              </span>
              <ul className="space-y-3 font-sans text-sm">
                <li>
                  <a
                    href="#top"
                    onClick={(e) => handleNavClick(e, '#top')}
                    className="text-ink-muted hover:text-ink-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-amber"
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => handleNavClick(e, '#about')}
                    className="text-ink-muted hover:text-ink-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-amber"
                  >
                    The Method
                  </a>
                </li>
                <li>
                  <a
                    href="#curriculum"
                    onClick={(e) => handleNavClick(e, '#curriculum')}
                    className="text-ink-muted hover:text-ink-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-amber"
                  >
                    Case Studies
                  </a>
                </li>
                <li>
                  <a
                    href="#access"
                    onClick={(e) => handleNavClick(e, '#access')}
                    className="text-ink-muted hover:text-ink-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-amber"
                  >
                    Pedigree
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-8 font-sans text-xs text-ink-muted">
              Built for serious tournament competitors.
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
