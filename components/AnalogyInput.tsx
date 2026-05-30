'use client'

interface AnalogyInputProps {
  value: string
  disabled: boolean
  onChange: (v: string) => void
  onEnter: () => void
}

export default function AnalogyInput({ value, disabled, onChange, onEnter }: AnalogyInputProps) {
  return (
    <textarea
      className="explain-inp"
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter' && e.shiftKey) onEnter() }}
      placeholder="What does this remind you of in real life?"
      autoComplete="off"
      disabled={disabled}
    />
  )
}
