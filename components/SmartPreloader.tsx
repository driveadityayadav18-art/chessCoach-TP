'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SESSION_KEY = 'kiln-preloader-seen';
const MIN_CINEMATIC_MS = 1050;
const MAX_WAIT_MS = 2300;
const HOLD_AT_HUNDRED_MS = 180;
const EXIT_DURATION_MS = 780;

function slowWarpCurve(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - clamped, 3.2);
}

export default function SmartPreloader() {
  const [dismissed, setDismissed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [percent, setPercent] = useState(0);

  const barFillRef = useRef<HTMLDivElement | null>(null);
  const pctRef = useRef(0);

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
      document.body.classList.add('loaded');
      setDismissed(true);
      return;
    }

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    let assetsReady = Boolean((window as unknown as { __rookReady?: boolean }).__rookReady);
    let fontsReady = false;
    let finishing = false;
    let finishStart = 0;
    let finishFrom = 0;
    let rafId = 0;
    let holdTimer: ReturnType<typeof setTimeout> | null = null;
    let cleanupTimer: ReturnType<typeof setTimeout> | null = null;

    const writeProgress = (value: number) => {
      const clamped = Math.min(100, Math.max(0, value));
      pctRef.current = clamped;
      if (barFillRef.current) {
        barFillRef.current.style.transform = `scaleX(${clamped / 100})`;
      }
      const rounded = Math.round(clamped);
      setPercent((prev) => (prev !== rounded ? rounded : prev));
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

    const tick = (now: number) => {
      const elapsed = now - startTime;

      if (!finishing) {
        const warmT = Math.min(1, elapsed / (MIN_CINEMATIC_MS + 350));
        const target = slowWarpCurve(warmT) * 86;
        const nextVal = pctRef.current + (target - pctRef.current) * 0.16;
        writeProgress(nextVal);

        const readyToComplete =
          elapsed >= MIN_CINEMATIC_MS && assetsReady && fontsReady;

        if (readyToComplete || elapsed >= MAX_WAIT_MS) {
          finishing = true;
          finishStart = now;
          finishFrom = pctRef.current;
        } else {
          rafId = requestAnimationFrame(tick);
          return;
        }
      }

      const glideT = Math.min(1, (now - finishStart) / 360);
      const easedGlide = 1 - Math.pow(1 - glideT, 3);
      writeProgress(finishFrom + (100 - finishFrom) * easedGlide);

      if (glideT < 1) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      writeProgress(100);
      holdTimer = setTimeout(() => {
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
          // Ignore storage quota / privacy mode errors
        }
        document.documentElement.dataset.preloaderDone = '1';
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
        document.body.classList.add('loaded');
        setIsExiting(true);

        cleanupTimer = setTimeout(() => {
          setDismissed(true);
        }, EXIT_DURATION_MS + 60);
      }, HOLD_AT_HUNDRED_MS);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(safetyTimer);
      if (holdTimer) clearTimeout(holdTimer);
      if (cleanupTimer) clearTimeout(cleanupTimer);
      window.removeEventListener('rook-scene-ready', onRookReady);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  if (dismissed) return null;

  const formattedPercent = percent.toString().padStart(2, '0');

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="kiln-smart-preloader"
          initial={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: EXIT_DURATION_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
          className="kiln-preloader fixed inset-0 z-[9999] bg-paper text-ink flex flex-col justify-between px-[var(--gutter)] py-10 sm:py-12 select-none"
          role="status"
          aria-live="polite"
          aria-label={`Loading Aditya Yadav chess coaching studio, ${percent} percent`}
        >
          {/* Top Signature Bar */}
          <div className="flex items-center justify-between text-xs font-sans text-muted">
            <span className="font-medium text-ink-2">Aditya Yadav</span>
            <span>
              FIDE <span className="font-mono tabular-nums">2400+</span> pedagogy
            </span>
          </div>

          {/* Monumental Counter + Staunton Rook Crest Centerpiece */}
          <motion.div
            initial={{ opacity: 0.92 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
              <span className="kiln-figure text-[clamp(4.25rem,14vw,10.5rem)] leading-[0.9] text-ink tabular-nums">
                {formattedPercent}
              </span>
              <span className="font-mono text-lg sm:text-2xl text-muted ml-2 font-normal">
                %
              </span>
            </div>

            <div className="mt-8 w-full max-w-[260px] sm:max-w-[320px]">
              <div className="w-full h-[2px] bg-rule overflow-hidden rounded-pill">
                <div
                  ref={barFillRef}
                  className="h-full w-full bg-accent origin-left"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Bottom Anchor */}
          <div className="flex items-center justify-between text-xs font-sans text-muted">
            <span>Candidate calculation studio</span>
            <span>{percent < 100 ? 'Calibrating board' : 'Ready'}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
