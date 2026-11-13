export type BoardGrid = (string | null)[][];

export interface StudyStep {
  notation: string;
  commentary: string;
  board: BoardGrid;
  from: [number, number];
  to: [number, number];
  evalScore: number; // pawn advantage scaled -2..+6 for thermal ramp plotting
  highlightSquares: string[];
}

export interface PuzzleSpec {
  prompt: string;
  initialBoard: BoardGrid;
  solutionFrom: [number, number];
  solutionTo: [number, number];
  solutionNotation: string;
  successNote: string;
  hint: string;
}

export interface BoardStudyData {
  id: string;
  pillar: string;
  category: string;
  ratingTier: string;
  title: string;
  eco: string;
  theme: string;
  description: string;
  disciplines: string[];
  steps: StudyStep[];
  puzzle: PuzzleSpec;
}

export interface ReelKeyframe {
  t: number; // normalized 0..1
  notation: string;
  evalLabel: string;
  heatStep: 1 | 2 | 3 | 4 | 5 | 6;
  caption: string;
  from: [number, number];
  to: [number, number];
  piece: string;
  highlights: [number, number][];
  branches?: { from: [number, number]; to: [number, number] }[];
}

export interface ReelChapter {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  durationSec: number;
  backdrop: string;
  initialPieces: { code: string; row: number; col: number }[];
  keyframes: ReelKeyframe[];
}

export function cloneBoard(b: BoardGrid): BoardGrid {
  return b.map((row) => [...row]);
}

export function applyMove(
  b: BoardGrid,
  from: [number, number],
  to: [number, number]
): BoardGrid {
  const next = cloneBoard(b);
  const piece = next[from[0]]?.[from[1]] ?? null;
  next[from[0]][from[1]] = null;
  next[to[0]][to[1]] = piece;
  return next;
}

/* ============================================================================
 * 1. QGD CARLSBAD MINORITY ATTACK (ECO D35)
 * Coordinates: row = 8 - rank (0=8..7=1), col = file (0=a..7=h)
 * White: Kg1[7,6], Qc2[6,2], Rb1[7,1], Rf1[7,5], Be2[6,4], Bc1[7,2], Nc3[5,2], Nf3[5,5]
 *        Pawns: a3[5,0], b4[4,1], d4[4,3], e3[5,4], f2[6,5], g2[6,6], h2[6,7]
 * Black: Kg8[0,6], Qc7[1,2], Ra8[0,0], Re8[0,4], Be7[1,4], Bc8[0,2], Nd7[1,3], Nf6[2,5]
 *        Pawns: a7[1,0], b7[1,1], c6[2,2], d5[3,3], e6[2,4], f7[1,5], g7[1,6], h7[1,7]
 * Legal plies: 14. b5! (b4->b5) -> 14... cxb5 (c6->b5) -> 15. Nxb5 (c3->b5, hits Qc7)
 * ========================================================================== */
const BASE_CARLSBAD: BoardGrid = [
  ['bR', null, 'bB', null, 'bR', null, 'bK', null],
  ['bP', 'bP', 'bQ', 'bN', 'bB', 'bP', 'bP', 'bP'],
  [null, null, 'bP', null, 'bP', 'bN', null, null],
  [null, null, null, 'bP', null, null, null, null],
  [null, 'wP', null, 'wP', null, null, null, null],
  ['wP', null, 'wN', null, 'wP', 'wN', null, null],
  [null, null, 'wQ', null, 'wB', 'wP', 'wP', 'wP'],
  [null, 'wR', 'wB', null, null, 'wR', 'wK', null],
];
const CARLSBAD_1 = applyMove(BASE_CARLSBAD, [4, 1], [3, 1]); // 14. b5! (b4->b5)
const CARLSBAD_2 = applyMove(CARLSBAD_1, [2, 2], [3, 1]); // 14... cxb5 (c6->b5)
const CARLSBAD_3 = applyMove(CARLSBAD_2, [5, 2], [3, 1]); // 15. Nxb5 (Nc3xb5)

