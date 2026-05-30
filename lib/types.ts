export type QType = 'mcq' | 'tf' | 'fill' | 'match' | 'recall' | 'explain' | 'reconstruct' | 'abstract' | 'transfer' | 'analogy'

export interface Question {
  id: number
  topic: string
  mark: string
  type: QType
  q: string
  options?: string[]
  answer?: number | boolean | string
  answers?: string[]
  keyTerms?: string[]
  blanks?: string[]
  examples?: string[]
  hint?: string
  exp?: string
  pairs?: [string, string][]
}

export interface SMEntry {
  interval: number
  nextAt: number
  ease: number
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

export type Confidence = 'guessing' | 'maybe' | 'confident' | 'certain'

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
