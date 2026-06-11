export type QType = 'mcq' | 'tf' | 'fill' | 'match' | 'recall' | 'explain' | 'reconstruct' | 'abstract' | 'transfer' | 'analogy'

export type Phase = 'core' | 'intermediate' | 'advanced' | 'transfer'

export const PHASE_ORDER: Phase[] = ['core', 'intermediate', 'advanced', 'transfer']

export interface Question {
  id: number
  topic: string
  mark: string
  type: QType
  phase?: Phase
  q: string
  options?: string[]
  answer?: number | boolean | string
  answers?: string[]
  keyTerms?: string[]
  blanks?: string[]
  fillParts?: string[]
  examples?: string[]
  hint?: string
  exp?: string
  pairs?: [string, string][]
}

export interface CardState {
  interval: number
  nextAt: number
  ease: number
  difficulty: number
  stability: number
  streak: number
  correct: number
  wrong: number
  seen: boolean
}

export interface WrongItem {
  topic: string
  q: string
  user: string
  correct: string
}

export interface FeedbackState {
  ok: boolean
  msg: string
}

export type QuizScreen = 'quiz' | 'end'

export interface McqHighlight {
  chosen: number
  correct: number
}

export interface TfHighlight {
  selected: boolean | null
  correct: boolean
}

export interface RecallSeg {
  cls: string
  title: string
}

export interface Relation {
  from: number
  to: number
  label: string
}

export interface HierarchyEdge {
  from: number
  to: number
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface TopicMastery {
  topic: string
  total: number
  mastered: number
  pct: number
}

export interface KnowledgeGain {
  xp: number
  message: string
}

export type AlgorithmType = 'sm2' | 'fsrs' | 'fema'

// ── FEMA-1 ──────────────────────────────────────────────────────────────────
// Ladder rung for a concept: 0=recognition, 1=cued, 2=generative, 3=transfer
export type FemaRung = 0 | 1 | 2 | 3

// Maps QType to which ladder rung it belongs to
export type FemaRungs = Record<string, FemaRung>

export interface FemaConceptState {
  /** Current rung the learner is on (0–3) */
  rung: FemaRung
  /** Consecutive correct answers on the current rung */
  runStreak: number
  /** Phase-A encoding sequence still to show (question ids, in order) */
  encodingQueue: number[]
  /** Whether Phase-A encoding for this concept has been triggered */
  encodingDone: boolean
  /** Total correct answers across all rungs */
  correct: number
  /** Total wrong answers across all rungs */
  wrong: number
  /** Step at which this concept was last reviewed */
  lastStep: number
  /** Spaced-repetition interval in steps */
  interval: number
  /** Next step at which this concept is due */
  nextAt: number
}

/** Full FEMA state: one entry per base-concept (using the topic string as key) */
export type FemaState = Record<string, FemaConceptState>
