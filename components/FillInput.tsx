'use client'

interface FillInputProps {
  blanks: string[]
  values: string[]
  highlight: boolean[] | null
  disabled: boolean
  onChange: (index: number, value: string) => void
  onEnter: () => void
}

export default function FillInput({ blanks, values, highlight, disabled, onChange, onEnter }: FillInputProps) {
  return (
    <div className="fill-wrap">
      {blanks.map((_, i) => {
        let cls = 'fill-inp'
        if (highlight) cls += highlight[i] ? ' correct' : ' wrong'
        return (
          <input
            key={i}
            className={cls}
            value={values[i] || ''}
            onChange={e => onChange(i, e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onEnter() }}
            placeholder={`Answer ${i + 1}…`}
            autoComplete="off"
            disabled={disabled}
          />
        )
      })}
    </div>
  )
}
