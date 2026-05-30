'use client'

interface RecallInputProps {
  value: string
  highlight: boolean | null
  disabled: boolean
  onChange: (value: string) => void
  onEnter: () => void
}

export default function RecallInput({ value, highlight, disabled, onChange, onEnter }: RecallInputProps) {
  let cls = 'fill-inp'
  if (highlight === true) cls += ' correct'
  else if (highlight === false) cls += ' wrong'

  return (
    <div className="fill-wrap">
      <input
        className={cls}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onEnter() }}
        placeholder="Type your answer…"
        autoComplete="off"
        disabled={disabled}
      />
    </div>
  )
}
