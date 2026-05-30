import type { Question, SMEntry } from './types'
import { shuffle } from './utils'

export function createSM(questions: Question[]): Record<number, SMEntry> {
  const sm: Record<number, SMEntry> = {}
  questions.forEach(q => {
    sm[q.id] = { interval: 0, nextAt: 0, ease: 2.5, streak: 0, correct: 0, wrong: 0, seen: false }
  })
  return sm
}

export function recordResult(
  sm: Record<number, SMEntry>,
  step: number,
  qid: number,
  correct: boolean,
): number {
  const s = sm[qid]
  s.seen = true
  if (correct) {
    s.correct++
    s.streak++
    if (s.streak === 1) s.interval = 1
    else if (s.streak === 2) s.interval = 3
    else s.interval = Math.round(s.interval * s.ease)
    s.ease = Math.min(2.5 + 0.1 * (s.streak - 1), 3.0)
  } else {
    s.wrong++
    s.streak = 0
    s.interval = 1
    s.ease = Math.max(s.ease - 0.2, 1.3)
  }
  s.nextAt = step + s.interval
  return step + 1
}

export function getDueQueue(
  questions: Question[],
  sm: Record<number, SMEntry>,
  step: number,
): number[] {
  const due = shuffle(
    questions.filter(q => sm[q.id]?.nextAt <= step && sm[q.id]?.seen).map(q => q.id),
  )
  const fresh = shuffle(
    questions.filter(q => !sm[q.id]?.seen).map(q => q.id),
  )
  return [...due, ...fresh]
}

export function isSessionComplete(
  questions: Question[],
  sm: Record<number, SMEntry>,
  step: number,
): boolean {
  const allSeen = questions.every(q => sm[q.id]?.seen)
  const noneDue = questions.every(q => (sm[q.id]?.nextAt ?? Infinity) > step)
  return allSeen && noneDue
}

export function computeDueCount(
  questions: Question[],
  sm: Record<number, SMEntry>,
  step: number,
): number {
  return questions.filter(
    q => sm[q.id]?.seen && sm[q.id]?.nextAt <= step && sm[q.id]?.streak === 0,
  ).length
}

export function computeMasteredCount(
  questions: Question[],
  sm: Record<number, SMEntry>,
): number {
  return questions.filter(q => sm[q.id]?.streak >= 2).length
}