/* ============================================================================
 * 2. SICILIAN NAJDORF CENTRAL SACRIFICE (ECO B90)
 * White: Kg1[7,6], Qb3[5,1], Bc4[4,2], Be3[5,4], Nc3[5,2], Ne5[3,4], Rd1[7,3], Rf1[7,5]
 *        Pawns: a2[6,0], b2[6,1], f2[6,5], g2[6,6], h2[6,7]
 * Black: Ke8[0,4], Qc7[1,2], Ra8[0,0], Rh8[0,7], Be7[1,4], Bb7[1,1], Nd7[1,3], Nf6[2,5]
 *        Pawns: a7[1,0], b5[3,1], d6[2,3], e6[2,4], f7[1,5], g7[1,6], h7[1,7]
 * Legal plies:
 *   18. Nxf7! (e5[3,4] -> f7[1,5])
 *   18... Kxf7 (e8[0,4] -> f7[1,5])
 *   19. Bxe6+ (c4[4,2] -> e6[2,4] along clear d5[3,3], checks Kf7[1,5])
 * ========================================================================== */
const BASE_NAJDORF: BoardGrid = [
  ['bR', null, null, null, 'bK', null, null, 'bR'],
  ['bP', 'bB', 'bQ', 'bN', 'bB', 'bP', 'bP', 'bP'],
  [null, null, null, 'bP', 'bP', 'bN', null, null],
  [null, 'bP', null, null, 'wN', null, null, null],
  [null, null, 'wB', null, null, null, null, null],
  [null, 'wQ', 'wN', null, 'wB', null, null, null],
  ['wP', 'wP', null, null, null, 'wP', 'wP', 'wP'],
  [null, null, null, 'wR', null, 'wR', 'wK', null],
];
const NAJDORF_1 = applyMove(BASE_NAJDORF, [3, 4], [1, 5]); // 18. Nxf7!
const NAJDORF_2 = applyMove(NAJDORF_1, [0, 4], [1, 5]); // 18... Kxf7
const NAJDORF_3 = applyMove(NAJDORF_2, [4, 2], [2, 4]); // 19. Bxe6+

/* ============================================================================
 * 3. TEXTBOOK LUCENA FOURTH-RANK BRIDGE
 * White: Kd8[0,3], Pd7[1,3], Rc4[4,2] (Black King Kb7[1,1] cut off along c-file)
 * Black: Kb7[1,1], Ra1[7,0]
 * Legal plies:
 *   1. Ke7 (d8[0,3] -> e7[1,4])
 *   1... Re1+ (a1[7,0] -> e1[7,4])
 *   2. Kd6 (e7[1,4] -> d6[2,3])
 *   2... Rd1+ (e1[7,4] -> d1[7,3])
 *   3. Ke5 (d6[2,3] -> e5[3,4])
 *   3... Re1+ (d1[7,3] -> e1[7,4])
 *   4. Re4! (c4[4,2] -> e4[4,4] bridge shields Ke5 against Re1+)
 * ========================================================================== */
