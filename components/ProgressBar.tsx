interface ProgressBarProps {
  pct: number
}

export default function ProgressBar({ pct }: ProgressBarProps) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}
