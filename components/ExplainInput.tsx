'use client'

interface ExplainInputProps {
  value: string
  keyTerms: string[]
  disabled: boolean
  keyTermHighlights: (boolean | null)[] | null
  onChange: (value: string) => void
  onEnter: () => void
}

export default function ExplainInput({ value, keyTerms, disabled, keyTermHighlights, onChange, onEnter }: ExplainInputProps) {
  return (
    <div>
      <textarea
        className="explain-inp"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onEnter() }}
        placeholder="Explain in your own words…"
        rows={4}
        disabled={disabled}
      />
      {keyTermHighlights && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {keyTerms.map((kt, i) => (
            <span
              key={i}
              className={`badge ${keyTermHighlights[i] === null ? 'badge-type' : keyTermHighlights[i] ? 'badge-repeat' : 'badge-topic'}`}
              style={keyTermHighlights[i] === null ? {} : keyTermHighlights[i] ? { background: 'rgba(34,197,94,0.08)', color: 'var(--green)', border: '1px solid var(--green)' } : { background: 'rgba(239,68,68,0.08)', color: 'var(--red)', border: '1px solid var(--red)' }}
            >
              {kt} {keyTermHighlights[i] === null ? '— pending' : keyTermHighlights[i] ? '✓' : '✗'}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