const BASE_LUCENA: BoardGrid = [
  [null, null, null, 'wK', null, null, null, null],
  [null, 'bK', null, 'wP', null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, 'wR', null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['bR', null, null, null, null, null, null, null],
];
const LUCENA_1 = applyMove(BASE_LUCENA, [0, 3], [1, 4]); // 1. Ke7
const LUCENA_2 = applyMove(LUCENA_1, [7, 0], [7, 4]); // 1... Re1+
const LUCENA_3 = applyMove(LUCENA_2, [1, 4], [2, 3]); // 2. Kd6
const LUCENA_4 = applyMove(LUCENA_3, [7, 4], [7, 3]); // 2... Rd1+
const LUCENA_5 = applyMove(LUCENA_4, [2, 3], [3, 4]); // 3. Ke5
const LUCENA_6 = applyMove(LUCENA_5, [7, 3], [7, 4]); // 3... Re1+
const LUCENA_7 = applyMove(LUCENA_6, [4, 2], [4, 4]); // 4. Re4!

/* ============================================================================
 * 4. NIMZO-INDIAN SAMISCH PROPHYLAXIS (ECO E24)
 * White: Ke1[7,4], Qd1[7,3], Ra1[7,0], Rh1[7,7], Bc1[7,2], Bf1[7,5], Ng1[7,6], Nc3[5,2]
 *        Pawns: a2[6,0], b2[6,1], c4[4,2], d4[4,3], e3[5,4], f2[6,5], g2[6,6], h2[6,7]
 * Black: Kg8[0,6], Qd8[0,3], Ra8[0,0], Rf8[0,5], Bc8[0,2], Bb4[4,1], Nb8[0,1], Nf6[2,5]
 *        Pawns: a7[1,0], b7[1,1], c5[3,2], d7[1,3], e6[2,4], f7[1,5], g7[1,6], h7[1,7]
 * Legal plies:
 *   5. a3! (a2[6,0] -> a3[5,0])
 *   5... Bxc3+ (b4[4,1] -> c3[5,2], checks Ke1[7,4])
 *   6. bxc3 (b2[6,1] -> c3[5,2])
 * ========================================================================== */
const BASE_NIMZO: BoardGrid = [
  ['bR', 'bN', 'bB', 'bQ', null, 'bR', 'bK', null],
  ['bP', 'bP', null, 'bP', null, 'bP', 'bP', 'bP'],
  [null, null, null, null, 'bP', 'bN', null, null],
  [null, null, 'bP', null, null, null, null, null],
  [null, 'bB', 'wP', 'wP', null, null, null, null],
  [null, null, 'wN', null, 'wP', null, null, null],
  ['wP', 'wP', null, null, null, 'wP', 'wP', 'wP'],
  ['wR', null, 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
];
const NIMZO_1 = applyMove(BASE_NIMZO, [6, 0], [5, 0]); // 5. a3!
const NIMZO_2 = applyMove(NIMZO_1, [4, 1], [5, 2]); // 5... Bxc3+
const NIMZO_3 = applyMove(NIMZO_2, [6, 1], [5, 2]); // 6. bxc3

export const CURRICULUM_STUDIES: BoardStudyData[] = [
  {
    id: '01',
    pillar: '01',
    category: 'Pawn ecology',
    ratingTier: '1400 to 1850 Elo',
    title: 'Carlsbad structure mastery',
    eco: 'Queen’s Gambit Declined, ECO D35',
    theme: 'Minority attack vector',
    description:
      'Replace passive waiting moves with the queenside minority attack. Anchor outposts, challenge c6 with timing precision, and convert isolated targets.',
    disciplines: ['Minority attack execution', 'Outpost anchoring', 'Pawn break intuition'],
    steps: [
      {
        notation: 'Initial',
        commentary: 'Black maintains a compact central chain. White initiates the b4 to b5 minority rupture.',
        board: BASE_CARLSBAD,
        from: [4, 1],
        to: [3, 1],
        evalScore: 0.4,
        highlightSquares: ['b4', 'b5', 'c6'],
      },
      {
        notation: '14. b5!',
        commentary: 'Striking c6 directly forces Black to accept a long-term queenside structural weakness.',
        board: CARLSBAD_1,
        from: [4, 1],
        to: [3, 1],
        evalScore: 0.9,
        highlightSquares: ['b5', 'c6'],
      },
      {
        notation: '14... cxb5',
        commentary: 'Capturing opens the c-file while exposing the d5 pawn and weak queenside dark squares.',
        board: CARLSBAD_2,
        from: [2, 2],
        to: [3, 1],
        evalScore: 1.2,
        highlightSquares: ['b5', 'd5'],
      },
      {
        notation: '15. Nxb5',
        commentary: 'White recaptures actively with tempo against Black’s queen on c7 and eye on c7/a7.',
        board: CARLSBAD_3,
        from: [5, 2],
        to: [3, 1],
        evalScore: 1.6,
        highlightSquares: ['b5', 'c7', 'a7'],
      },
    ],
    puzzle: {
      prompt: 'White to move. Execute the thematic minority rupture that fractures Black’s queenside chain.',
      initialBoard: BASE_CARLSBAD,
      solutionFrom: [4, 1],
      solutionTo: [3, 1],
      solutionNotation: '14. b5!',
      successNote: 'Correct. Advancing b5 challenges c6 directly and creates permanent queenside targets.',
      hint: 'Push the queenside pawn on b4 to attack Black’s c6 anchor.',
    },
  },
  {
    id: '02',
    pillar: '02',
    category: 'Calculation',
    ratingTier: '1600 to 2050 Elo',
    title: 'Candidate move tree pruning',
    eco: 'Sicilian Najdorf, ECO B90',
    theme: 'Kotov calculation matrix',
    description:
      'Eliminate calculation drift and time-trouble blunders. Inspect forcing checks and captures first inside an ordered candidate tree.',
    disciplines: ['Candidate selection', 'Forcing variations', 'Visualization depth'],
    steps: [
      {
        notation: 'Initial',
        commentary: 'Black’s king remains uncastled on e8. Test forcing sacrifices before slow maneuvers.',
        board: BASE_NAJDORF,
        from: [3, 4],
        to: [1, 5],
        evalScore: 0.8,
        highlightSquares: ['e5', 'f7', 'e6'],
      },
      {
        notation: '18. Nxf7!',
        commentary: 'The knight on e5 leaps into f7, dragging the uncastled king onto an exposed diagonal.',
        board: NAJDORF_1,
        from: [3, 4],
        to: [1, 5],
        evalScore: 2.4,
        highlightSquares: ['f7', 'e8'],
      },
      {
        notation: '18... Kxf7',
        commentary: 'Black must take on f7, leaving the e6 shield pinned against the a2 to g8 diagonal.',
        board: NAJDORF_2,
        from: [0, 4],
        to: [1, 5],
        evalScore: 3.1,
        highlightSquares: ['f7', 'e6'],
      },
      {
        notation: '19. Bxe6+',
        commentary: 'The bishop captures on e6 with check, backed cleanly by the queen on b3.',
        board: NAJDORF_3,
        from: [4, 2],
        to: [2, 4],
        evalScore: 4.5,
        highlightSquares: ['e6', 'f7', 'b3'],
      },
    ],
    puzzle: {
      prompt: 'White to move. Prune passive moves and find the forcing sacrifice against Black’s uncastled king.',
      initialBoard: BASE_NAJDORF,
      solutionFrom: [3, 4],
      solutionTo: [1, 5],
      solutionNotation: '18. Nxf7!',
      successNote: 'Exact. 18. Nxf7! forces Kxf7, opening the c4 to f7 diagonal for 19. Bxe6+.',
      hint: 'Check forcing captures with your centralized knight on e5.',
    },
  },
  {
    id: '03',
    pillar: '03',
    category: 'Endgames',
    ratingTier: '1800 to 2200 Elo',
    title: 'Theoretical rook endgames',
    eco: 'Lucena fourth-rank bridge',
    theme: 'Bridge building technique',
    description:
      'Convert winning rook endgames cleanly under low clock pressure. Master king step-out routes and fourth-rank rook interposition.',
    disciplines: ['Lucena bridge geometry', 'King cutoff rules', 'Accurate king march'],
    steps: [
      {
        notation: 'Initial',
        commentary: 'White’s king blocks d8 while the c4 rook cuts off Black’s king. Step out toward e7 first.',
        board: BASE_LUCENA,
        from: [0, 3],
        to: [1, 4],
        evalScore: 4.8,
        highlightSquares: ['d8', 'c4', 'd7'],
      },
      {
        notation: '1. Ke7',
        commentary: 'White clears the promotion square d8 while guarding d7 directly.',
        board: LUCENA_1,
        from: [0, 3],
        to: [1, 4],
        evalScore: 5.0,
        highlightSquares: ['e7', 'd8'],
      },
      {
        notation: '1... Re1+',
        commentary: 'Black swings the rook behind the king to begin vertical checks along the open files.',
        board: LUCENA_2,
        from: [7, 0],
        to: [7, 4],
        evalScore: 5.0,
        highlightSquares: ['e1', 'e7'],
      },
      {
        notation: '2. Kd6',
        commentary: 'Rather than retreating passively to d8, the king steps down toward the fourth-rank rook.',
        board: LUCENA_3,
        from: [1, 4],
        to: [2, 3],
        evalScore: 5.2,
        highlightSquares: ['d6', 'd7'],
      },
      {
        notation: '2... Rd1+',
        commentary: 'Black delivers another check along the d-file; White approaches e5 calmly.',
        board: LUCENA_4,
        from: [7, 4],
        to: [7, 3],
        evalScore: 5.2,
        highlightSquares: ['d1', 'd6'],
      },
      {
        notation: '3. Ke5',
        commentary: 'White’s king steps up to e5, defending the future fourth-rank rook square.',
        board: LUCENA_5,
        from: [2, 3],
        to: [3, 4],
        evalScore: 5.3,
        highlightSquares: ['e5', 'e4'],
      },
      {
        notation: '3... Re1+',
        commentary: 'Black checks along the e-file, allowing White to interpose cleanly on e4.',
        board: LUCENA_6,
        from: [7, 3],
        to: [7, 4],
        evalScore: 5.4,
        highlightSquares: ['e5', 'e4', 'e1'],
      },
      {
        notation: '4. Re4!',
        commentary: 'The fourth-rank bridge on e4 blocks all checks while shielded by White’s king, ensuring d8=Q.',
        board: LUCENA_7,
        from: [4, 2],
        to: [4, 4],
        evalScore: 6.0,
        highlightSquares: ['e4', 'e5', 'd8'],
      },
    ],
    puzzle: {
      prompt: 'White to move after 3... Re1+. Complete the Lucena bridge and neutralize Black’s checks.',
      initialBoard: LUCENA_6,
      solutionFrom: [4, 2],
      solutionTo: [4, 4],
      solutionNotation: '4. Re4!',
      successNote: 'Clean Lucena technique. 4. Re4! shields the e5 king and guarantees promotion on d8.',
      hint: 'Swing your c4 rook across the fourth rank to block the check on the e-file.',
    },
  },
  {
    id: '04',
    pillar: '04',
    category: 'Prophylaxis',
    ratingTier: '2000 to 2350+ Elo',
    title: 'Prophylaxis and prep blueprint',
    eco: 'Nimzo-Indian Defense, ECO E24',
    theme: 'Prophylactic timing',
    description:
      'Defuse active counterplay early. Force structural concessions around opponent pins before building central expansion.',
    disciplines: ['Pin resolution', 'Bishop pair conversion', 'Color complex control'],
    steps: [
      {
        notation: 'Initial',
        commentary: 'Black pins the c3 knight with Bb4. Put the question to the bishop immediately.',
        board: BASE_NIMZO,
        from: [6, 0],
        to: [5, 0],
        evalScore: 0.5,
        highlightSquares: ['a3', 'b4', 'c3'],
      },
      {
        notation: '5. a3!',
        commentary: 'Prophylactic precision: White compels Black to surrender the dark-squared bishop or retreat.',
        board: NIMZO_1,
        from: [6, 0],
        to: [5, 0],
        evalScore: 0.7,
        highlightSquares: ['a3', 'b4'],
      },
      {
        notation: '5... Bxc3+',
        commentary: 'Black captures with check to double White’s c-pawns before retreating would waste time.',
        board: NIMZO_2,
        from: [4, 1],
        to: [5, 2],
        evalScore: 0.7,
        highlightSquares: ['c3', 'e1'],
      },
      {
        notation: '6. bxc3',
        commentary: 'White strengthens d4 and gains the uncontested bishop pair to build e4 play.',
        board: NIMZO_3,
        from: [6, 1],
        to: [5, 2],
        evalScore: 1.0,
        highlightSquares: ['c3', 'd4', 'e4'],
      },
    ],
    puzzle: {
      prompt: 'White to move. Force the b4 bishop to resolve the pin immediately.',
      initialBoard: BASE_NIMZO,
      solutionFrom: [6, 0],
      solutionTo: [5, 0],
      solutionNotation: '5. a3!',
      successNote: 'Exact. 5. a3! secures the bishop pair and reinforces central expansion with e4.',
      hint: 'Push the a2 pawn one square to challenge the pinning bishop on b4.',
    },
  },
];

export const REEL_CHAPTERS: ReelChapter[] = [
  {
    id: 'carlsbad',
    index: '01',
    title: 'Carlsbad minority attack',
    subtitle: 'Queen’s Gambit Declined, ECO D35',
    durationSec: 12,
    backdrop: '/images/reel-carlsbad-plate.jpg',
    initialPieces: [
      { code: 'bR', row: 0, col: 0 },
      { code: 'bB', row: 0, col: 2 },
      { code: 'bR', row: 0, col: 4 },
      { code: 'bK', row: 0, col: 6 },
      { code: 'bP', row: 1, col: 0 },
      { code: 'bP', row: 1, col: 1 },
      { code: 'bQ', row: 1, col: 2 },
      { code: 'bN', row: 1, col: 3 },
      { code: 'bB', row: 1, col: 4 },
      { code: 'bP', row: 1, col: 5 },
      { code: 'bP', row: 1, col: 6 },
      { code: 'bP', row: 1, col: 7 },
      { code: 'bP', row: 2, col: 2 },
      { code: 'bP', row: 2, col: 4 },
      { code: 'bN', row: 2, col: 5 },
      { code: 'bP', row: 3, col: 3 },
      { code: 'wP', row: 4, col: 1 },
      { code: 'wP', row: 4, col: 3 },
      { code: 'wP', row: 5, col: 0 },
      { code: 'wN', row: 5, col: 2 },
      { code: 'wP', row: 5, col: 4 },
      { code: 'wN', row: 5, col: 5 },
      { code: 'wQ', row: 6, col: 2 },
      { code: 'wB', row: 6, col: 4 },
      { code: 'wP', row: 6, col: 5 },
      { code: 'wP', row: 6, col: 6 },
      { code: 'wP', row: 6, col: 7 },
      { code: 'wR', row: 7, col: 1 },
      { code: 'wB', row: 7, col: 2 },
      { code: 'wR', row: 7, col: 5 },
      { code: 'wK', row: 7, col: 6 },
    ],
    keyframes: [
      {
        t: 0.08,
        notation: '14. b5!',
        evalLabel: '+0.9',
        heatStep: 2,
        caption: 'Advance the minority pawn to b5, striking c6 before Black consolidates.',
        from: [4, 1],
        to: [3, 1],
        piece: 'wP',
        highlights: [[3, 1], [2, 2]],
        branches: [
          { from: [3, 1], to: [2, 2] },
          { from: [3, 1], to: [2, 0] },
        ],
      },
      {
        t: 0.38,
        notation: '14... cxb5',
        evalLabel: '+1.2',
        heatStep: 3,
        caption: 'Accepting the exchange opens the c-file and exposes Black’s d5 anchor.',
        from: [2, 2],
        to: [3, 1],
        piece: 'bP',
        highlights: [[3, 1], [3, 3]],
      },
      {
        t: 0.66,
        notation: '15. Nxb5',
        evalLabel: '+1.6',
        heatStep: 4,
        caption: 'The c3 knight recaptures on b5 with tempo against the queen on c7.',
        from: [5, 2],
        to: [3, 1],
        piece: 'wN',
        highlights: [[3, 1], [1, 2], [1, 0]],
        branches: [{ from: [3, 1], to: [1, 2] }],
      },
      {
        t: 0.88,
        notation: '15... Qb8',
        evalLabel: '+1.8',
        heatStep: 5,
        caption: 'Black’s queen retreats passively to defend a7 while White dominates the c-file.',
        from: [1, 2],
        to: [0, 1],
        piece: 'bQ',
        highlights: [[0, 1], [3, 1]],
      },
    ],
  },
  {
    id: 'najdorf',
    index: '02',
    title: 'Kotov calculation pruning',
    subtitle: 'Sicilian Najdorf, ECO B90',
    durationSec: 12,
    backdrop: '/images/hero-chess-studio.jpg',
    initialPieces: [
      { code: 'bR', row: 0, col: 0 },
      { code: 'bK', row: 0, col: 4 },
      { code: 'bR', row: 0, col: 7 },
      { code: 'bP', row: 1, col: 0 },
      { code: 'bB', row: 1, col: 1 },
      { code: 'bQ', row: 1, col: 2 },
      { code: 'bN', row: 1, col: 3 },
      { code: 'bB', row: 1, col: 4 },
      { code: 'bP', row: 1, col: 5 },
      { code: 'bP', row: 1, col: 6 },
      { code: 'bP', row: 1, col: 7 },
      { code: 'bP', row: 2, col: 3 },
      { code: 'bP', row: 2, col: 4 },
      { code: 'bN', row: 2, col: 5 },
      { code: 'bP', row: 3, col: 1 },
      { code: 'wN', row: 3, col: 4 },
      { code: 'wB', row: 4, col: 2 },
      { code: 'wQ', row: 5, col: 1 },
      { code: 'wN', row: 5, col: 2 },
      { code: 'wB', row: 5, col: 4 },
      { code: 'wP', row: 6, col: 0 },
      { code: 'wP', row: 6, col: 1 },
      { code: 'wP', row: 6, col: 5 },
      { code: 'wP', row: 6, col: 6 },
      { code: 'wP', row: 6, col: 7 },
      { code: 'wR', row: 7, col: 3 },
      { code: 'wR', row: 7, col: 5 },
      { code: 'wK', row: 7, col: 6 },
    ],
    keyframes: [
      {
        t: 0.1,
        notation: '18. Nxf7!',
        evalLabel: '+2.4',
        heatStep: 3,
        caption: 'Prune slow positional continuations and test the forcing knight sacrifice on f7.',
        from: [3, 4],
        to: [1, 5],
        piece: 'wN',
        highlights: [[1, 5], [0, 4]],
        branches: [
          { from: [4, 2], to: [2, 4] },
          { from: [5, 1], to: [2, 4] },
        ],
      },
      {
        t: 0.4,
        notation: '18... Kxf7',
        evalLabel: '+3.1',
        heatStep: 4,
        caption: 'Black’s king is forced to recapture, stepping directly onto the diagonal pin.',
        from: [0, 4],
        to: [1, 5],
        piece: 'bK',
        highlights: [[1, 5], [2, 4]],
      },
      {
        t: 0.68,
        notation: '19. Bxe6+',
        evalLabel: '+4.5',
        heatStep: 5,
        caption: 'The c4 bishop crashes through e6 with check, guarded cleanly by Qb3.',
        from: [4, 2],
        to: [2, 4],
        piece: 'wB',
        highlights: [[2, 4], [1, 5], [5, 1]],
        branches: [{ from: [5, 1], to: [2, 4] }],
      },
      {
        t: 0.9,
        notation: '19... Ke8',
        evalLabel: '+5.1',
        heatStep: 6,
        caption: 'Black retreats with a fractured king shelter and lost castling rights.',
        from: [1, 5],
        to: [0, 4],
        piece: 'bK',
        highlights: [[0, 4], [2, 4]],
      },
    ],
  },
  {
    id: 'lucena',
    index: '03',
    title: 'Lucena fourth-rank bridge',
    subtitle: 'Rook Endgame Theory',
    durationSec: 14,
    backdrop: '/images/reel-endgame-plate.jpg',
    initialPieces: [
      { code: 'wK', row: 0, col: 3 },
      { code: 'bK', row: 1, col: 1 },
      { code: 'wP', row: 1, col: 3 },
      { code: 'wR', row: 4, col: 2 },
      { code: 'bR', row: 7, col: 0 },
    ],
    keyframes: [
      {
        t: 0.08,
        notation: '1. Ke7',
        evalLabel: '+5.0',
        heatStep: 4,
        caption: 'Vacate d8 so the passed pawn can promote while staying beside its escort.',
        from: [0, 3],
        to: [1, 4],
        piece: 'wK',
        highlights: [[1, 4], [0, 3]],
        branches: [{ from: [4, 2], to: [4, 4] }],
      },
      {
        t: 0.23,
        notation: '1... Re1+',
        evalLabel: '+5.0',
        heatStep: 4,
        caption: 'Black begins checking from the rear along the open e-file.',
        from: [7, 0],
        to: [7, 4],
        piece: 'bR',
        highlights: [[7, 4], [1, 4]],
      },
      {
        t: 0.38,
        notation: '2. Kd6',
        evalLabel: '+5.2',
        heatStep: 4,
        caption: 'White walks down the board toward the sheltered fourth rank.',
        from: [1, 4],
        to: [2, 3],
        piece: 'wK',
        highlights: [[2, 3], [1, 3]],
      },
      {
        t: 0.53,
        notation: '2... Rd1+',
        evalLabel: '+5.2',
        heatStep: 5,
        caption: 'Black chases the king onto the d-file; White continues toward e5.',
        from: [7, 4],
        to: [7, 3],
        piece: 'bR',
        highlights: [[7, 3], [2, 3]],
      },
      {
        t: 0.68,
        notation: '3. Ke5',
        evalLabel: '+5.4',
        heatStep: 5,
        caption: 'Stepping onto e5 aligns the king directly beside the future rook bridge.',
        from: [2, 3],
        to: [3, 4],
        piece: 'wK',
        highlights: [[3, 4], [4, 4]],
      },
      {
        t: 0.81,
        notation: '3... Re1+',
        evalLabel: '+5.5',
        heatStep: 5,
        caption: 'One final vertical check allows the decisive rook interposition.',
        from: [7, 3],
        to: [7, 4],
        piece: 'bR',
        highlights: [[7, 4], [3, 4]],
      },
      {
        t: 0.93,
        notation: '4. Re4!',
        evalLabel: '+M5',
        heatStep: 6,
        caption: 'The c4 rook swings to e4, building the classic bridge and guaranteeing promotion.',
        from: [4, 2],
        to: [4, 4],
        piece: 'wR',
        highlights: [[4, 4], [3, 4], [0, 3]],
        branches: [{ from: [1, 3], to: [0, 3] }],
      },
    ],
  },
];
