'use client'

import { useCallback, useRef, useState } from 'react'

interface StatsBarProps {
  done: number
  correct: number
  wrong: number
  due: number
  streak: number
}

export default function StatsBar({ done, correct, wrong, due, streak }: StatsBarProps) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const toggle = useCallback(() => setOpen(o => !o), [])

  const hide = useCallback(() => {
    setHidden(true)
    setOpen(false)
  }, [])

  const show = useCallback(() => {
    setHidden(false)
    setOpen(false)
  }, [])

  const handleBlur = useCallback((e: React.FocusEvent) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false)
  }, [])

  if (hidden) {
    return (
      <div className="stats" style={{ position: 'relative', border: 0, marginBottom: 18 }}>
        <div className="stats-menu" ref={ref} onBlur={handleBlur} tabIndex={-1}>
          <button className="stats-menu-btn" onClick={toggle} title="Menu">⋮</button>
          {open && (
            <div className="stats-dropdown">
              <button className="stats-dropdown-item" onClick={show}>Show stats</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="stats">
      <div className="stat"><div className="stat-n">{done}</div><div className="stat-l">Processed</div></div>
      <div className="stat"><div className="stat-n" style={{ color: 'var(--green)' }}>{correct}</div><div className="stat-l">Correct</div></div>
      <div className="stat"><div className="stat-n" style={{ color: 'var(--red)' }}>{wrong}</div><div className="stat-l">Wrong</div></div>
      <div className="stat"><div className="stat-n" style={{ color: 'var(--amber)' }}>{due}</div><div className="stat-l">Due</div></div>
      {done >= 3 && (
        <div className="stat" style={{ borderColor: 'var(--red)', opacity: 0.7 }}>
          <div className="stat-n" style={{ color: 'var(--red)', fontSize: 11 }}>{streak}</div>
          <div className="stat-l">Streak</div>
        </div>
      )}
      <div className="stats-menu" ref={ref} onBlur={handleBlur} tabIndex={-1}>
        <button className="stats-menu-btn" onClick={toggle} title="Menu">⋮</button>
        {open && (
          <div className="stats-dropdown">
            <button className="stats-dropdown-item" onClick={hide}>Hide stats</button>
          </div>
        )}
      </div>
    </div>
  )
}
