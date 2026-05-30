'use client'

import type { Question, McqHighlight, TfHighlight, FeedbackState, Confidence, Difficulty } from '@/lib/types'
import { TYPE_LABEL } from '@/lib/constants'
import { formatQHtml } from '@/lib/utils'

import MatchInput from './MatchInput'

interface QuestionCardProps {
  question: Question
  answered: boolean
  isRepeat: boolean
  seen: boolean
  streak: number
  fillValues: string[]
  matchValues: string[]
  recallValue: string
  explainValue: string
  explainKeyTermHighlights: (boolean | null)[] | null
  mcqHighlight: McqHighlight | null
  tfHighlight: TfHighlight | null
  fillHighlight: boolean[] | null
  matchHighlight: boolean[] | null
  recallHighlight: boolean | null
  abstractValue: string
  abstractHighlight: boolean | null
  analogyValue: string
  analogyHighlight: boolean | null
  feedback: FeedbackState | null
  shuffledMatchRights: string[] | null
  onMCQ: (i: number) => void
  onTF: (v: boolean) => void
  onFillChange: (i: number, v: string) => void
  onFillEnter: () => void
  onMatchChange: (i: number, v: string) => void
  onRecallChange: (v: string) => void
  onRecallEnter: () => void
  onExplainChange: (v: string) => void
  onExplainEnter: () => void
  onAbstractChange: (v: string) => void
  onAbstractEnter: () => void
  onAnalogyChange: (v: string) => void
  onAnalogyEnter: () => void
  onCheck: () => void
  onNext: () => void
  onJumpTo: (id: number) => void

  topicPath: string
  masteryPct: number
  questionPosition: string
  difficulty: Difficulty
  confidenceTrend: string
  confidence: Confidence | null
  onConfidenceChange: (c: Confidence) => void
  xp: number
  knowledgeGain: number
  showHintReveal: boolean
  showRelatedConcept: boolean
  showExample: boolean
  onHint: () => void
  onRelatedConcept: () => void
  onExample: () => void
  contextReasons: string[]
  relatedTopics: { id: number; topic: string; type: 'prereq' | 'related' }[]
  afterAnswer: {
    correct: boolean
    xpGained: number
    explanation: string
    commonConfusion?: string
    relatedConcepts: string[]
    nextRecommended: string
  } | null
}

function currentInput(q: Question, fillValues: string[], matchValues: string[], recallValue: string, explainValue: string, abstractValue: string, analogyValue: string): string {
  switch (q.type) {
    case 'fill': case 'reconstruct': return fillValues.join('')
    case 'match': return matchValues.join('')
    case 'recall': return recallValue
    case 'explain': case 'transfer': return explainValue
    case 'abstract': return abstractValue
    case 'analogy': return analogyValue
    default: return ''
  }
}

function charCount(q: Question, props: QuestionCardProps): number {
  return currentInput(q, props.fillValues, props.matchValues, props.recallValue, props.explainValue, props.abstractValue, props.analogyValue).length
}

const CONFIDENCE_LEVELS: { value: Confidence; label: string; sub: string }[] = [
  { value: 'guessing', label: 'Guessing', sub: 'No idea' },
  { value: 'maybe', label: 'Maybe', sub: 'Not sure' },
  { value: 'confident', label: 'Confident', sub: 'Pretty sure' },
  { value: 'certain', label: 'Certain', sub: 'Absolutely' },
]

