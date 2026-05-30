import type { RecallSeg } from '@/lib/types'

interface RecallBarProps {
  segs: RecallSeg[]
}

export default function RecallBar({ segs }: RecallBarProps) {
  return (
    <div className="recall-bar">
      <span className="recall-label">Progress</span>
      <div style={{ display: 'flex', flex: 1, gap: 3 }}>
        {segs.map((seg, i) => (
          <div key={i} className={seg.cls} title={seg.title} />
        ))}
      </div>
    </div>
  )
}
