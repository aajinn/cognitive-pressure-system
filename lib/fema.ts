/**
 * FEMA-1 — Fast Exam Memory Algorithm
 *
 * Goal: maximise short-term exam retention while preserving medium-term memory.
 *
 * Core principle: every topic is learned in 3 layers — encode, retrieve, space.
 *
 * Ladder rungs (per concept):
 *   0 → Recognition   (MCQ / T/F)
 *   1 → Cued recall    (fill, match, short recall)
 *   2 → Generative     (explain, reconstruct, abstract)
 *   3 → Transfer       (transfer, analogy)
 *
 * Phase-A same-session encoding sequence (first time a concept appears):
 *   2 recognition → 2 cued-recall → 1 generative
 *   After completing Phase A the concept enters normal spaced review.
 *
 * Promotion rule: FEMA_RUNG_THRESHOLD consecutive correct answers on a rung
 * advances the learner to the next rung.  Regression: any wrong answer on a
 * rung > 0 drops back one rung.
 */

import type { Question, FemaState, FemaConceptState, FemaRung } from './types'
import {
  FEMA_RUNG_MAP,
  FEMA_RUNG_THRESHOLD,
  FEMA_INTERVALS,
  FEMA_PHASE_A_PER_RUNG,
} from './constants'
import { shuffle } from './utils'

// ── helpers ──────────────────────────────────────────────────────────────────

function blankConceptState(): FemaConceptState {
  return {
    rung: 0,
    runStreak: 0,
    encodingQueue: [],
    encodingDone: false,
    correct: 0,
    wrong: 0,
    lastStep: 0,
    interval: 1,
    nextAt: 0,
  }
}

/** Group questions by topic and return a map of topic → questions */
function byTopic(questions: Question[]): Map<string, Question[]> {
  const m = new Map<string, Question[]>()
  for (const q of questions) {
    if (!m.has(q.topic)) m.set(q.topic, [])
    m.get(q.topic)!.push(q)
  }
  return m
}

/**
 * Pick up to `n` questions from `pool` that sit on rung `targetRung`.
 * Falls back to the nearest available rung if not enough questions exist.
 */
function pickForRung(
  pool: Question[],
  targetRung: FemaRung,
  n: number,
  usedIds: Set<number>,
): Question[] {
  const candidates = pool
    .filter(q => !usedIds.has(q.id) && FEMA_RUNG_MAP[q.type] === targetRung)
  const shuffled = shuffle(candidates)
  return shuffled.slice(0, n)
}

/**
 * Build the Phase-A encoding sequence for a freshly-introduced topic.
 * Returns an ordered list of question IDs:
 *   [rung-0, rung-0, rung-1, rung-1, rung-2]
 */
export function buildPhaseAQueue(topicQuestions: Question[]): number[] {
  const used = new Set<number>()
  const ids: number[] = []

  const rungs: FemaRung[] = [0, 1, 2]
  for (const rung of rungs) {
    const n = FEMA_PHASE_A_PER_RUNG[rung] ?? 1
    const picked = pickForRung(topicQuestions, rung, n, used)
    for (const q of picked) {
      used.add(q.id)
      ids.push(q.id)
    }
  }
  return ids
}

// ── public API ───────────────────────────────────────────────────────────────

/** Initialise a fresh FemaState from the full question list. */
export function createFema(questions: Question[]): FemaState {
  const state: FemaState = {}
  for (const [topic] of byTopic(questions)) {
    state[topic] = blankConceptState()
  }
  return state
}

/**
 * Record the result of answering question `qid` correctly/incorrectly.
 * Mutates `fema` in place (same pattern as sm2/fsrs).
 * Returns the new step counter.
 */
export function recordResultFema(
  fema: FemaState,
  questions: Question[],
  step: number,
  qid: number,
  correct: boolean,
): number {
  const q = questions.find(q => q.id === qid)
  if (!q) return step + 1

  let cs = fema[q.topic]
  if (!cs) {
    cs = blankConceptState()
    fema[q.topic] = cs
  }

  const qRung = FEMA_RUNG_MAP[q.type]
  cs.lastStep = step

  if (correct) {
    cs.correct++
    // Only advance streak / promote when answering on or above current rung
    if (qRung >= cs.rung) {
      cs.runStreak++
      if (cs.runStreak >= FEMA_RUNG_THRESHOLD && cs.rung < 3) {
        cs.rung = (cs.rung + 1) as FemaRung
        cs.runStreak = 0
      }
    }
    // Grow interval
    cs.interval = Math.min(cs.interval * 2, FEMA_INTERVALS[cs.rung])
  } else {
    cs.wrong++
    cs.runStreak = 0
    // Regress one rung on wrong answer (never below 0)
    if (cs.rung > 0 && qRung >= cs.rung) {
      cs.rung = (cs.rung - 1) as FemaRung
    }
    cs.interval = 1
  }

  cs.nextAt = step + cs.interval
  return step + 1
}

