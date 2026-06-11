import type { Phase, QType, FemaRung } from './types'

export const END_MSGS: [number, string][] = [
  [90, 'Excellent. Almost everything is mastered.'],
  [70, 'Good progress. The rest will come back for review.'],
  [50, 'Halfway there. Missed ones will return soon.'],
  [0, 'Just starting. Every attempt builds memory.'],
]

export const CORRECT_FEEDBACKS = [
  '✓ Correct.',
  '✓ Right.',
  '✓ Good.',
  '✓ Yes.',
  '✓ Got it.',
  '✓ That\'s it.',
]

export const WRONG_FEEDBACKS = [
  '✗ Not quite.',
  '✗ Incorrect.',
  '✗ Nope.',
  '✗ Not right.',
  '✗ Missed.',
  '✗ Wrong.',
]

export const TYPE_LABEL: Record<QType, string> = {
  mcq: 'Multiple choice',
  tf: 'True / False',
  fill: 'Fill in blank',
  match: 'Match columns',
  recall: 'Free recall',
  explain: 'Explanation',
  reconstruct: 'Reconstruction',
  abstract: 'Abstract',
  transfer: 'Transfer',
  analogy: 'Analogy',
}

export const DEEP_TYPES: QType[] = ['abstract', 'transfer', 'analogy']

export const DEEP_BONUS_XP = 1.5

export const PHASE_LABEL: Record<Phase, string> = {
  core: 'Core',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  transfer: 'Transfer',
}

export const PHASE_COLOR: Record<Phase, string> = {
  core: 'var(--accent)',
  intermediate: 'var(--green)',
  advanced: 'var(--amber)',
  transfer: 'var(--red)',
}

export const SHORT_TYPE_LABEL: Record<QType, string> = {
  mcq: 'MCQ',
  tf: 'T/F',
  fill: 'Fill',
  match: 'Match',
  recall: 'Recall',
  explain: 'Explain',
  reconstruct: 'Reconstruct',
  abstract: 'Abs.',
  transfer: 'Trf.',
  analogy: 'Alg.',
}

// ── FEMA-1 constants ────────────────────────────────────────────────────────
// How many consecutive correct answers are needed to climb one rung
export const FEMA_RUNG_THRESHOLD = 2

// Intervals (in steps) after mastering each rung before the concept is re-shown
export const FEMA_INTERVALS: Record<number, number> = { 0: 1, 1: 3, 2: 7, 3: 14 }

// Map every question type to a ladder rung
export const FEMA_RUNG_MAP: Record<QType, FemaRung> = {
  mcq:         0,
  tf:          0,
  fill:        1,
  match:       1,
  recall:      1,
  explain:     2,
  reconstruct: 2,
  abstract:    2,
  transfer:    3,
  analogy:     3,
}

// How many questions to show per Phase-A rung during same-session encoding
export const FEMA_PHASE_A_PER_RUNG: Record<number, number> = { 0: 2, 1: 2, 2: 1 }

export const INITIAL_CARD_STATE = {
  interval: 0,
  nextAt: 0,
  ease: 2.5,
  difficulty: 5.0,
  stability: 1.0,
  streak: 0,
  correct: 0,
  wrong: 0,
  seen: false,
}
