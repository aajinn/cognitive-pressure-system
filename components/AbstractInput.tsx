'use client'

interface AbstractInputProps {
  examples: string[]
  value: string
  highlight: boolean | null
  disabled: boolean
  onChange: (v: string) => void
  onEnter: () => void
}

export default function AbstractInput({ examples, value, highlight, disabled, onChange, onEnter }: AbstractInputProps) {
  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-dm-mono), DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
          Examples
        </div>
        {examples.map((ex, i) => (
          <div
            key={i}
            style={{
              background: 'var(--surface3)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '8px 12px',
              marginBottom: 6,
              fontSize: 13,
              lineHeight: 1.5,
              color: 'var(--text)',
            }}
          >
            {i + 1}. {ex}
          </div>
        ))}
      </div>
      <input
        className={`fill-inp${highlight === true ? ' correct' : ''}${highlight === false ? ' wrong' : ''}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onEnter() }}
        placeholder="What idea connects these examples?"
        autoComplete="off"
        disabled={disabled}
        style={{ width: '100%' }}
      />
    </div>
  )
}
