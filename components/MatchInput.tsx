'use client'

import { useMemo } from 'react'
import { shuffle } from '@/lib/utils'

interface MatchInputProps {
  pairs: [string, string][]
  values: string[]
  highlight: boolean[] | null
  disabled: boolean
  onChange: (index: number, value: string) => void
}

export default function MatchInput({ pairs, values, highlight, disabled, onChange }: MatchInputProps) {
  const rights = useMemo(() => shuffle(pairs.map(p => p[1])), [pairs])

  return (
    <>
      {pairs.map((p, i) => {
        let selCls = 'match-sel'
        if (highlight) selCls += highlight[i] ? ' correct' : ' wrong'
        return (
          <div key={i} className="match-row">
            <div className="match-left">{p[0]}</div>
            <select
              className={selCls}
              value={values[i] || ''}
              onChange={e => onChange(i, e.target.value)}
              disabled={disabled}
            >
              <option value="">— select —</option>
              {rights.map((r, j) => <option key={r + '-' + j} value={r}>{r}</option>)}
            </select>
          </div>
        )
      })}
    </>
  )
}
