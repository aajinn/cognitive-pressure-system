'use client'

import type { QType } from '@/lib/types'

interface ActionButtonsProps {
  type: QType
  answered: boolean
  hasInput: boolean
  onCheck: () => void
  onNext: () => void
}

export default function ActionButtons({
  type,
  answered,
  hasInput,
  onCheck,
  onNext,
}: ActionButtonsProps) {
  const showCheck = (type === 'fill' || type === 'match' || type === 'recall' || type === 'explain' || type === 'reconstruct' || type === 'abstract' || type === 'transfer' || type === 'analogy') && !answered
  const showNext = answered

  return (
    <div className="actions">
      {showCheck && (
          <button className="btn-check" onClick={onCheck} disabled={!hasInput}>
            Check
          </button>
      )}
      {showNext && (
        <button className="btn-next" onClick={onNext}>Next →</button>
      )}
    </div>
  )
}
