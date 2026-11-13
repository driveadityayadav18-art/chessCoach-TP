'use client';

import React, { useState, useEffect } from 'react';
import { playChessPieceThud } from '../SoundToggle';
import ArrowFillButton from '../ArrowFillButton';
import TechText from '../reactbits/TechText';

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
    const lenis = (
      window as unknown as {
        __lenis?: { scrollTo: (target: Element, opts?: { offset?: number; duration?: number }) => void };
      }
    ).__lenis;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      if (lenis) {
        lenis.scrollTo(targetEl, { offset: 0, duration: 1.1 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer
      className="foot py-[var(--section-gap-s)] bg-paper text-ink relative z-20 overflow-clip"
      id="contact"
      data-theme="dark"
    >
      <div className="kiln-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-rule">
          <div className="md:col-span-5 flex flex-col justify-between pr-0 lg:pr-8">
            <div>
              <h2 className="sr-only">Aditya Yadav</h2>
              <div className="cq-footer w-full aspect-[5.4/1] min-h-[56px] max-h-[96px] sm:h-24">
                <TechText
                  text="ADITYA YADAV"
                  fontFamily='"Boska", Georgia, serif'
                  fontWeight={500}
                  fontSize={72}
                  letterSpacing={-0.025}
                  color="#f3eadf"
                  accentColor="#e2783e"
                  align="left"
                  reveal="letter"
                  dashLength={4}
                  dashGap={2}
                  specks={12}
                  clickKick
                  draggable
                  bounce={0.45}
                  guides={false}
                />
              </div>
              <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed font-sans max-w-sm">
                Elite chess mentorship built on deep structural understanding. Ten years guiding tournament competitors from club foundations to international master execution.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-sans text-muted">
                <span>Q4 cohort, 3 slots open</span>
                {istTime && (
                  <span className="font-mono tabular-nums text-ink-2">
                    New Delhi {istTime} IST
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8 font-sans text-xs text-muted">
              &copy; 2026 Aditya Yadav. Master chess mentorship.
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col justify-between pt-8 md:py-2 border-t md:border-t-0 md:border-l border-rule md:pl-8">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl text-ink font-medium tracking-[-0.02em] leading-tight">
                Master the board, eradicate plateaus
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-muted font-sans leading-relaxed max-w-sm">
                Every breakthrough begins with an objective diagnostic audit of your candidate selection, clock discipline, and endgame technique.
              </p>

              <div className="mt-6">
                <ArrowFillButton
                  size="md"
                  variant="primary"
                  onClick={onOpenBooking}
                  text="Schedule diagnostic session"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-rule">
              <span className="font-sans text-xs font-medium text-ink-2 block mb-3">
                Connect
              </span>
              <div className="flex flex-wrap gap-3 text-xs font-sans">
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 min-h-[42px] sm:min-h-0 py-2.5 sm:py-2 inline-flex items-center rounded-sm bg-paper-2 border border-rule hover:border-rule-strong text-ink-2 hover:text-ink transition-colors"
                  onMouseEnter={() => playChessPieceThud(0.4)}
                >
                  Discord
                </a>
                <a
                  href="https://lichess.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 min-h-[42px] sm:min-h-0 py-2.5 sm:py-2 inline-flex items-center rounded-sm bg-paper-2 border border-rule hover:border-rule-strong text-ink-2 hover:text-ink transition-colors"
                  onMouseEnter={() => playChessPieceThud(0.4)}
                >
                  Lichess club
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col justify-between pt-8 md:py-2 border-t md:border-t-0 md:border-l border-rule md:pl-8">
            <div>
              <span className="font-sans text-xs font-medium text-ink-2 block mb-4">
                Index
              </span>
              <ul className="space-y-3 font-sans text-sm">
                <li>
                  <a
                    href="#top"
                    onClick={(e) => handleNavClick(e, '#top')}
                    className="text-muted hover:text-ink transition-colors"
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a
                    href="#reel"
                    onClick={(e) => handleNavClick(e, '#reel')}
                    className="text-muted hover:text-ink transition-colors"
                  >
                    Match reel
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => handleNavClick(e, '#about')}
                    className="text-muted hover:text-ink transition-colors"
                  >
                    Method
                  </a>
                </li>
                <li>
                  <a
                    href="#curriculum"
                    onClick={(e) => handleNavClick(e, '#curriculum')}
                    className="text-muted hover:text-ink transition-colors"
                  >
                    Case studies
                  </a>
                </li>
                <li>
                  <a
                    href="#access"
                    onClick={(e) => handleNavClick(e, '#access')}
                    className="text-muted hover:text-ink transition-colors"
                  >
                    Pedigree
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-8 font-sans text-xs text-muted">
              Built for serious tournament competitors.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
