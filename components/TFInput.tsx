'use client'

import type { TfHighlight } from '@/lib/types'

interface TFInputProps {
  highlight: TfHighlight | null
  disabled: boolean
  onSelect: (value: boolean) => void
}

function tfBtnClass(value: boolean, highlight: TfHighlight | null): string {
  let cls = 'tf-btn'
  if (!highlight) return cls
  if (highlight.correct === value) cls += ' correct'
  else if (highlight.selected === value) cls += ' wrong'
  return cls
}

export default function TFInput({ highlight, disabled, onSelect }: TFInputProps) {
  return (
    <div className="tf-row">
      <button className={tfBtnClass(true, highlight)} disabled={disabled} onClick={() => onSelect(true)}>
        True
      </button>
      <button className={tfBtnClass(false, highlight)} disabled={disabled} onClick={() => onSelect(false)}>
        False
      </button>
    </div>
  )
}
