'use client'

import type { WrongItem } from '@/lib/types'
import { findEndMsg } from '@/lib/utils'

interface EndScreenProps {
  correct: number
  wrong: number
  total: number
  wrongItems: WrongItem[]
  onRestart: () => void
}

export default function EndScreen({ correct, wrong, total, wrongItems, onRestart }: EndScreenProps) {
  const pct = total ? Math.round((correct / total) * 100) : 0

  return (
    <div className="end">
      <div className="end-pct">{pct}%</div>
      <div className="end-msg">{findEndMsg(pct)}</div>
      <div className="end-grid">
        <div className="stat"><div className="stat-n" style={{ color: 'var(--green)' }}>{correct}</div><div className="stat-l">Correct</div></div>
        <div className="stat"><div className="stat-n" style={{ color: 'var(--red)' }}>{wrong}</div><div className="stat-l">Wrong</div></div>
        <div className="stat"><div className="stat-n" style={{ color: 'var(--accent2)' }}>{total}</div><div className="stat-l">Total</div></div>
      </div>
      <div className="review-list">
        <h3>Review</h3>
        {wrongItems.length === 0 ? (
          <div style={{ color: 'var(--green)', fontSize: 13, fontFamily: 'var(--font-dm-mono), DM Mono, monospace', padding: '8px 0' }}>
            All clear. No mistakes to review.
          </div>
        ) : (
          wrongItems.map((w, i) => (
            <div key={i} className="review-item">
              <div className="ri-dot" style={{ background: 'var(--red)' }} />
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-dm-mono), DM Mono, monospace', marginBottom: 3 }}>
                  {w.topic}
                </div>
                <div style={{ color: 'var(--text)', marginBottom: 2 }}>{w.q}</div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-dm-mono), DM Mono, monospace', color: 'var(--green)' }}>
                  ✓ {w.correct}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <button className="btn-check" style={{ width: '100%', padding: 14, fontSize: 15 }} onClick={onRestart}>
        Start again →
      </button>
    </div>
  )
}
