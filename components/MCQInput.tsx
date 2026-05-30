'use client'

import type { McqHighlight } from '@/lib/types'

interface MCQInputProps {
  options: string[]
  highlight: McqHighlight | null
  disabled: boolean
  onSelect: (index: number) => void
}

export default function MCQInput({ options, highlight, disabled, onSelect }: MCQInputProps) {
  return (
    <div className="options">
      {options.map((o, i) => {
        let cls = 'opt'
        if (highlight) {
          if (i === highlight.correct) cls += ' correct'
          else if (i === highlight.chosen) cls += ' wrong'
        }
        return (
          <button key={i} className={cls} disabled={disabled} onClick={() => onSelect(i)}>
            {o}
          </button>
        )
      })}
    </div>
  )
}
