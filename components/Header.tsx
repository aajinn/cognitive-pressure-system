'use client'

interface HeaderProps {
  step: number
  done: number
  onOpenQA: () => void
}

export default function Header({ step, done, onOpenQA }: HeaderProps) {
  return (
    <div className="header">
      <div className="logo">Cognitive<span>Pressure</span><span>System</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="btn-all-qa" onClick={onOpenQA}>📋 All questions</button>
        <div className="session-info">{done} answered</div>
      </div>
    </div>
  )
}