export default function QuestionCard(props: QuestionCardProps) {
  const { question, answered, feedback, afterAnswer } = props

  const hasTextInput = question.type === 'fill' || question.type === 'reconstruct' || question.type === 'recall' || question.type === 'explain' || question.type === 'transfer' || question.type === 'abstract' || question.type === 'analogy'
  const textInputLen = charCount(question, props)

  function handleCheck() {
    if (!answered) props.onCheck()
  }

  return (
    <div className={answered && afterAnswer ? 'glass-card-static' : 'glass-card'}>
      {/* ── header ── */}
      <div className="learning-header">
        <div className="topic-path">
          {props.topicPath} <span>{question.topic}</span>
        </div>
        <div className="badge-glass">{TYPE_LABEL[question.type]}</div>
        <span className={`badge-difficulty ${props.difficulty}`}>
          {props.difficulty}
        </span>
        <div className="header-right">
          <div className="mastery-ring">
            <span className="mastery-ring-value">{props.masteryPct}%</span>
            <span className="mastery-ring-text">mastered</span>
          </div>
          <span className="question-position">{props.questionPosition}</span>
          {props.confidenceTrend && (
            <span className="confidence-trend">{props.confidenceTrend}</span>
          )}
        </div>
      </div>

      {/* ── question text ── */}
      <div className="q-text-premium" dangerouslySetInnerHTML={{ __html: formatQHtml(question) }} />

      {question.hint && !answered && (
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, fontFamily: 'var(--font-dm-mono), DM Mono, monospace' }}>
          Hint: {question.hint}
        </div>
      )}

      {/* ── context panel ── */}
      {!answered && props.contextReasons.length > 0 && (
        <div className="context-panel">
          <div className="context-panel-title">Why am I seeing this?</div>
          {props.contextReasons.map((r, i) => (
            <div key={i} className="context-panel-item">{r}</div>
          ))}
        </div>
      )}

      {/* ── answer area ── */}
      {!answered && (
        <>
          {hasTextInput && (
            <textarea
              className="answer-input-premium"
              value={currentInput(question, props.fillValues, props.matchValues, props.recallValue, props.explainValue, props.abstractValue, props.analogyValue)}
              onChange={e => {
                const v = e.target.value
                const q = question
                if (q.type === 'recall') props.onRecallChange(v)
                else if (q.type === 'explain' || q.type === 'transfer') props.onExplainChange(v)
                else if (q.type === 'abstract') props.onAbstractChange(v)
                else if (q.type === 'analogy') props.onAnalogyChange(v)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleCheck()
              }}
              placeholder={
                question.type === 'recall' ? 'Type your answer…' :
                question.type === 'explain' || question.type === 'transfer' ? 'Explain in your own words…' :
                question.type === 'abstract' ? 'What idea connects these examples?' :
                question.type === 'analogy' ? 'What does this remind you of in real life?' :
                'Your answer…'
              }
              disabled={answered}
              rows={3}
            />
          )}
          {question.type === 'match' && (
            <MatchInput pairs={question.pairs!} values={props.matchValues} highlight={props.matchHighlight} disabled={answered} onChange={props.onMatchChange} />
          )}
          {(question.type === 'fill' || question.type === 'reconstruct') && (
            <div className="fill-wrap">
              {question.blanks!.map((_, i) => (
                <input
                  key={i}
                  className={`fill-inp${props.fillHighlight ? (props.fillHighlight[i] ? ' correct' : ' wrong') : ''}`}
                  value={props.fillValues[i] || ''}
                  onChange={e => props.onFillChange(i, e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCheck() }}
                  placeholder={`Answer ${i + 1}…`}
                  autoComplete="off"
                  disabled={answered}
                />
              ))}
            </div>
          )}

          <div className="char-count">{textInputLen} chars</div>

          {/* ── confidence ── */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 4 }}>
              How confident are you?
            </div>
            <div className="confidence-grid">
              {CONFIDENCE_LEVELS.map(cl => (
                <button
                  key={cl.value}
                  className={`confidence-btn${props.confidence === cl.value ? ' active' : ''}`}
                  onClick={() => props.onConfidenceChange(cl.value)}
                >
                  <div className="confidence-btn-label">{cl.label}</div>
                  <div className="confidence-btn-sub">{cl.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── help section ── */}
          <div className="help-row">
            {question.hint && (
              <button className="help-btn" onClick={props.onHint}>
                Hint <span className="cost">−5 XP</span>
              </button>
            )}
            {props.relatedTopics.length > 0 && (
              <button className="help-btn" onClick={props.onRelatedConcept}>
                Related concept
              </button>
            )}
            {question.examples && (
              <button className="help-btn" onClick={props.onExample}>
                Example
              </button>
            )}
          </div>

          {props.showHintReveal && question.hint && (
            <div className="help-content">{question.hint}</div>
          )}

          {props.showRelatedConcept && props.relatedTopics.length > 0 && (
            <div className="help-content" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {props.relatedTopics.map(rt => (
                <button key={rt.id} className="chip" onClick={() => props.onJumpTo(rt.id)}>
                  {rt.topic}
                </button>
              ))}
            </div>
          )}

          {props.showExample && question.examples && (
            <div className="help-content">
              {question.examples.map((ex, i) => (
                <div key={i} style={{ marginBottom: i < question.examples!.length - 1 ? 6 : 0 }}>
                  {i + 1}. {ex}
                </div>
              ))}
            </div>
          )}

          {/* ── related knowledge ── */}
          {props.relatedTopics.length > 0 && (
            <div className="related-section">
              <div className="related-label">
                {props.relatedTopics.some(rt => rt.type === 'prereq') ? 'Prerequisites' : 'Related'}
              </div>
              <div className="related-chips">
                {props.relatedTopics.map(rt => (
                  <button key={rt.id} className="chip" onClick={() => props.onJumpTo(rt.id)}>
                    {rt.topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── action bar ── */}
          <div className="action-bar">
            <button className="btn-secondary">Skip</button>
            <button
              className="btn-primary"
              onClick={handleCheck}
              disabled={hasTextInput && textInputLen === 0}
            >
              Check Answer
            </button>
          </div>
        </>
      )}

      {/* ── after answer ── */}
      {answered && afterAnswer && (
        <div>
          {/* result banner */}
          <div className={`result-banner ${afterAnswer.correct ? 'ok' : 'bad'}`}>
            <div className="result-icon">{afterAnswer.correct ? '✓' : '✗'}</div>
            <div className="result-text">
              <div className="result-status">{afterAnswer.correct ? 'Correct' : 'Not quite'}</div>
              <div className="result-xp">Knowledge Gain: +{afterAnswer.xpGained} XP</div>
            </div>
          </div>

          {/* explanation */}
          {afterAnswer.explanation && (
            <div className="explanation-block">
              <div className="explanation-block-title">Why?</div>
              <div className="explanation-block-body">{afterAnswer.explanation}</div>
            </div>
          )}

          {/* common confusion */}
          {afterAnswer.commonConfusion && (
            <div className="common-confusion">
              <div className="common-confusion-title">Common Confusion</div>
              <div className="common-confusion-body">{afterAnswer.commonConfusion}</div>
            </div>
          )}

          {/* related concepts */}
          {afterAnswer.relatedConcepts.length > 0 && (
            <div className="related-section">
              <div className="related-label">Related Concepts</div>
              <div className="related-chips">
                {afterAnswer.relatedConcepts.map((rc, i) => (
                  <span key={i} className="chip-static">{rc}</span>
                ))}
              </div>
            </div>
          )}

          {/* next recommendation */}
          {afterAnswer.nextRecommended && (
            <div className="next-question-suggest">
              <div className="next-question-suggest-title">Next recommended</div>
              <div className="next-question-suggest-body">{afterAnswer.nextRecommended}</div>
            </div>
          )}

          {/* action */}
          <div className="action-bar">
            <button className="btn-primary" onClick={props.onNext} style={{ flex: 1 }}>
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ── legacy feedback fallback ── */}
      {answered && !afterAnswer && feedback && (
        <div
          className={`feedback show${feedback.ok ? ' ok' : ' bad'}`}
          dangerouslySetInnerHTML={{ __html: feedback.msg }}
        />
      )}
    </div>
  )
}
