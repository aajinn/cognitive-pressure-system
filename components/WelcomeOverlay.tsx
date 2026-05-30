'use client'

import { useState, useCallback } from 'react'

const STEPS = [
  {
    icon: '?',
    title: 'Answer questions',
    desc: 'You\'ll be shown questions across different topics. Each one tests a different aspect of understanding — from recall to application.',
  },
  {
    icon: '↻',
    title: 'Recall before seeing',
    desc: 'After seeing a question once, the next time it appears you\'ll try to recall the answer from memory first. This is the most effective way to strengthen retention.',
  },
  {
    icon: '⏱',
    title: 'Optimized timing',
    desc: 'Your answers schedule the next review at the optimal time for memory. Correct answers space further apart; tough ones return sooner.',
  },
]

interface WelcomeOverlayProps {
  onDismiss: () => void
}

export default function WelcomeOverlay({ onDismiss }: WelcomeOverlayProps) {
  const [step, setStep] = useState(0)

  const next = useCallback(() => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else onDismiss()
  }, [step, onDismiss])

  const s = STEPS[step]

  return (
    <div className="modal-overlay show" style={{ zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        className="card"
        style={{
          maxWidth: 420,
          width: '100%',
          textAlign: 'center',
          padding: '36px 28px 28px',
          animation: 'cardIn .35s ease',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--surface3)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            margin: '0 auto 16px',
            color: 'var(--accent2)',
          }}
        >
          {s.icon}
        </div>

        <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-dm-mono), DM Mono, monospace', marginBottom: 8 }}>
          {step + 1} of {STEPS.length}
        </div>

        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>
          {s.title}
        </div>

        <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--muted)', marginBottom: 28 }}>
          {s.desc}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: i === step ? 'var(--accent)' : 'var(--border)',
                transition: 'background .2s',
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <button className="btn-check" onClick={next} style={{ padding: '12px 36px', fontSize: 15 }}>
            {step < STEPS.length - 1 ? 'Next →' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  )
}
