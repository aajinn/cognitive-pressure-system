'use client'

interface GenerationPhaseProps {
  value: string
  feedback: { ok: boolean; msg: string } | null
  genChecked: boolean
  onChange: (v: string) => void
  onCheck: () => void
  onContinue: () => void
}

export default function GenerationPhase({
  value,
  feedback,
  genChecked,
  onChange,
  onCheck,
  onContinue,
}: GenerationPhaseProps) {
  const hasContent = value.trim().length > 0

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-dm-mono), DM Mono, monospace', marginBottom: 8 }}>
          {genChecked ? 'You recalled:' : 'Try to recall the answer from memory:'}
        </div>
        <input
          className="fill-inp"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="What do you remember?"
          autoComplete="off"
          disabled={genChecked}
          style={{ width: '100%' }}
        />
      </div>

      {feedback && (
        <div
          className={`feedback show${feedback.ok ? ' ok' : ' bad'}`}
          style={{ display: 'block', marginBottom: 12 }}
          dangerouslySetInnerHTML={{ __html: feedback.msg }}
        />
      )}

      <div className="actions">
        {!genChecked && (
          <button className="btn-check" onClick={onCheck} disabled={!hasContent}>
            {hasContent ? 'Check' : 'Type something first'}
          </button>
        )}
        {genChecked && (
          <button className="btn-next" onClick={onContinue} style={{ width: '100%' }}>
            Show question →
          </button>
        )}
      </div>
    </>
  )
}
