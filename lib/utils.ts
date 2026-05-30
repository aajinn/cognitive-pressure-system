import type { Question } from './types'
import { END_MSGS, CORRECT_FEEDBACKS, WRONG_FEEDBACKS } from './constants'
 
export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function getFullAnswer(q: Question): string {
  switch (q.type) {
    case 'mcq':
      return q.options![q.answer as number]
    case 'tf':
      return q.answer ? 'True' : 'False'
    case 'fill':
      return q.blanks!.join(' / ')
    case 'match':
      return q.pairs!.map(p => `${p[0]} → ${p[1]}`).join('<br>')
    case 'recall':
      return q.answers!.join(' / ')
    case 'explain':
      return `${q.answer as string} (key terms: ${q.keyTerms!.join(', ')})`
    case 'reconstruct':
      return q.blanks!.join(' / ')
    case 'abstract':
      return q.answers!.join(' / ')
    case 'transfer':
      return `${q.answer as string} (key terms: ${q.keyTerms!.join(', ')})`
    case 'analogy':
      return q.answer ? String(q.answer) : 'Analogy (open-ended)'
  }
}

export function formatQHtml(q: Question): string {
  if (q.type === 'fill' || q.type === 'reconstruct') {
    let text = q.q
    q.blanks!.forEach(() => {
      text = text.replace('_____', '<span class="blank-span">?</span>')
    })
    return text
  }
  return q.q
}

export function checkRecall(input: string, answers: string[]): boolean {
  const val = input.trim().toLowerCase()
  if (!val) return false
  return answers.some(a => {
    const exp = a.toLowerCase()
    return val === exp || exp.includes(val) || val.includes(exp)
  })
}

export const checkAbstract = checkRecall

export function checkGeneration(input: string, q: Question): { correct: boolean; correctAnswer: string } {
  const val = input.trim().toLowerCase()
  if (!val) return { correct: false, correctAnswer: getFullAnswer(q) }

  switch (q.type) {
    case 'mcq': {
      const correctOpt = q.options![q.answer as number]
      const exp = correctOpt.toLowerCase()
      const ok = val === exp || exp.includes(val) || val.includes(exp)
      return { correct: ok, correctAnswer: correctOpt }
    }
    case 'tf': {
      const isTrue = val === 'true' || val === 't'
      const isFalse = val === 'false' || val === 'f'
      const ok = q.answer ? isTrue : isFalse
      return { correct: ok, correctAnswer: q.answer ? 'True' : 'False' }
    }
    case 'fill':
    case 'reconstruct':
      return {
        correct: q.blanks!.some(b => {
          const exp = b.toLowerCase()
          return val === exp || exp.includes(val) || val.includes(exp)
        }),
        correctAnswer: q.blanks!.join(' / '),
      }
    case 'match':
      return { correct: false, correctAnswer: getFullAnswer(q) }
    case 'recall':
      return { correct: checkRecall(input, q.answers!), correctAnswer: q.answers!.join(' / ') }
    case 'explain': {
      const { allFound } = checkExplain(input, q.keyTerms!)
      return { correct: allFound, correctAnswer: q.answer as string }
    }
    case 'abstract':
      return { correct: checkRecall(input, q.answers!), correctAnswer: q.answers!.join(' / ') }
    case 'transfer': {
      const { allFound } = checkExplain(input, q.keyTerms!)
      return { correct: allFound, correctAnswer: q.answer as string }
    }
    case 'analogy':
      return { correct: input.trim().length > 0, correctAnswer: q.answer ? String(q.answer) : 'Any thoughtful analogy works.' }
  }
}

export function checkExplain(input: string, keyTerms: string[]): { allFound: boolean; found: boolean[] } {
  const val = input.trim().toLowerCase()
  const found = keyTerms.map(kt => val.includes(kt.toLowerCase()))
  return { allFound: found.every(Boolean), found }
}

export function findEndMsg(pct: number): string {
  for (const [threshold, msg] of END_MSGS) {
    if (pct >= threshold) return msg
  }
  return END_MSGS[END_MSGS.length - 1][1]
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function correctMsg(detail?: string): string {
  const m = pickRandom(CORRECT_FEEDBACKS)
  return detail ? `${m} ${detail}` : m
}

export function wrongMsg(detail: string): string {
  return `${pickRandom(WRONG_FEEDBACKS)} ${detail}`
}

export function getMarksList(questions: Question[]): string[] {
  return ['all', ...new Set(questions.map(q => q.mark))]
}

export function getDotColor(seen: boolean, streak: number): string {
  if (!seen) return 'var(--accent)'
  return streak > 0 ? 'var(--green)' : 'var(--amber)'
}
