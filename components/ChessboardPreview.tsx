'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { playChessPieceThud } from './SoundToggle';
import { BorderBeam } from './magicui/BorderBeam';

export interface BoardStudyData {
  id: string;
  pillar: string;
  title: string;
  eco: string;
  theme: string;
  telemetry: string;
  moveNotation: string[];
  explanation: string;
  highlightSquares?: string[];
  arrow?: { from: [number, number]; to: [number, number]; label?: string };
  board: (string | null)[][];
}

export const CASE_STUDY_BOARDS: Record<string, BoardStudyData> = {
  '01': {
    id: '01',
    pillar: '01',
    title: 'Carlsbad Pawn Ecology',
    eco: 'ECO D35 · Queens Gambit Declined',
    theme: 'Minority Attack Vector',
    telemetry: 'b4 to b5 Minority Rupture',
    moveNotation: ['1. c4 c6', '2. cxd5 exd5', '3. b4! a6', '4. b5! axb5', '5. Qxb5 c5? ±'],
    explanation:
      'Rather than drifting into passive defense, White launches the classical minority attack (b4-b5), fixing Black\'s backward c6 pawn and securing structural dominance on the c-file.',
    highlightSquares: ['b4', 'b5', 'c6'],
    arrow: { from: [6, 1], to: [3, 1], label: 'b4 to b5' },
    board: [
      ['bR', null, 'bB', 'bQ', 'bK', 'bB', null, 'bR'],
      ['bP', null, 'bP', null, null, 'bP', 'bP', 'bP'],
      [null, null, 'bP', null, null, 'bN', null, null],
      [null, null, null, 'bP', null, null, null, null],
      [null, 'wP', null, 'wP', null, null, null, null],
      [null, null, 'wP', null, null, 'wN', null, null],
      ['wP', null, null, null, null, 'wP', 'wP', 'wP'],
      ['wR', null, 'wB', 'wQ', 'wK', 'wB', null, 'wR'],
    ],
  },
  '02': {
    id: '02',
    pillar: '02',
    title: 'Candidate Move Tree Pruning',
    eco: 'ECO B90 · Sicilian Najdorf Tactics',
    theme: 'Kotov Calculation Matrix',
    telemetry: 'Candidate 1. Nxf7+! [Forcing] · Eval +3.8',
    moveNotation: ['1. Nxf7+! Kxf7', '2. Qxe6+ Kf8', '3. Bc4! Qe8', '4. Qf5+ Nf6', '5. Bxf6 +−'],
    explanation:
      'Kotov candidate filter: Pruning quiet moves in favor of the forcing knight sacrifice 1. Nxf7+!, exposing the uncastled black king to fatal mating nets.',
    highlightSquares: ['f7', 'e6', 'c4'],
    arrow: { from: [4, 4], to: [1, 5], label: 'Nxf7+!' },
    board: [
      ['bR', null, null, 'bQ', null, 'bR', 'bK', null],
      ['bP', 'bP', null, null, null, 'bP', 'bP', 'bP'],
      [null, null, 'bP', null, 'bP', 'bN', null, null],
      [null, null, null, 'bP', null, null, null, null],
      [null, null, 'wB', null, 'wN', null, null, null],
      [null, null, null, null, null, null, null, null],
      ['wP', 'wP', 'wP', null, null, 'wP', 'wP', 'wP'],
      ['wR', null, 'wB', 'wQ', null, 'wR', 'wK', null],
    ],
  },
  '03': {
    id: '03',
    pillar: '03',
    title: 'Theoretical Rook Endgames',
    eco: 'Theoretical Endgame · Lucena Protocol',
    theme: 'Bridge Building Technique',
    telemetry: '4th Rank Shield 1. Rf4! to 2. Rd4',
    moveNotation: ['1. Rf4! Ra2', '2. Re4+ Kd7', '3. Kf7 Rf2+', '4. Kg6 Rg2+', '5. Rg4! +−'],
    explanation:
      'The definitive Lucena bridge: White positions the rook on the 4th rank (Rf4). When Black checks, the rook interposes on d4, shielding the pawn and ensuring a clean promotion.',
    highlightSquares: ['d8', 'd7', 'f4', 'd4'],
    arrow: { from: [4, 5], to: [4, 3], label: 'Rf4 to Rd4' },
    board: [
      [null, null, null, 'wK', null, null, null, null],
      [null, null, null, 'wP', null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, 'wR', null, null],
      [null, null, null, 'bK', null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['bR', null, null, null, null, null, null, null],
    ],
  },
  '04': {
    id: '04',
    pillar: '04',
    title: 'Prophylaxis & Preparation Blueprint',
    eco: 'Master Preparation · Nimzo-Indian System',
    theme: 'Structural Clamp & Repertoire Depth',
    telemetry: 'Clamping e4 Break · Eval +1.9',
    moveNotation: ['1. d4 Nf6', '2. c4 e6', '3. Nc3 Bb4', '4. e3 c5', '5. a3! Bxc3+ 6. bxc3 d6'],
    explanation:
      'Grandmaster prophylaxis: Neutralizing Black\'s piece pressure against c3 before building an impenetrable center. Anticipating the opponent\'s counterplay two moves ahead.',
    highlightSquares: ['c3', 'e4', 'd6'],
    arrow: { from: [6, 0], to: [5, 0], label: 'a3! Prophylaxis' },
    board: [
      ['bR', null, 'bB', 'bQ', 'bK', null, null, 'bR'],
      ['bP', 'bP', null, 'bP', null, 'bP', 'bP', 'bP'],
      [null, null, null, 'bP', 'bP', 'bN', null, null],
      [null, null, 'bP', null, null, null, null, null],
      [null, null, 'wP', 'wP', null, null, null, null],
      ['wP', null, 'wP', null, 'wP', null, null, null],
      [null, 'wP', null, null, null, 'wP', 'wP', 'wP'],
      ['wR', null, 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
    ],
  },
};

function renderPiece(code: string) {
  const isWhite = code.startsWith('w');
  const type = code.charAt(1);

  const symbols: Record<string, string> = {
    K: isWhite ? '♔' : '♚',
    Q: isWhite ? '♕' : '♛',
    R: isWhite ? '♖' : '♜',
    B: isWhite ? '♗' : '♝',
    N: isWhite ? '♘' : '♞',
    P: isWhite ? '♙' : '♟',
  };

  return (
    <span
      className={`text-xl sm:text-2xl leading-none select-none transition-transform duration-150 ${
        isWhite ? 'text-[#FCFDFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]' : 'text-[#888E90] drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]'
      }`}
    >
      {symbols[type] || ''}
    </span>
  );
}

interface ChessboardPreviewProps {
  pillarId: string;
}

export default function ChessboardPreview({ pillarId }: ChessboardPreviewProps) {
  const [selectedStep, setSelectedStep] = useState(0);
  const data = CASE_STUDY_BOARDS[pillarId] || CASE_STUDY_BOARDS['01'];

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="w-full h-full flex flex-col justify-between bg-surface-card text-ink-primary rounded-xl relative overflow-hidden select-none">
      
      {/* Resend Subtle Warm Amber Border Beam */}
      <BorderBeam size={220} duration={12} delay={0} colorFrom="#FF801F" colorTo="transparent" />

      {/* Resend Precision Window Header */}
      <div className="h-11 px-4 sm:px-5 bg-surface-deep border-b border-border-subtle flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] opacity-80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] opacity-80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] opacity-80" />
          </div>
          <span className="ml-3 font-mono text-xs text-ink-muted">
            {data.eco}
          </span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-surface-card border border-border-subtle">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" aria-hidden="true" />
          <span className="font-mono text-[11px] text-ink-muted">
            analysis.live
          </span>
        </div>
      </div>

      {/* Main Board Container */}
      <div className="py-6 px-4 sm:px-6 my-auto flex flex-col items-center justify-center relative z-10">
        <div className="relative p-2.5 rounded-xl bg-surface-deep border border-border-subtle shadow-2xl">
          
          {/* 8x8 Architectural Chess Grid (Obsidian & Bone) */}
          <div className="grid grid-cols-8 grid-rows-8 w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-lg overflow-hidden border border-white/10">
            {data.board.map((row, rIdx) =>
              row.map((piece, cIdx) => {
                const isLight = (rIdx + cIdx) % 2 === 0;
                const squareName = `${files[cIdx]}${ranks[rIdx]}`;
                const isHighlighted = data.highlightSquares?.includes(squareName);

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => playChessPieceThud(0.35)}
                    className={`relative flex items-center justify-center transition-colors cursor-pointer ${
                      isHighlighted
                        ? 'bg-accent-amber/25 border border-accent-amber/50'
                        : isLight
                        ? 'bg-[#252833]'
                        : 'bg-[#101218]'
                    }`}
                  >
                    {/* Render piece */}
                    {piece && renderPiece(piece)}

                    {/* Edge Coordinates in Geist Mono */}
                    {cIdx === 0 && (
                      <span className="absolute top-0.5 left-1 font-mono text-[8px] text-white/35 pointer-events-none">
                        {ranks[rIdx]}
                      </span>
                    )}
                    {rIdx === 7 && (
                      <span className="absolute bottom-0.5 right-1 font-mono text-[8px] text-white/35 pointer-events-none">
                        {files[cIdx]}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Tactical Vector Indicator Badge */}
          {data.arrow?.label && (
            <div className="absolute -top-3 right-3 px-2.5 py-0.5 rounded-full bg-accent-amber text-[#000000] font-mono text-[11px] font-semibold shadow-md">
              <span>{data.arrow.label}</span>
            </div>
          )}
        </div>

        {/* Real Candidate Notation Sequence Ribbon */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 max-w-sm">
          {data.moveNotation.map((move, mIdx) => {
            const isActive = mIdx === selectedStep;
            return (
              <button
                key={mIdx}
                type="button"
                onClick={() => {
                  setSelectedStep(mIdx);
                  playChessPieceThud(0.4);
                }}
                className={`font-mono text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer relative active:scale-95 border ${
                  isActive
                    ? 'border-accent-amber text-[#000000] font-bold'
                    : 'border-border-subtle bg-surface-deep text-ink-secondary hover:text-ink-primary hover:border-border-strong'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMovePill"
                    className="absolute inset-0 rounded-md bg-accent-amber z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{move}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Analysis Footer */}
      <div className="p-4 sm:p-5 bg-surface-deep border-t border-border-subtle relative z-10">
        <p className="font-sans text-xs sm:text-[13px] text-ink-muted leading-relaxed font-normal">
          {data.explanation}
        </p>
      </div>

    </div>
  );
}
