import type { Question } from '@/lib/types'
import { getFullAnswer } from '@/lib/utils'

interface QAPanelProps {
  question: Question
  open: boolean
}

export default function QAPanel({ question, open }: QAPanelProps) {
  return (
    <div className={`qa-panel ${open ? 'show' : ''}`}>
      <div className="qa-section">
        <div className="qa-label">Question</div>
        <div className="qa-content">{question.q}</div>
      </div>
      <div className="qa-section">
        <div className="qa-label">Answer</div>
        <div className="qa-answer" dangerouslySetInnerHTML={{ __html: getFullAnswer(question) }} />
      </div>
      {question.exp && (
        <div className="qa-section">
          <div className="qa-label">Why</div>
          <div className="qa-content" style={{ color: 'var(--muted)' }}>{question.exp}</div>
        </div>
      )}
    </div>
  )
}
