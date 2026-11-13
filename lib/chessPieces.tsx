import React from 'react';

export type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

/**
 * Clean 45x45 Staunton piece silhouette paths (multi-path per piece for crisp detail)
 */
export const STAUNTON_PATHS: Record<PieceType, string[]> = {
  P: [
    'M 22.5,9 C 19.5,9 17.5,11.2 17.5,14 C 17.5,15.9 18.5,17.5 19.9,18.4 C 16.9,20.1 15,23.3 15,27 C 15,29.5 16.1,31.2 17.5,32.5 L 12.5,36 L 12.5,39.5 L 32.5,39.5 L 32.5,36 L 27.5,32.5 C 28.9,31.2 30,29.5 30,27 C 30,23.3 28.1,20.1 25.1,18.4 C 26.5,17.5 27.5,15.9 27.5,14 C 27.5,11.2 25.5,9 22.5,9 z',
  ],
  R: [
    'M 11,39.5 L 34,39.5 L 34,36 L 11,36 L 11,39.5 z',
    'M 13.5,34.5 L 13.5,29.5 L 31.5,29.5 L 31.5,34.5 L 13.5,34.5 z',
    'M 15.5,28 L 16.5,16.5 L 28.5,16.5 L 29.5,28 L 15.5,28 z',
    'M 12.5,15 L 12.5,8.5 L 17,8.5 L 17,11.5 L 20.5,11.5 L 20.5,8.5 L 24.5,8.5 L 24.5,11.5 L 28,11.5 L 28,8.5 L 32.5,8.5 L 32.5,15 L 12.5,15 z',
  ],
  N: [
    'M 12,39.5 L 34,39.5 L 34,36 L 12,36 L 12,39.5 z',
    'M 21.5,10 C 17,10.5 12.5,14.5 11.5,20.5 C 11,23.5 12.8,24.5 14.5,24.5 C 16.2,24.5 17.5,23 19.5,21.5 C 20.5,23 18,26.5 16.5,29.5 C 15.5,31.5 15.2,33 15.2,34.5 L 32,34.5 C 32.5,27.5 31.5,18.5 26.5,13 C 25.5,11.8 24.5,9.5 23,8.5 L 21.5,10 z',
  ],
  B: [
    'M 11,39.5 L 34,39.5 L 34,36 L 11,36 L 11,39.5 z',
    'M 22.5,6.5 A 2.2,2.2 0 1 1 22.49,6.5 z',
    'M 16.5,34.5 C 14.5,30 14,23.5 17.5,17.5 C 19.3,14.4 21,12.5 22.5,11 C 24,12.5 25.7,14.4 27.5,17.5 C 31,23.5 30.5,30 28.5,34.5 L 16.5,34.5 z',
  ],
  Q: [
    'M 11,39.5 L 34,39.5 L 34,36 L 11,36 L 11,39.5 z',
    'M 9.5,14 A 2.2,2.2 0 1 1 9.49,14 z',
    'M 15.5,10.5 A 2.2,2.2 0 1 1 15.49,10.5 z',
    'M 22.5,9 A 2.2,2.2 0 1 1 22.49,9 z',
    'M 29.5,10.5 A 2.2,2.2 0 1 1 29.49,10.5 z',
    'M 35.5,14 A 2.2,2.2 0 1 1 35.49,14 z',
    'M 12.5,34.5 L 10,16.5 L 17,24 L 16.5,13.5 L 22.5,23 L 28.5,13.5 L 28,24 L 35,16.5 L 32.5,34.5 L 12.5,34.5 z',
  ],
  K: [
    'M 11,39.5 L 34,39.5 L 34,36 L 11,36 L 11,39.5 z',
    'M 21.2,6.5 L 23.8,6.5 L 23.8,14 L 21.2,14 z',
    'M 18.5,9 L 26.5,9 L 26.5,11.4 L 18.5,11.4 z',
    'M 13.5,34.5 C 11,28 11,21 15.5,18.5 C 18,17 20.5,18.5 22.5,21 C 24.5,18.5 27,17 29.5,18.5 C 34,21 34,28 31.5,34.5 L 13.5,34.5 z',
  ],
};

export function ChessPieceGlyph({ code }: { code: string }) {
  const isWhite = code.startsWith('w');
  const type = (code.charAt(1) as PieceType) || 'P';
  const paths = STAUNTON_PATHS[type] || STAUNTON_PATHS.P;

  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 45 45"
      aria-hidden="true"
      className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] shrink-0 select-none pointer-events-none block"
      style={{
        color: isWhite ? 'var(--piece-white)' : 'var(--piece-black)',
      }}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="currentColor"
          stroke={isWhite ? 'var(--piece-white-stroke)' : 'var(--piece-stroke)'}
          strokeWidth={isWhite ? 1.45 : 1.35}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

export function drawCanvasChessPiece(
  ctx: CanvasRenderingContext2D,
  code: string,
  cx: number,
  cy: number,
  squareSize: number
) {
  const isWhite = code.startsWith('w');
  const type = (code.charAt(1) as PieceType) || 'P';
  const paths = STAUNTON_PATHS[type] || STAUNTON_PATHS.P;
  const scale = (squareSize * 0.84) / 45;

  ctx.save();
  ctx.translate(cx - (45 * scale) / 2, cy - (45 * scale) / 2);
  ctx.scale(scale, scale);
  ctx.fillStyle = isWhite ? '#f3eadf' : '#241e1b';
  ctx.strokeStyle = isWhite ? '#1a1512' : '#d5c7b8';
  ctx.lineWidth = isWhite ? 1.5 : 1.6;
  ctx.lineJoin = 'round';

  for (const d of paths) {
    const p = new Path2D(d);
    ctx.fill(p);
    ctx.stroke(p);
  }
  ctx.restore();
}
