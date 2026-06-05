export interface SplitFact {
  text: string
  keyTerms: string[]
}

const COMMON_WORDS = new Set(['This', 'These', 'Each', 'Both', 'That', 'From', 'They', 'What', 'When', 'Where', 'Which', 'Their', 'Them', 'Into', 'Some', 'Then', 'Also', 'Than', 'Correct', 'Incorrect', 'Example'])

export function extractKeyTerms(text: string): string[] {
  const found = new Set<string>()

  const parens = text.match(/\(([^)]+)\)/g)
  if (parens) parens.forEach(t => {
    const inner = t.replace(/[()]/g, '').trim()
    inner.split(/[,;]/).forEach(p => {
      const trimmed = p.trim()
      if (trimmed.length > 2) found.add(trimmed)
    })
  })

  const multiCaps = text.match(/\b[A-Z][a-z]+\s+[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*\b/g)
  if (multiCaps) multiCaps.forEach(t => {
    const tr = t.trim()
    if (tr.length > 4 && !COMMON_WORDS.has(tr)) found.add(tr)
  })

  const singleCaps = text.match(/\b([A-Z][a-z]{3,})\b/g)
  if (singleCaps) singleCaps.forEach(t => {
    if (!COMMON_WORDS.has(t)) found.add(t)
  })

  const techTerms = text.match(/\b(?:[A-Z][a-z]*){2,}(?:\s+[A-Z][a-z]*)*\b/g)
  if (techTerms) techTerms.forEach(t => {
    const tr = t.trim()
    if (tr.length > 5) found.add(tr)
  })

  const result = Array.from(found).filter(t => t.length > 2 && !COMMON_WORDS.has(t))
  return result.sort((a, b) => b.length - a.length)
}

function splitSentences(text: string): string[] {
  const parts = text.split(/(?<=[.!?])\s+(?=[A-Z])/)
  if (parts.length >= 2) return parts.map(s => s.trim()).filter(Boolean)
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length >= 2) return lines
  if (text.length > 80) {
    const semi = text.split(/;\s*/).filter(p => p.trim().length > 10)
    if (semi.length >= 2) return semi
  }
  return [text]
}

function extractEnumeration(text: string): string[] {
  const numbered = text.match(/\b\d+\s*[=.)]\s*/)
  if (numbered) {
    const items = text.split(/(?:\b\d+\s*[=.)]\s*)/).filter((_, i) => i > 0)
    if (items.length >= 2) return items.map(s => s.trim().replace(/[,;]\s*$/, ''))
  }
  const lettered = text.match(/\b[A-Z]\s*=\s*/)
  if (lettered) {
    const items = text.split(/(?:\b[A-Z]\s*=\s*)/).filter((_, i) => i > 0)
    if (items.length >= 2) return items.map(s => s.trim().replace(/[,;]\s*$/, ''))
  }
  const example = text.match(/Example\s+\d+\s*=\s*/i)
  if (example) {
    const items = text.split(/(?:Example\s+\d+\s*=\s*)/i).filter((_, i) => i > 0)
    if (items.length >= 2) return items.map(s => s.trim().replace(/[,;]\s*$/, ''))
  }
  const colon = text.match(/:\s*(.+)/)
  if (colon) {
    const items = colon[1].split(/\s*,\s*(?=[A-Z])/).filter(s => s.trim().length > 5)
    if (items.length >= 2) return items.map(s => s.trim())
  }
  return [text]
}

export function splitExplanation(text: string): SplitFact[] {
  const sentences = splitSentences(text)
  const facts: SplitFact[] = []
  for (const sentence of sentences) {
    const items = extractEnumeration(sentence)
    if (items.length >= 2) {
      for (const item of items) {
        if (item.trim().length > 5) {
          facts.push({ text: item.trim(), keyTerms: extractKeyTerms(item) })
        }
      }
    } else {
      facts.push({ text: sentence.trim(), keyTerms: extractKeyTerms(sentence) })
    }
  }
  return facts.filter(f => f.text.length > 3)
}

export function pickClozeTerm(fact: SplitFact): string | null {
  for (const term of fact.keyTerms) {
    if (fact.text.includes(term) && term.length > 3) return term
  }
  return null
}