/**
 * Get the ordered due-queue of question IDs for a FEMA session.
 *
 * Priority order:
 *  1. Active Phase-A encoding queues (in order)
 *  2. Due concepts — questions matching the concept's current rung (lowest interval first)
 *  3. New (unseen) concepts — trigger Phase-A
 */
export function getDueQueueFema(
  questions: Question[],
  fema: FemaState,
  step: number,
): number[] {
  const topicMap = byTopic(questions)
  const result: number[] = []
  const addedIds = new Set<number>()

  // ── 1. Drain any in-progress Phase-A encoding queues ──────────────────────
  for (const [, cs] of Object.entries(fema)) {
    if (cs.encodingQueue.length > 0) {
      for (const id of cs.encodingQueue) {
        if (!addedIds.has(id)) {
          result.push(id)
          addedIds.add(id)
        }
      }
    }
  }

  // ── 2. Due concepts sorted by urgency (lowest nextAt first) ────────────────
  const dueTopics = [...topicMap.keys()]
    .filter(topic => {
      const cs = fema[topic]
      return cs && cs.encodingDone && cs.nextAt <= step
    })
    .sort((a, b) => (fema[a]?.nextAt ?? 0) - (fema[b]?.nextAt ?? 0))

  for (const topic of dueTopics) {
    const cs = fema[topic]
    const qs = topicMap.get(topic) ?? []
    // Prefer questions at or just above the current rung
    const rungCandidates = qs
      .filter(q => FEMA_RUNG_MAP[q.type] === cs.rung && !addedIds.has(q.id))
    const fallback = qs
      .filter(q => FEMA_RUNG_MAP[q.type] < cs.rung && !addedIds.has(q.id))
    const pool = [...rungCandidates, ...fallback]
    const shuffled = shuffle(pool)
    for (const q of shuffled.slice(0, 2)) {
      if (!addedIds.has(q.id)) {
        result.push(q.id)
        addedIds.add(q.id)
      }
    }
  }

  // ── 3. New topics — build Phase-A and queue them ──────────────────────────
  const newTopics = [...topicMap.keys()].filter(topic => {
    const cs = fema[topic]
    return !cs || (!cs.encodingDone && cs.encodingQueue.length === 0)
  })

  for (const topic of newTopics) {
    if (!fema[topic]) fema[topic] = blankConceptState()
    const cs = fema[topic]
    const qs = topicMap.get(topic) ?? []
    cs.encodingQueue = buildPhaseAQueue(qs)
    for (const id of cs.encodingQueue) {
      if (!addedIds.has(id)) {
        result.push(id)
        addedIds.add(id)
      }
    }
  }

  return result
}

/**
 * After answering the last item in a Phase-A queue for a topic, mark the
 * encoding as done so the concept enters normal spaced review.
 * Call this whenever an answer is recorded for a question whose topic still
 * has an encodingQueue.
 */
export function maybeFinishPhaseA(
  fema: FemaState,
  qid: number,
  questions: Question[],
  step: number,
): void {
  const q = questions.find(q => q.id === qid)
  if (!q) return
  const cs = fema[q.topic]
  if (!cs || cs.encodingDone) return

  // Remove this id from the encoding queue
  cs.encodingQueue = cs.encodingQueue.filter(id => id !== qid)

  if (cs.encodingQueue.length === 0) {
    cs.encodingDone = true
    cs.nextAt = step + cs.interval
  }
}

/**
 * Compute how many concepts have been promoted all the way to rung 3 (transfer).
 */
export function computeFemaMastered(fema: FemaState): number {
  return Object.values(fema).filter(cs => cs.rung >= 3 && cs.encodingDone).length
}

/**
 * Count concepts that are due for review right now.
 */
export function computeFemaDue(fema: FemaState, step: number): number {
  return Object.values(fema).filter(cs => cs.encodingDone && cs.nextAt <= step).length
}

/**
 * Current rung label for display.
 */
export const FEMA_RUNG_LABEL: Record<FemaRung, string> = {
  0: 'Recognition',
  1: 'Cued Recall',
  2: 'Generative',
  3: 'Transfer',
}
