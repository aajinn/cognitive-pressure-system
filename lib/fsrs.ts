import type { Question, CardState } from './types'
import { INITIAL_CARD_STATE } from './constants'

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

export function retrievability(elapsed: number, stability: number): number {
  if (stability <= 0) return 1
  return Math.pow(2, -elapsed / stability)
}

export function getRetrievability(card: CardState, step: number): number {
  if (!card.seen) return 1
  const lastReview = card.nextAt - card.interval
  const elapsed = Math.max(0, step - lastReview)
  return retrievability(elapsed, card.stability)
}

export function createFSRS(questions: Question[]): Record<number, CardState> {
  const sm: Record<number, CardState> = {}
  questions.forEach(q => {
    sm[q.id] = { ...INITIAL_CARD_STATE }
  })
  return sm
}

export function recordResultFSRS(
  sm: Record<number, CardState>,
  step: number,
  qid: number,
  correct: boolean,
): number {
  const s = sm[qid]
  s.seen = true

  const lastReview = s.nextAt - s.interval
  const elapsed = Math.max(0, step - lastReview)
  const R = retrievability(elapsed, s.stability)

  if (correct) {
    s.correct++
    s.streak++
    const boost = (11 - s.difficulty) * (1 / Math.max(R, 0.01) - 1)
    s.stability = s.stability * (1 + 0.3 * boost)
    s.difficulty = clamp(s.difficulty - 0.1, 1, 10)
  } else {
    s.wrong++
    s.streak = 0
    s.stability = Math.max(0.1, s.stability * 0.5 * R)
    s.difficulty = clamp(s.difficulty + 0.5, 1, 10)
  }

  s.interval = Math.max(1, Math.round(s.stability))
  s.nextAt = step + s.interval
  return step + 1
}

export function getDueQueueFSRS(
  questions: Question[],
  sm: Record<number, CardState>,
  step: number,
): number[] {
  const due = questions
    .filter(q => sm[q.id]?.nextAt <= step && sm[q.id]?.seen)
    .sort((a, b) => {
      const rA = getRetrievability(sm[a.id], step)
      const rB = getRetrievability(sm[b.id], step)
      return rA - rB
    })
    .map(q => q.id)

  const fresh = questions
    .filter(q => !sm[q.id]?.seen)
    .map(q => q.id)

  return [...due, ...fresh]
}
