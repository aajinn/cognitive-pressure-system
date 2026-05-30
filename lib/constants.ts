import type { QType } from './types'

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

export const INITIAL_SM_ENTRY = {
  interval: 0,
  nextAt: 0,
  ease: 2.5,
  streak: 0,
  correct: 0,
  wrong: 0,
  seen: false,
}
