'use client'

import { useMemo } from 'react'
import type { Question } from '@/lib/types'
import { ALL_Q } from '@/lib/questions'
import { HIERARCHY } from '@/lib/relations'

interface ConceptGraphProps {
  question: Question
  onJumpTo: (id: number) => void
}

function buildChain(id: number, edges: { from: number; to: number }[], forward: boolean): number[] {
  const result: number[] = []
  const visited = new Set<number>()
  let current = id

  for (let i = 0; i < 20; i++) {
    visited.add(current)
    const next = forward
      ? edges.find(e => e.from === current && !visited.has(e.to))
      : edges.find(e => e.to === current && !visited.has(e.from))
    if (!next) break
    current = forward ? next.to : next.from
    if (current === id) break
    result.push(current)
  }

  return result
}

export default function ConceptGraph({ question, onJumpTo }: ConceptGraphProps) {
  const { prereqs, dependents } = useMemo(() => {
    const p = buildChain(question.id, HIERARCHY, false)
    const d = buildChain(question.id, HIERARCHY, true)
    return { prereqs: p, dependents: d }
  }, [question])

  if (prereqs.length === 0 && dependents.length === 0) return null

  const qById = (id: number) => ALL_Q.find(q => q.id === id)

  const renderChain = (items: number[], label: string) => {
    if (items.length === 0) return null
    return (
      <div style={{ marginBottom: dependents.length > 0 && label === 'Prerequisites' ? 10 : 0 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-dm-mono), DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          {items.map((id, i) => {
            const q = qById(id)
            if (!q) return null
            return (
              <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {i > 0 && <span style={{ color: 'var(--muted)', fontSize: 13 }}>→</span>}
                <button
                  onClick={() => onJumpTo(id)}
                  style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-dm-mono), DM Mono, monospace',
                    color: 'var(--accent2)',
                    background: 'var(--surface3)',
                    border: '1px solid var(--faint)',
                    borderRadius: 99,
                    padding: '3px 9px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'border-color .15s, background .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--surface2)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--faint)'; e.currentTarget.style.background = 'var(--surface3)' }}
                >
                  {q.topic}
                </button>
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginTop: 14, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
      <div style={{ fontSize: 10, fontFamily: 'var(--font-dm-mono), DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
        Related topics
      </div>
      {renderChain(prereqs, 'Prerequisites')}
      {renderChain(dependents, 'Next topics')}
    </div>
  )
}
