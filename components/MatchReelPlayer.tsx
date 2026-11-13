'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playChessPieceThud } from './SoundToggle';
import { REEL_CHAPTERS } from '@/lib/chessStudies';
import { drawCanvasChessPiece } from '@/lib/chessPieces';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const HEAT_VARS = [
  'var(--heat-1)',
  'var(--heat-2)',
  'var(--heat-3)',
  'var(--heat-4)',
  'var(--heat-5)',
  'var(--heat-6)',
];

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
}

export default function MatchReelPlayer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);

  const [chapterIdx, setChapterIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<0.5 | 1 | 1.5>(1);
  const [activeKeyframeIdx, setActiveKeyframeIdx] = useState(0);

  const progressRef = useRef(0);
  const lastUiPercentRef = useRef(-1);
  const isDraggingRef = useRef(false);
  const isPlayingRef = useRef(false);
  const isHoverPausedRef = useRef(false);
  const userPausedRef = useRef(false);
  const rateRef = useRef(1);
  const chapterRef = useRef(REEL_CHAPTERS[0]);
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});
  const lastKeyframeBeepRef = useRef(-1);

  isPlayingRef.current = isPlaying;
  isHoverPausedRef.current = isHoverPaused;
  rateRef.current = playbackRate;
  chapterRef.current = REEL_CHAPTERS[chapterIdx];

  useEffect(() => {
    REEL_CHAPTERS.forEach((ch) => {
      if (!imagesRef.current[ch.backdrop]) {
        const img = new window.Image();
        img.src = ch.backdrop;
        imagesRef.current[ch.backdrop] = img;
      }
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && !userPausedRef.current) {
          setIsPlaying(entry.isIntersecting);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const syncProgress = useCallback((ratio: number) => {
    const clamped = Math.min(1, Math.max(0, ratio));
    progressRef.current = clamped;
    lastUiPercentRef.current = Math.round(clamped * chapterRef.current.durationSec);
    if (progressFillRef.current) {
      progressFillRef.current.style.transform = `scaleX(${clamped})`;
    }
    setProgress(clamped);
  }, []);

  const selectChapter = useCallback(
    (idx: number) => {
      const safeIdx = (idx + REEL_CHAPTERS.length) % REEL_CHAPTERS.length;
      chapterRef.current = REEL_CHAPTERS[safeIdx];
      setChapterIdx(safeIdx);
      syncProgress(0);
      lastUiPercentRef.current = -1;
      setActiveKeyframeIdx(0);
      lastKeyframeBeepRef.current = -1;
      playChessPieceThud(0.5);
    },
    [syncProgress]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      userPausedRef.current = !next;
      return next;
    });
    playChessPieceThud(0.5);
  }, []);

  const handleRestart = () => {
    syncProgress(0);
    lastUiPercentRef.current = -1;
    setActiveKeyframeIdx(0);
    lastKeyframeBeepRef.current = -1;
    userPausedRef.current = false;
    setIsPlaying(true);
    playChessPieceThud(0.5);
  };

  const handleScrub = (clientX: number) => {
    const bar = progressBarRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    if (rect.width <= 0) return;
    syncProgress((clientX - rect.left) / rect.width);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let lastTime = performance.now();

    const drawArrow = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      alpha: number,
      dashed = false
    ) => {
      if (alpha <= 0.01) return;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.hypot(dx, dy);
      if (dist < 4) return;
      const angle = Math.atan2(dy, dx);
      const headLen = dashed ? 7 : 10;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = dashed ? 'rgba(243, 234, 223, 0.5)' : '#e2783e';
      ctx.fillStyle = dashed ? 'rgba(243, 234, 223, 0.5)' : '#e2783e';
      ctx.lineWidth = dashed ? 1.5 : 2.8;
      ctx.lineCap = 'round';
      if (dashed) ctx.setLineDash([4, 5]);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2 - Math.cos(angle) * (headLen * 0.6), y2 - Math.sin(angle) * (headLen * 0.6));
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const renderFrame = (now: number) => {
      rafId = requestAnimationFrame(renderFrame);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const ch = chapterRef.current;

      if (isPlayingRef.current && !isHoverPausedRef.current) {
        progressRef.current += (dt * rateRef.current) / ch.durationSec;
        if (progressRef.current >= 1) {
          progressRef.current = 0;
          lastKeyframeBeepRef.current = -1;
          lastUiPercentRef.current = -1;
          setProgress(0);
          setChapterIdx((prev) => (prev + 1) % REEL_CHAPTERS.length);
        }
        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${progressRef.current})`;
        }
        const elapsedRounded = Math.round(progressRef.current * ch.durationSec);
        if (elapsedRounded !== lastUiPercentRef.current) {
          lastUiPercentRef.current = elapsedRounded;
          setProgress(progressRef.current);
        }
      }

      const p = progressRef.current;

      let kfIdx = 0;
      for (let i = 0; i < ch.keyframes.length; i++) {
        if (p >= ch.keyframes[i].t) kfIdx = i;
      }
      setActiveKeyframeIdx((prev) => (prev !== kfIdx ? kfIdx : prev));

      if (
        isPlayingRef.current &&
        !isHoverPausedRef.current &&
        kfIdx !== lastKeyframeBeepRef.current &&
        p >= ch.keyframes[kfIdx].t
      ) {
        lastKeyframeBeepRef.current = kfIdx;
        playChessPieceThud(0.32);
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = canvas.clientWidth || 960;
      const displayH = canvas.clientHeight || 540;
      if (canvas.width !== Math.round(displayW * dpr) || canvas.height !== Math.round(displayH * dpr)) {
        canvas.width = Math.round(displayW * dpr);
        canvas.height = Math.round(displayH * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayW, displayH);

      // Kiln ash backdrop
      ctx.fillStyle = '#181412';
      ctx.fillRect(0, 0, displayW, displayH);

      const bgImg = imagesRef.current[ch.backdrop];
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        const zoom = 1.03 + p * 0.06;
        const panX = (p - 0.5) * -22;
        const panY = Math.sin(p * Math.PI) * -8;

        const imgAspect = bgImg.naturalWidth / bgImg.naturalHeight;
        const boxAspect = displayW / displayH;
        let drawW = displayW * zoom;
        let drawH = displayH * zoom;
        if (imgAspect > boxAspect) {
          drawH = displayH * zoom;
          drawW = drawH * imgAspect;
        } else {
          drawW = displayW * zoom;
          drawH = drawW / imgAspect;
        }

        ctx.save();
        ctx.globalAlpha = 0.48;
        ctx.drawImage(
          bgImg,
          (displayW - drawW) / 2 + panX,
          (displayH - drawH) / 2 + panY,
          drawW,
          drawH
        );
        ctx.restore();
      }

      const grad = ctx.createLinearGradient(0, 0, displayW, 0);
      grad.addColorStop(0, 'rgba(22, 18, 16, 0.94)');
      grad.addColorStop(0.46, 'rgba(22, 18, 16, 0.68)');
      grad.addColorStop(1, 'rgba(22, 18, 16, 0.88)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, displayW, displayH);

      const isCompact = displayW < 640;
      const boardSize = isCompact
        ? Math.min(displayW * 0.74, displayH * 0.76)
        : Math.min(displayH * 0.78, displayW * 0.42);
      const boardX = isCompact
        ? (displayW - boardSize) / 2
        : displayW * 0.73 - boardSize / 2;
      const boardY = (displayH - boardSize) / 2;
      const sq = boardSize / 8;

      ctx.save();
      ctx.fillStyle = 'rgba(22, 18, 16, 0.92)';
      ctx.strokeStyle = 'rgba(243, 234, 223, 0.14)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(boardX - 8, boardY - 8, boardSize + 16, boardSize + 16, 10);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      const activeKf = ch.keyframes[kfIdx];
      const nextKf = ch.keyframes[kfIdx + 1];
      const localPhase = nextKf
        ? Math.min(1, Math.max(0, (p - activeKf.t) / Math.max(0.05, nextKf.t - activeKf.t)))
        : Math.min(1, Math.max(0, (p - activeKf.t) / Math.max(0.05, 1 - activeKf.t)));

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const isLight = (r + c) % 2 === 0;
          const sx = boardX + c * sq;
          const sy = boardY + r * sq;

          ctx.fillStyle = isLight ? '#342b26' : '#1e1916';
          ctx.fillRect(sx, sy, sq, sq);

          const isHighlighted = activeKf.highlights.some(([hr, hc]) => hr === r && hc === c);
          if (isHighlighted) {
            ctx.fillStyle = 'rgba(226, 120, 62, 0.18)';
            ctx.fillRect(sx, sy, sq, sq);
            ctx.strokeStyle = 'rgba(226, 120, 62, 0.5)';
            ctx.lineWidth = 1;
            ctx.strokeRect(sx + 0.5, sy + 0.5, sq - 1, sq - 1);
          }

          if (c === 0) {
            ctx.fillStyle = 'rgba(243, 234, 223, 0.36)';
            ctx.font = '500 9px "Geist Mono", monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(RANKS[r], sx + 3, sy + 2);
          }
          if (r === 7) {
            ctx.fillStyle = 'rgba(243, 234, 223, 0.36)';
            ctx.font = '500 9px "Geist Mono", monospace';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillText(FILES[c], sx + sq - 3, sy + sq - 2);
          }
        }
      }

      if (activeKf.branches) {
        activeKf.branches.forEach((b, bIdx) => {
          const branchAlpha = easeOutCubic(Math.min(1, localPhase * 2.2 - bIdx * 0.15)) * 0.7;
          drawArrow(
            boardX + (b.from[1] + 0.5) * sq,
            boardY + (b.from[0] + 0.5) * sq,
            boardX + (b.to[1] + 0.5) * sq,
            boardY + (b.to[0] + 0.5) * sq,
            branchAlpha,
            true
          );
        });
      }

      const moveProgress = easeOutCubic(Math.min(1, localPhase * 1.9));
      const ax1 = boardX + (activeKf.from[1] + 0.5) * sq;
      const ay1 = boardY + (activeKf.from[0] + 0.5) * sq;
      const ax2 = boardX + (activeKf.to[1] + 0.5) * sq;
      const ay2 = boardY + (activeKf.to[0] + 0.5) * sq;
      drawArrow(
        ax1,
        ay1,
        ax1 + (ax2 - ax1) * moveProgress,
        ay1 + (ay2 - ay1) * moveProgress,
        0.92,
        false
      );

      const boardPieces = ch.initialPieces.map((piece) => ({ ...piece }));
      for (let i = 0; i <= kfIdx; i++) {
        const kf = ch.keyframes[i];
        const moveT = i < kfIdx ? 1 : easeOutCubic(Math.min(1, localPhase * 2.1));
        const moverIdx = boardPieces.findIndex(
          (bp) => bp.code === kf.piece && bp.row === kf.from[0] && bp.col === kf.from[1]
        );
        if (moverIdx !== -1) {
          if (moveT > 0.75) {
            const capIdx = boardPieces.findIndex(
              (bp, idx) => idx !== moverIdx && bp.row === kf.to[0] && bp.col === kf.to[1]
            );
            if (capIdx !== -1) boardPieces.splice(capIdx, 1);
          }
          const updatedIdx = boardPieces.findIndex(
            (bp) => bp.code === kf.piece && bp.row === kf.from[0] && bp.col === kf.from[1]
          );
          if (updatedIdx !== -1) {
            boardPieces[updatedIdx].row = kf.from[0] + (kf.to[0] - kf.from[0]) * moveT;
            boardPieces[updatedIdx].col = kf.from[1] + (kf.to[1] - kf.from[1]) * moveT;
          }
        }
      }

      boardPieces.forEach((bp) => {
        const px = boardX + (bp.col + 0.5) * sq;
        const py = boardY + (bp.row + 0.5) * sq;
        drawCanvasChessPiece(ctx, bp.code, px, py, sq);
      });

      if (!isCompact) {
        const leftX = Math.max(36, displayW * 0.055);
        const maxTextW = Math.max(150, boardX - leftX - 32);
        const titleSize = Math.round(Math.min(34, Math.max(21, displayW * 0.031)));

        const wrapWords = (str: string, maxW: number): string[] => {
          const words = str.split(' ');
          const lines: string[] = [];
          let current = '';
          for (const word of words) {
            const candidate = current ? `${current} ${word}` : word;
            if (ctx.measureText(candidate).width <= maxW || !current) {
              current = candidate;
            } else {
              lines.push(current);
              current = word;
            }
          }
          if (current) lines.push(current);
          return lines;
        };

        ctx.save();
        ctx.fillStyle = 'rgba(243, 234, 223, 0.74)';
        ctx.font = '500 12px "Geist Mono", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(
          `Reel ${ch.index}   ${activeKf.notation}   ${activeKf.evalLabel}`,
          leftX,
          displayH * 0.34,
          maxTextW
        );

        ctx.fillStyle = '#f3eadf';
        ctx.font = `500 ${titleSize}px "Boska", Georgia, serif`;
        const titleLines = wrapWords(ch.title, maxTextW);
        let yCursor = displayH * 0.44;
        const lineStep = titleSize * 1.1;
        titleLines.forEach((line) => {
          ctx.fillText(line, leftX, yCursor, maxTextW);
          yCursor += lineStep;
        });

        ctx.fillStyle = 'rgba(218, 203, 187, 0.72)';
        ctx.font = '400 14px "Geist", system-ui, sans-serif';
        ctx.fillText(ch.subtitle, leftX, yCursor + 6, maxTextW);
        ctx.restore();
      }

      ctx.restore();
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const currentChapter = REEL_CHAPTERS[chapterIdx];
  const currentKeyframe = currentChapter.keyframes[activeKeyframeIdx] || currentChapter.keyframes[0];
  const elapsedSec = Math.round(progress * currentChapter.durationSec);
  const formatTime = (sec: number) => `0:${sec.toString().padStart(2, '0')}`;

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => setIsHoverPaused(true)}
      onPointerLeave={() => setIsHoverPaused(false)}
      onFocus={() => setIsHoverPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsHoverPaused(false);
        }
      }}
      className="kiln-well cq-reel w-full overflow-hidden"
    >
      {/* Chapter Tabs & Clock */}
      <div className="px-4 sm:px-6 py-3 bg-paper border-b border-rule flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full"
          role="tablist"
          aria-label="Match film chapters"
        >
          {REEL_CHAPTERS.map((ch, idx) => {
            const active = idx === chapterIdx;
            return (
              <button
                key={ch.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectChapter(idx)}
                className={`px-3.5 min-h-[40px] sm:min-h-0 py-2 rounded-sm text-xs font-sans whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-paper-3 text-ink font-medium border border-rule-strong'
                    : 'text-muted hover:text-ink border border-transparent'
                }`}
              >
                <span className="font-mono text-ink-2 mr-2 tabular-nums">{ch.index}</span>
                {ch.title}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Thermal Evaluation Ramp */}
          <div
            className="hidden sm:flex items-center gap-1"
            aria-label={`Positional advantage ${currentKeyframe.evalLabel}`}
            title={`Positional advantage ${currentKeyframe.evalLabel}`}
          >
            {HEAT_VARS.map((bg, i) => (
              <span
                key={bg}
                className="w-2.5 h-2 rounded-[2px] transition-opacity duration-200"
                style={{
                  backgroundColor: bg,
                  opacity: i < currentKeyframe.heatStep ? 1 : 0.2,
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-muted tabular-nums">
            <span>{formatTime(elapsedSec)}</span>
            <span aria-hidden="true">/</span>
            <span>{formatTime(currentChapter.durationSec)}</span>
          </div>
        </div>
      </div>

      {/* Cinema Canvas Stage */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-paper overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={togglePlay}
          className="w-full h-full block cursor-pointer"
          aria-label={`Interactive match reel: ${currentChapter.title}`}
        />

        <AnimatePresence>
          {!isPlaying && (
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={togglePlay}
              aria-label="Play match reel"
              className="absolute inset-0 m-auto w-14 h-14 rounded-pill bg-accent text-accent-ink flex items-center justify-center hover:bg-accent-hover transition-colors cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Timeline Scrubber & Annotation Bar */}
      <div className="bg-paper border-t border-rule px-4 sm:px-6 py-4 space-y-3.5">
        <div className="flex items-baseline justify-between gap-2 sm:hidden">
          <span className="font-serif text-lg text-ink font-medium leading-tight truncate">
            {currentChapter.title}
          </span>
          <span className="font-mono text-xs text-muted shrink-0">{currentKeyframe.evalLabel}</span>
        </div>

        <div
          ref={progressBarRef}
          role="slider"
          tabIndex={0}
          aria-label="Match reel timeline"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          onPointerDown={(e) => {
            isDraggingRef.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            handleScrub(e.clientX);
          }}
          onPointerMove={(e) => {
            if (isDraggingRef.current) {
              handleScrub(e.clientX);
            }
          }}
          onPointerUp={(e) => {
            if (isDraggingRef.current) {
              isDraggingRef.current = false;
              if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId);
              }
            }
          }}
          onPointerCancel={() => {
            isDraggingRef.current = false;
          }}
          onClick={(e) => handleScrub(e.clientX)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              syncProgress(progressRef.current + 0.08);
            } else if (e.key === 'ArrowLeft') {
              syncProgress(progressRef.current - 0.08);
            } else if (e.key === ' ') {
              e.preventDefault();
              togglePlay();
            }
          }}
          className="relative h-9 sm:h-7 flex items-center cursor-pointer touch-none"
        >
          <div className="w-full h-1.5 rounded-pill bg-paper-3 overflow-hidden relative">
            <div
              ref={progressFillRef}
              className="h-full w-full bg-accent origin-left"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>

          {currentChapter.keyframes.map((kf, kIdx) => (
            <button
              key={kf.notation}
              type="button"
              title={`${kf.notation}: ${kf.caption}`}
              aria-label={`Jump to ${kf.notation}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                syncProgress(kf.t);
                playChessPieceThud(0.45);
              }}
              style={{ left: `${kf.t * 100}%` }}
              className={`absolute -translate-x-1/2 w-3.5 h-3.5 sm:w-3 sm:h-3 rounded-pill border transition-transform cursor-pointer ${
                kIdx <= activeKeyframeIdx
                  ? 'bg-accent border-paper scale-110'
                  : 'bg-paper-3 border-rule-strong hover:scale-125'
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => selectChapter(chapterIdx - 1)}
              aria-label="Previous chapter"
              className="w-11 h-11 sm:w-9 sm:h-9 rounded-sm border border-rule hover:border-rule-strong bg-paper-2 text-ink flex items-center justify-center transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause match reel' : 'Play match reel'}
              className="h-11 sm:h-9 px-4 rounded-pill bg-ink text-paper font-sans text-xs font-medium flex items-center gap-2 hover:bg-ink-2 transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => selectChapter(chapterIdx + 1)}
              aria-label="Next chapter"
              className="w-11 h-11 sm:w-9 sm:h-9 rounded-sm border border-rule hover:border-rule-strong bg-paper-2 text-ink flex items-center justify-center transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={handleRestart}
              aria-label="Restart chapter"
              className="w-11 h-11 sm:w-9 sm:h-9 rounded-sm border border-rule hover:border-rule-strong bg-paper-2 text-muted hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <div className="ml-1 flex items-center rounded-sm border border-rule bg-paper-2 p-0.5">
              {([0.5, 1, 1.5] as const).map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setPlaybackRate(rate)}
                  className={`px-2.5 sm:px-2 min-h-[38px] sm:min-h-0 py-1 rounded text-xs font-sans tabular-nums transition-colors cursor-pointer ${
                    playbackRate === rate
                      ? 'bg-paper-3 text-ink font-medium'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 md:text-right min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentChapter.id}-${activeKeyframeIdx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col md:items-end"
              >
                <div className="flex items-center gap-3 text-xs font-sans tabular-nums text-ink">
                  <span className="font-mono font-medium">{currentKeyframe.notation}</span>
                  <span className="text-muted">
                    Advantage <span className="font-mono">{currentKeyframe.evalLabel}</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-ink-2 font-sans mt-0.5 truncate max-w-full">
                  {currentKeyframe.caption}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
