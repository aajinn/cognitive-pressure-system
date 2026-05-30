'use client'

import { useMemo } from 'react'
import type { Question } from '@/lib/types'
import { getFullAnswer, getMarksList } from '@/lib/utils'
import { SHORT_TYPE_LABEL } from '@/lib/constants'

interface AllQAModalProps {
  open: boolean
  filter: string
  questions: Question[]
  onClose: () => void
  onFilterChange: (filter: string) => void
}

export default function AllQAModal({ open, filter, questions, onClose, onFilterChange }: AllQAModalProps) {
  const marks = useMemo(() => getMarksList(questions), [questions])

  const filtered = useMemo(
    () => filter === 'all' ? questions : questions.filter(q => q.mark === filter),
    [questions, filter],
  )

  return (
    <div
      className={`modal-overlay ${open ? 'show' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">All questions</span>
          <button className="modal-close" onClick={onClose}>✕ Close</button>
        </div>
        <div className="modal-filter">
          {marks.map(m => (
            <button
              key={m}
              className={`filter-btn${m === filter ? ' active' : ''}`}
              onClick={() => onFilterChange(m)}
            >
              {m === 'all' ? 'All' : m}
            </button>
          ))}
        </div>
        <div className="modal-body">
          {filtered.map(q => {
            const ans = getFullAnswer(q)
            return (
              <div key={q.id} className="qa-card">
                <div className="qa-card-head">
                  <span className="badge badge-topic">{q.topic}</span>
                  <span className="badge badge-type">{q.mark}</span>
                  <span className="badge badge-type">{SHORT_TYPE_LABEL[q.type]}</span>
                  <span className="qa-num">#{q.id + 1}</span>
                </div>
                <div className="qa-card-q">{q.q}</div>
                <div className="qa-card-a" dangerouslySetInnerHTML={{ __html: `✓ ${ans}` }} />
                {q.exp && <div className="qa-card-exp">Rationale: {q.exp}</div>}
                {q.hint && <div className="qa-card-exp">Hint: {q.hint}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
