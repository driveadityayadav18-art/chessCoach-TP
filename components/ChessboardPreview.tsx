'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  AlertCircle,
} from 'lucide-react';
import { playChessPieceThud } from './SoundToggle';
import {
  CURRICULUM_STUDIES,
  applyMove,
  type BoardGrid,
} from '@/lib/chessStudies';
import { ChessPieceGlyph } from '@/lib/chessPieces';

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

interface ChessboardPreviewProps {
  pillarId: string;
}

export default function ChessboardPreview({ pillarId }: ChessboardPreviewProps) {
  const data =
    CURRICULUM_STUDIES.find((item) => item.pillar === pillarId) ||
    CURRICULUM_STUDIES[0];

  const [mode, setMode] = useState<'replay' | 'puzzle'>('replay');
  const [stepIdx, setStepIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [puzzleStatus, setPuzzleStatus] = useState<'prompt' | 'correct' | 'retry'>('prompt');
  const [puzzleBoard, setPuzzleBoard] = useState<BoardGrid>(data.puzzle.initialBoard);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setStepIdx(0);
    setIsAutoPlaying(false);
    setSelectedSquare(null);
    setPuzzleStatus('prompt');
    setPuzzleBoard(data.puzzle.initialBoard);
    setShowHint(false);
  }, [pillarId, data]);

  useEffect(() => {
    if (!isAutoPlaying || mode !== 'replay') return;
    const timer = setInterval(() => {
      setStepIdx((prev) => {
        const next = (prev + 1) % data.steps.length;
        playChessPieceThud(0.35);
        return next;
      });
    }, 2200);
    return () => clearInterval(timer);
  }, [isAutoPlaying, mode, data.steps.length]);

  const currentStep = data.steps[stepIdx] || data.steps[0];
  const activeBoard = mode === 'replay' ? currentStep.board : puzzleBoard;

  const evalHeatSteps = Math.max(
    1,
    Math.min(6, Math.ceil((currentStep.evalScore / 6) * 6))
  );

  const handleSquareClick = useCallback(
    (rIdx: number, cIdx: number) => {
      if (mode === 'replay') {
        playChessPieceThud(0.3);
        return;
      }

      if (puzzleStatus === 'correct') return;

      const piece = puzzleBoard[rIdx]?.[cIdx];

      if (!selectedSquare) {
        if (piece && piece.startsWith('w')) {
          setSelectedSquare([rIdx, cIdx]);
          setPuzzleStatus('prompt');
          playChessPieceThud(0.35);
        }
        return;
      }

      const [selR, selC] = selectedSquare;
      if (selR === rIdx && selC === cIdx) {
        setSelectedSquare(null);
        return;
      }

      if (piece && piece.startsWith('w')) {
        setSelectedSquare([rIdx, cIdx]);
        setPuzzleStatus('prompt');
        playChessPieceThud(0.35);
        return;
      }

      const [solFromR, solFromC] = data.puzzle.solutionFrom;
      const [solToR, solToC] = data.puzzle.solutionTo;

      if (selR === solFromR && selC === solFromC && rIdx === solToR && cIdx === solToC) {
        setPuzzleBoard(applyMove(puzzleBoard, [selR, selC], [rIdx, cIdx]));
        setSelectedSquare(null);
        setPuzzleStatus('correct');
        playChessPieceThud(0.95);
      } else {
        setSelectedSquare(null);
        setPuzzleStatus('retry');
        playChessPieceThud(0.25);
      }
    },
    [mode, puzzleStatus, puzzleBoard, selectedSquare, data.puzzle]
  );

  const resetPuzzle = () => {
    setSelectedSquare(null);
    setPuzzleStatus('prompt');
    setPuzzleBoard(data.puzzle.initialBoard);
    setShowHint(false);
    playChessPieceThud(0.4);
  };

  const arrowCoords =
    mode === 'replay' && stepIdx > 0
      ? currentStep
      : mode === 'replay' && stepIdx === 0
      ? currentStep
      : puzzleStatus === 'correct'
      ? { from: data.puzzle.solutionFrom, to: data.puzzle.solutionTo }
      : null;

  return (
    <div className="w-full h-full flex flex-col justify-between bg-paper-2 text-ink relative select-none">
      {/* Workbench Header */}
      <div className="px-4 sm:px-6 py-3.5 bg-paper border-b border-rule flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs text-muted">{data.eco}</span>

        <div className="flex items-center gap-1 p-0.5 rounded-sm bg-paper-2 border border-rule">
          <button
            type="button"
            onClick={() => {
              setMode('replay');
              setIsAutoPlaying(false);
              playChessPieceThud(0.35);
            }}
            className={`px-3 py-1.5 rounded text-xs font-sans font-medium transition-colors cursor-pointer ${
              mode === 'replay'
                ? 'bg-paper-3 text-ink border border-rule-strong'
                : 'text-muted hover:text-ink border border-transparent'
            }`}
          >
            Study replay
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('puzzle');
              setIsAutoPlaying(false);
              resetPuzzle();
            }}
            className={`px-3 py-1.5 rounded text-xs font-sans font-medium transition-colors cursor-pointer ${
              mode === 'puzzle'
                ? 'bg-accent text-accent-ink'
                : 'text-muted hover:text-ink border border-transparent'
            }`}
          >
            Solve tactics
          </button>
        </div>
      </div>

      {/* Main 8x8 Chessboard */}
      <div className="py-6 px-4 sm:px-6 my-auto flex flex-col items-center justify-center">
        <div className="relative grid grid-cols-8 grid-rows-8 w-[264px] h-[264px] sm:w-[304px] sm:h-[304px] rounded-sm overflow-hidden border border-rule-strong">
          {activeBoard.map((row, rIdx) =>
            row.map((piece, cIdx) => {
              const isLight = (rIdx + cIdx) % 2 === 0;
              const squareName = `${FILES[cIdx]}${RANKS[rIdx]}`;
              const isSelected =
                selectedSquare?.[0] === rIdx && selectedSquare?.[1] === cIdx;
              const isHighlighted =
                mode === 'replay'
                  ? currentStep.highlightSquares.includes(squareName)
                  : puzzleStatus === 'correct' &&
                    ((rIdx === data.puzzle.solutionFrom[0] && cIdx === data.puzzle.solutionFrom[1]) ||
                      (rIdx === data.puzzle.solutionTo[0] && cIdx === data.puzzle.solutionTo[1]));

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  type="button"
                  onClick={() => handleSquareClick(rIdx, cIdx)}
                  aria-label={`Square ${squareName}${piece ? ' occupied' : ''}`}
                  className={`relative flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus ${
                    isSelected
                      ? 'bg-[var(--board-selected)] ring-1 ring-inset ring-accent'
                      : isHighlighted
                      ? 'bg-[var(--board-highlight)]'
                      : isLight
                      ? 'bg-[var(--board-light)] hover:bg-[var(--board-light-hover)]'
                      : 'bg-[var(--board-dark)] hover:bg-[var(--board-dark-hover)]'
                  }`}
                >
                  {piece && (
                    <motion.div
                      key={`${piece}-${rIdx}-${cIdx}`}
                      initial={{ opacity: 0.85 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.16 }}
                    >
                      <ChessPieceGlyph code={piece} />
                    </motion.div>
                  )}

                  {cIdx === 0 && (
                    <span className="absolute top-0.5 left-1 font-mono text-[9px] text-muted/60 pointer-events-none">
                      {RANKS[rIdx]}
                    </span>
                  )}
                  {rIdx === 7 && (
                    <span className="absolute bottom-0.5 right-1 font-mono text-[9px] text-muted/60 pointer-events-none">
                      {FILES[cIdx]}
                    </span>
                  )}
                </button>
              );
            })
          )}

          {arrowCoords && (
            <svg
              viewBox="0 0 800 800"
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id={`kiln-arrow-${data.id}`}
                  markerWidth="6"
                  markerHeight="6"
                  refX="4"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L6,3 L0,6 Z" fill="#e2783e" />
                </marker>
              </defs>
              <line
                x1={(arrowCoords.from[1] + 0.5) * 100}
                y1={(arrowCoords.from[0] + 0.5) * 100}
                x2={(arrowCoords.to[1] + 0.5) * 100}
                y2={(arrowCoords.to[0] + 0.5) * 100}
                stroke="#e2783e"
                strokeOpacity="0.85"
                strokeWidth="12"
                strokeLinecap="round"
                markerEnd={`url(#kiln-arrow-${data.id})`}
              />
            </svg>
          )}
        </div>

        {/* Replay or Puzzle Controls */}
        {mode === 'replay' ? (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
            <div className="flex items-center gap-1 mr-1">
              <button
                type="button"
                aria-label="Previous move"
                onClick={() => {
                  setIsAutoPlaying(false);
                  setStepIdx((prev) => Math.max(0, prev - 1));
                  playChessPieceThud(0.35);
                }}
                disabled={stepIdx === 0}
                className="w-8 h-8 rounded-sm border border-rule bg-paper text-ink disabled:opacity-35 flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={isAutoPlaying ? 'Pause study replay' : 'Auto-play study'}
                onClick={() => {
                  setIsAutoPlaying((p) => !p);
                  playChessPieceThud(0.4);
                }}
                className="w-8 h-8 rounded-sm border border-rule-strong bg-paper-3 text-ink flex items-center justify-center cursor-pointer"
              >
                {isAutoPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                aria-label="Next move"
                onClick={() => {
                  setIsAutoPlaying(false);
                  setStepIdx((prev) => Math.min(data.steps.length - 1, prev + 1));
                  playChessPieceThud(0.35);
                }}
                disabled={stepIdx === data.steps.length - 1}
                className="w-8 h-8 rounded-sm border border-rule bg-paper text-ink disabled:opacity-35 flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {data.steps.map((step, sIdx) => {
              const isActive = sIdx === stepIdx;
              return (
                <button
                  key={step.notation}
                  type="button"
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setStepIdx(sIdx);
                    playChessPieceThud(0.4);
                  }}
                  className={`font-mono text-xs px-2.5 py-1 rounded-sm transition-colors cursor-pointer border ${
                    isActive
                      ? 'bg-accent text-accent-ink border-transparent font-medium'
                      : 'border-rule bg-paper text-ink-2 hover:text-ink hover:border-rule-strong'
                  }`}
                >
                  {step.notation}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowHint((h) => !h)}
              className="px-3.5 py-1.5 rounded-sm border border-rule bg-paper text-xs font-sans text-ink-2 hover:text-ink hover:border-rule-strong transition-colors cursor-pointer"
            >
              {showHint ? 'Hide hint' : 'Show hint'}
            </button>
            <button
              type="button"
              onClick={resetPuzzle}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm border border-rule bg-paper text-xs font-sans text-ink-2 hover:text-ink hover:border-rule-strong transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset board</span>
            </button>
          </div>
        )}
      </div>

      {/* Synchronized Footer Commentary */}
      <div className="p-4 sm:px-6 sm:py-4 bg-paper border-t border-rule flex flex-col gap-2">
        <AnimatePresence mode="wait">
          {mode === 'replay' ? (
            <motion.div
              key={`replay-${pillarId}-${stepIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="flex items-start justify-between gap-4"
            >
              <p className="font-sans text-xs sm:text-sm text-ink-2 leading-relaxed">
                <strong className="font-mono text-ink font-medium mr-2">
                  {currentStep.notation}
                </strong>
                {currentStep.commentary}
              </p>

              <div
                className="hidden sm:flex items-center gap-1 pt-1 shrink-0"
                title={`Evaluation +${currentStep.evalScore.toFixed(1)}`}
              >
                {HEAT_VARS.map((bg, i) => (
                  <span
                    key={bg}
                    className="w-2 h-2 rounded-[2px]"
                    style={{
                      backgroundColor: bg,
                      opacity: i < evalHeatSteps ? 1 : 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`puzzle-${pillarId}-${puzzleStatus}-${showHint}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="space-y-1.5"
            >
              {puzzleStatus === 'correct' ? (
                <div className="flex items-start gap-2 text-xs sm:text-sm text-ink leading-relaxed">
                  <Check
                    className="w-4 h-4 text-[var(--color-success)] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p>
                    <strong className="font-mono text-ink font-medium mr-2">
                      {data.puzzle.solutionNotation}
                    </strong>
                    {data.puzzle.successNote}
                  </p>
                </div>
              ) : puzzleStatus === 'retry' ? (
                <div className="flex items-start gap-2 text-xs sm:text-sm text-ink-2 leading-relaxed">
                  <AlertCircle
                    className="w-4 h-4 text-[var(--color-error)] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p>Not the strongest continuation. Select a White piece and click its winning square.</p>
                </div>
              ) : (
                <p className="font-sans text-xs sm:text-sm text-ink-2 leading-relaxed">
                  {data.puzzle.prompt}
                </p>
              )}

              {showHint && puzzleStatus !== 'correct' && (
                <p className="font-sans text-xs text-muted leading-relaxed">
                  Hint: {data.puzzle.hint}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
