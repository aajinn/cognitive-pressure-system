import type { FeedbackState } from '@/lib/types'

interface FeedbackProps {
  feedback: FeedbackState | null
}

export default function Feedback({ feedback }: FeedbackProps) {
  if (!feedback) return null
  return (
    <div
      className={`feedback show${feedback.ok ? ' ok' : ' bad'}`}
      dangerouslySetInnerHTML={{ __html: feedback.msg }}
    />
  )
}
