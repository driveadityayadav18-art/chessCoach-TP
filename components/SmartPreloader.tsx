'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SESSION_KEY = 'kiln-preloader-seen';
const MIN_CINEMATIC_MS = 1150;
const MAX_WAIT_MS = 2400;
const HOLD_AT_HUNDRED_MS = 160;
const EXIT_DURATION_S = 0.86;

export default function SmartPreloader() {
  const [dismissed, setDismissed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const barFillRef = useRef<HTMLDivElement | null>(null);
  const statusRef = useRef<HTMLSpanElement | null>(null);
  const finalizedRef = useRef(false);

  const finalizePreloader = useCallback(() => {
    if (finalizedRef.current) return;
    finalizedRef.current = true;
    document.documentElement.dataset.preloaderDone = '1';
    document.documentElement.dataset.heroReveal = '1';
    setDismissed(true);
  }, []);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen =
        document.documentElement.dataset.preloaderDone === '1' ||
        sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      alreadySeen = false;
    }

    const reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (alreadySeen || reducedMotion) {
      document.documentElement.dataset.preloaderDone = '1';
      document.documentElement.dataset.heroReveal = '1';
      document.body.classList.add('loaded');
      setDismissed(true);
      return;
    }

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    let lastNow = startTime;
    let displayPct = 0;
    let lastShownInt = -1;
    let assetsReady = Boolean((window as unknown as { __rookReady?: boolean }).__rookReady);
    let fontsReady = false;
    let finishing = false;
    let completed = false;
    let rafId = 0;
    let holdTimer: ReturnType<typeof setTimeout> | null = null;
    let exitFallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const writeProgress = (value: number) => {
      const clamped = Math.min(100, Math.max(0, value));
      if (barFillRef.current) {
        barFillRef.current.style.transform = `scale3d(${clamped / 100}, 1, 1)`;
      }
      const rounded = Math.round(clamped);
      if (rounded !== lastShownInt) {
        lastShownInt = rounded;
        if (numberRef.current) {
          numberRef.current.textContent = rounded.toString().padStart(2, '0');
        }
        if (statusRef.current) {
          statusRef.current.textContent = rounded < 100 ? 'Calibrating board' : 'Ready';
        }
        if (rootRef.current && (rounded === 100 || rounded % 25 === 0)) {
          rootRef.current.setAttribute(
            'aria-label',
            `Loading Aditya Yadav chess coaching studio, ${rounded} percent`
          );
        }
      }
    };

    const onRookReady = () => {
      assetsReady = true;
    };
    window.addEventListener('rook-scene-ready', onRookReady, { once: true });

    if (document.fonts?.ready) {
      document.fonts.ready
        .then(() => {
          fontsReady = true;
        })
        .catch(() => {
          fontsReady = true;
        });
    } else {
      fontsReady = true;
    }

    const safetyTimer = setTimeout(() => {
      assetsReady = true;
      fontsReady = true;
    }, MAX_WAIT_MS);

    const beginExit = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // Ignore storage quota / privacy mode errors
      }
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.classList.add('loaded');

      // Signal Hero & chrome stagger BEFORE curtain finishes lifting so elements overlap smoothly
      document.documentElement.dataset.heroReveal = '1';
      window.dispatchEvent(new CustomEvent('kiln-preloader-exit'));
      setIsExiting(true);

      exitFallbackTimer = setTimeout(finalizePreloader, EXIT_DURATION_S * 1000 + 240);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
      lastNow = now;
      const elapsed = now - startTime;

      const readyToComplete =
        (elapsed >= MIN_CINEMATIC_MS && assetsReady && fontsReady) ||
        elapsed >= MAX_WAIT_MS;

      if (readyToComplete && !finishing) {
        finishing = true;
      }

      // Smooth delta-time target curve with zero velocity kink
      let target = 100;
      let rate = 8.2;
      if (!finishing) {
        const warmT = Math.min(1, elapsed / (MIN_CINEMATIC_MS + 280));
        const easedWarm = 1 - Math.pow(1 - warmT, 2.4);
        target = 88 * easedWarm;
        rate = 5.6;
      }

      const alpha = 1 - Math.exp(-rate * dt);
      displayPct += (target - displayPct) * alpha;

      if (finishing && displayPct >= 99.65) {
        if (!completed) {
          completed = true;
          writeProgress(100);
          holdTimer = setTimeout(beginExit, HOLD_AT_HUNDRED_MS);
        }
        return;
      }

      writeProgress(displayPct);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(safetyTimer);
      if (holdTimer) clearTimeout(holdTimer);
      if (exitFallbackTimer) clearTimeout(exitFallbackTimer);
      window.removeEventListener('rook-scene-ready', onRookReady);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [finalizePreloader]);

  if (dismissed) return null;

  return (
    <AnimatePresence onExitComplete={finalizePreloader}>
      {!isExiting && (
        <React.Fragment key="kiln-preloader-stack">
          {/* Soft trailing atmospheric veil that dissolves behind the rising curtain */}
          <motion.div
            key="kiln-preloader-veil"
            initial={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.92, ease: [0.22, 1, 0.36, 1] }}
            className="kiln-preloader fixed inset-0 z-[9998] bg-paper pointer-events-none"
            aria-hidden="true"
          />

          {/* Main architectural curtain */}
          <motion.div
            ref={rootRef}
            key="kiln-smart-preloader"
            initial={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: EXIT_DURATION_S, ease: [0.76, 0, 0.24, 1] }}
            className="kiln-preloader fixed inset-0 z-[9999] bg-paper text-ink border-b border-rule flex flex-col justify-between px-[var(--gutter)] py-10 sm:py-12 select-none will-change-transform"
            role="status"
            aria-live="polite"
            aria-label="Loading Aditya Yadav chess coaching studio, 0 percent"
          >
            {/* Top Signature Bar */}
            <motion.div
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-between text-xs font-sans text-muted"
            >
              <span className="font-medium text-ink-2">Aditya Yadav</span>
              <span>
                FIDE <span className="font-mono tabular-nums">2400+</span> pedagogy
              </span>
            </motion.div>

            {/* Monumental Counter + Staunton Rook Crest Centerpiece */}
            <motion.div
              initial={{ opacity: 0.96 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -26 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center my-auto"
            >
              <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-well border border-rule bg-paper-2">
                <svg
                  width={26}
                  height={26}
                  viewBox="0 0 40 40"
                  aria-hidden="true"
                  className="w-6 h-6 text-ink fill-current"
                >
                  <path d="M8 36h24v-4H8z M12 32l1.5-14h13L28 32z M9 18V8h4v4h4V8h6v4h4V8h4v10z" />
                </svg>
              </div>

              <div className="flex items-baseline justify-center">
                <span
                  ref={numberRef}
                  className="kiln-figure text-[clamp(4.25rem,14vw,10.5rem)] leading-[0.9] text-ink tabular-nums"
                >
                  00
                </span>
                <span className="font-mono text-lg sm:text-2xl text-muted ml-2 font-normal">
                  %
                </span>
              </div>

              <div className="mt-8 w-full max-w-[260px] sm:max-w-[320px]">
                <div className="w-full h-[2px] bg-rule overflow-hidden rounded-pill">
                  <div
                    ref={barFillRef}
                    className="h-full w-full bg-accent origin-left will-change-transform"
                    style={{ transform: 'scale3d(0, 1, 1)' }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Bottom Anchor */}
            <motion.div
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-between text-xs font-sans text-muted"
            >
              <span>Candidate calculation studio</span>
              <span ref={statusRef}>Calibrating board</span>
            </motion.div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
