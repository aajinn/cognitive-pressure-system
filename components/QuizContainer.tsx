'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { ALL_Q } from '@/lib/questions'
import type { Question, SMEntry, WrongItem, FeedbackState, McqHighlight, TfHighlight, RecallSeg, QuizScreen, Confidence, Difficulty } from '@/lib/types'
import { createSM, recordResult, getDueQueue, isSessionComplete, computeDueCount, computeMasteredCount } from '@/lib/sm2'
import { shuffle, checkRecall, checkExplain, checkGeneration, formatQHtml, getDotColor, correctMsg, wrongMsg, getFullAnswer } from '@/lib/utils'
import { HIERARCHY, RELATIONS } from '@/lib/relations'
import { TYPE_LABEL, INITIAL_SM_ENTRY } from '@/lib/constants'
import Header from './Header'
import ProgressBar from './ProgressBar'
import StatsBar from './StatsBar'
import RecallBar from './RecallBar'
import GenerationPhase from './GenerationPhase'
import QuestionCard from './QuestionCard'
import AllQAModal from './AllQAModal'
import EndScreen from './EndScreen'
import WelcomeOverlay from './WelcomeOverlay'

const STORAGE_KEY = 'quiz-sm-state'
const WELCOME_KEY = 'quiz-welcome-seen'

function loadState(): { sm: Record<number, SMEntry>; step: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      const sm = data.sm ?? createSM(ALL_Q)
      ALL_Q.forEach(q => {
        if (!sm[q.id]) sm[q.id] = { ...INITIAL_SM_ENTRY }
      })
      return { sm, step: data.step ?? 0 }
    }
  } catch {}
  return { sm: createSM(ALL_Q), step: 0 }
}

function persistState(sm: Record<number, SMEntry>, step: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sm, step }))
  } catch {}
}

export default function QuizContainer() {
  const [initial] = useState(() => {
    const saved = loadState()
    return saved
  })
  const smRef = useRef<Record<number, SMEntry>>({...initial.sm})
  const stepRef = useRef(initial.step)
  const queueRef = useRef<number[]>([])
  const [smSnapshot, setSmSnapshot] = useState<Record<number, SMEntry>>(() => ({...initial.sm}))
  const [step, setStep] = useState(initial.step)
  const [showWelcome, setShowWelcome] = useState(() => {
    try { return !localStorage.getItem(WELCOME_KEY) } catch { return false }
  })

  const [screen, setScreen] = useState<QuizScreen>('quiz')
  const [currentQ, setCurrentQ] = useState<Question | null>(null)
  const [answered, setAnswered] = useState(false)
  const [sessionDone, setSessionDone] = useState(0)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionWrong, setSessionWrong] = useState(0)
  const [wrongItems, setWrongItems] = useState<WrongItem[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalFilter, setModalFilter] = useState('all')
  const [fillValues, setFillValues] = useState<string[]>([])
  const [matchValues, setMatchValues] = useState<string[]>([])
  const [recallValue, setRecallValue] = useState('')
  const [explainValue, setExplainValue] = useState('')
  const [explainKeyTermHighlights, setExplainKeyTermHighlights] = useState<(boolean | null)[] | null>(null)
  const [mcqHighlight, setMcqHighlight] = useState<McqHighlight | null>(null)
  const [tfHighlight, setTfHighlight] = useState<TfHighlight | null>(null)
  const [fillHighlight, setFillHighlight] = useState<boolean[] | null>(null)
  const [matchHighlight, setMatchHighlight] = useState<boolean[] | null>(null)
  const [recallHighlight, setRecallHighlight] = useState<boolean | null>(null)
  const [abstractValue, setAbstractValue] = useState('')
  const [abstractHighlight, setAbstractHighlight] = useState<boolean | null>(null)
  const [analogyValue, setAnalogyValue] = useState('')
  const [analogyHighlight, setAnalogyHighlight] = useState<boolean | null>(null)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)

  const [confidence, setConfidence] = useState<Confidence | null>(null)
  const [xp, setXp] = useState(0)
  const [showHintReveal, setShowHintReveal] = useState(false)
  const [showRelatedConcept, setShowRelatedConcept] = useState(false)
  const [showExample, setShowExample] = useState(false)
  const [afterAnswerData, setAfterAnswerData] = useState<{
    correct: boolean
    xpGained: number
    explanation: string
    commonConfusion: string
    relatedConcepts: string[]
    nextRecommended: string
  } | null>(null)

  const [generationPhase, setGenerationPhase] = useState(true)
  const [genValue, setGenValue] = useState('')
  const [genChecked, setGenChecked] = useState(false)
  const [genFeedback, setGenFeedback] = useState<FeedbackState | null>(null)

  const dueCount = useMemo(
    () => computeDueCount(ALL_Q, smSnapshot, step),
    [smSnapshot, step],
  )
  const masteredCount = useMemo(
    () => computeMasteredCount(ALL_Q, smSnapshot),
    [smSnapshot],
  )
  const progressPct = useMemo(
    () => Math.round((masteredCount / ALL_Q.length) * 100),
    [masteredCount],
  )

  const recallSegs: RecallSeg[] = useMemo(() => {
    return ALL_Q.map(q => {
      const s = smSnapshot[q.id]
      let cls = 'recall-seg'
      if (!s.seen) cls += ' new'
      else if (s.streak >= 2) cls += ' done'
      else cls += ' due'
      return { cls, title: q.topic }
    })
  }, [smSnapshot])

  const isRepeat = currentQ
    ? smSnapshot[currentQ.id]?.seen && smSnapshot[currentQ.id]?.streak === 0
    : false

  const currentSeen = currentQ ? smSnapshot[currentQ.id]?.seen : false
  const currentStreak = currentQ ? smSnapshot[currentQ.id]?.streak : 0
  const maxStreak = useMemo(
    () => Math.max(...ALL_Q.map(q => smSnapshot[q.id]?.streak ?? 0)),
    [smSnapshot],
  )

  const shuffledMatchRights = useMemo(() => {
    if (!currentQ || currentQ.type !== 'match') return null
    return shuffle(currentQ.pairs!.map(p => p[1]))
  }, [currentQ])

  const difficulty: Difficulty = useMemo(() => {
    if (!currentQ) return 'medium'
    if (currentQ.mark === '2-mark') return 'easy'
    if (currentQ.mark === '5-mark') return 'medium'
    return 'hard'
  }, [currentQ])

  const confidenceTrend = useMemo(() => {
    if (!currentQ) return ''
    const s = smSnapshot[currentQ.id]
    if (!s?.seen) return '✦ New'
    if (s.streak >= 3) return '↑ Improving'
    if (s.streak >= 1) return '↗ Building'
    return '→ Reviewing'
  }, [currentQ, smSnapshot])

  const topicPath = useMemo(() => {
    if (!currentQ) return ''
    const entry = HIERARCHY.find(e => e.to === currentQ.id)
    if (!entry) return ''
    const parent = ALL_Q.find(q => q.id === entry.from)
    if (!parent) return currentQ.topic
    const grand = HIERARCHY.find(e => e.to === parent.id)
    if (grand) {
      const grandQ = ALL_Q.find(q => q.id === grand.from)
      if (grandQ) return `${grandQ.topic} → ${parent.topic} →`
    }
    return `${parent.topic} →`
  }, [currentQ])

  const contextReasons = useMemo(() => {
    if (!currentQ) return []
    const reasons: string[] = []
    const s = smSnapshot[currentQ.id]
    if (s?.wrong && s.wrong > 0) {
      reasons.push(`You missed this ${s.wrong} time${s.wrong > 1 ? 's' : ''} before`)
    }
    if (s?.seen && s.streak === 0) {
      reasons.push('Streak was reset — reinforcing this concept')
    }
    const recentWrong = wrongItems.filter(w => w.topic === currentQ.topic).slice(0, 2)
    if (recentWrong.length > 0) {
      recentWrong.forEach(w => reasons.push(`"${w.topic}" was answered incorrectly`))
    }
    if (reasons.length === 0 && s?.seen) {
      reasons.push('Scheduled for review — optimal timing for retention')
    }
    return reasons
  }, [currentQ, wrongItems, smSnapshot])

  const relatedTopics = useMemo(() => {
    if (!currentQ) return []
    const result: { id: number; topic: string; type: 'prereq' | 'related' }[] = []
    const added = new Set<number>()
    HIERARCHY.forEach(e => {
      if (e.to === currentQ.id && !added.has(e.from)) {
        added.add(e.from)
        const q = ALL_Q.find(q => q.id === e.from)
        if (q) result.push({ id: q.id, topic: q.topic, type: 'prereq' })
      }
      if (e.from === currentQ.id && !added.has(e.to)) {
        added.add(e.to)
        const q = ALL_Q.find(q => q.id === e.to)
        if (q) result.push({ id: q.id, topic: q.topic, type: 'related' })
      }
    })
    RELATIONS.forEach(r => {
      if (r.from === currentQ.id && !added.has(r.to)) {
        added.add(r.to)
        const q = ALL_Q.find(q => q.id === r.to)
        if (q) result.push({ id: q.id, topic: q.topic, type: 'related' })
      }
      if (r.to === currentQ.id && !added.has(r.from)) {
        added.add(r.from)
        const q = ALL_Q.find(q => q.id === r.from)
        if (q) result.push({ id: q.id, topic: q.topic, type: 'related' })
      }
    })
    return result.slice(0, 6)
  }, [currentQ])

  const questionPositionStr = useMemo(() => {
    if (!currentQ) return ''
    const total = ALL_Q.length
    return `${currentQ.id + 1} / ${total}`
  }, [currentQ])

  function computeAfterAnswer(correct: boolean, q: Question): {
    correct: boolean
    xpGained: number
    explanation: string
    commonConfusion: string
    relatedConcepts: string[]
    nextRecommended: string
  } {
    const xpBase = q.mark === '2-mark' ? 8 : q.mark === '5-mark' ? 12 : 20
    const xpGained = correct ? xpBase : 2
    const explanation = q.exp || `The correct answer: ${getFullAnswer(q)}`

    const relatedConcepts = RELATIONS
      .filter(r => r.from === q.id || r.to === q.id)
      .map(r => {
        const otherId = r.from === q.id ? r.to : r.from
        const other = ALL_Q.find(qq => qq.id === otherId)
        return other ? other.topic : ''
      })
      .filter(Boolean)
      .slice(0, 4)

    const nextId = HIERARCHY.find(e => e.from === q.id)?.to
    const nextRec = nextId !== undefined ? (ALL_Q.find(qq => qq.id === nextId)?.topic || '') : ''
    const nextRecommended = nextRec || (relatedConcepts[0] ? `Explore: ${relatedConcepts[0]}` : 'Continue the session')

    return {
      correct,
      xpGained,
      explanation,
      commonConfusion: 'Students often confuse this with related concepts. Focus on the key distinction highlighted above.',
      relatedConcepts,
      nextRecommended,
    }
  }

  const buildQueue = useCallback(() => {
    queueRef.current = getDueQueue(ALL_Q, smRef.current, stepRef.current)
  }, [])

  const nextCard = useCallback(() => {
    buildQueue()
    if (queueRef.current.length === 0) { setScreen('end'); return }
    if (isSessionComplete(ALL_Q, smRef.current, stepRef.current)) { setScreen('end'); return }
    const q = ALL_Q.find(q => q.id === queueRef.current[0])
    setCurrentQ(q ?? null)
    setAnswered(false)
    setMcqHighlight(null)
    setTfHighlight(null)
    setFillHighlight(null)
    setMatchHighlight(null)
    setRecallHighlight(null)
    setAbstractValue('')
    setAbstractHighlight(null)
    setAnalogyValue('')
    setAnalogyHighlight(null)
    setExplainKeyTermHighlights(null)
    setFeedback(null)
    setRecallValue('')
    setExplainValue('')
    setGenerationPhase(q ? smRef.current[q.id]?.seen : false)
    setGenValue('')
    setGenChecked(false)
    setGenFeedback(null)
    setConfidence(null)
    setShowHintReveal(false)
    setShowRelatedConcept(false)
    setShowExample(false)
    setAfterAnswerData(null)
    if (q?.type === 'fill' || q?.type === 'reconstruct') setFillValues(q.blanks!.map(() => ''))
    if (q?.type === 'match') setMatchValues(q.pairs!.map(() => ''))
  }, [buildQueue])

  const jumpToQuestion = useCallback((id: number) => {
    const q = ALL_Q.find(q => q.id === id)
    if (!q) return
    setCurrentQ(q)
    setAnswered(false)
    setMcqHighlight(null)
    setTfHighlight(null)
    setFillHighlight(null)
    setMatchHighlight(null)
    setRecallHighlight(null)
    setAbstractValue('')
    setAbstractHighlight(null)
    setAnalogyValue('')
    setAnalogyHighlight(null)
    setExplainKeyTermHighlights(null)
    setFeedback(null)
    setRecallValue('')
    setExplainValue('')
    setGenerationPhase(smRef.current[q.id]?.seen || false)
    setGenValue('')
    setGenChecked(false)
    setGenFeedback(null)
    setConfidence(null)
    setShowHintReveal(false)
    setShowRelatedConcept(false)
    setShowExample(false)
    setAfterAnswerData(null)
    if (q.type === 'fill' || q.type === 'reconstruct') setFillValues(q.blanks!.map(() => ''))
    if (q.type === 'match') setMatchValues(q.pairs!.map(() => ''))
  }, [])

  useEffect(() => {
    nextCard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setSmSnapshot({...smRef.current})
    setStep(stepRef.current)
  }, [sessionDone])

  const handleDismissWelcome = useCallback(() => {
    try { localStorage.setItem(WELCOME_KEY, '1') } catch {}
    setShowWelcome(false)
  }, [])

  const handleConfidenceChange = useCallback((c: Confidence) => {
    setConfidence(c)
  }, [])

  const handleHint = useCallback(() => {
    setShowHintReveal(true)
    setXp(prev => Math.max(0, prev - 5))
  }, [])

  const handleRelatedConcept = useCallback(() => {
    setShowRelatedConcept(true)
  }, [])

  const handleExample = useCallback(() => {
    setShowExample(true)
  }, [])

  const logWrong = useCallback((q: Question, user: string, correct: string) => {
    setWrongItems(prev => [...prev, { topic: q.topic, q: q.q.substring(0, 80) + '…', user, correct }])
  }, [])

  const handleMCQ = useCallback((chosen: number) => {
    if (!currentQ || answered) return
    setAnswered(true)
    const correct = chosen === (currentQ.answer as number)
    setMcqHighlight({ chosen, correct: currentQ.answer as number })
    const ansText = currentQ.options![currentQ.answer as number]
    if (correct) {
      setFeedback({ ok: true, msg: correctMsg(`"${ansText}"`) })
      setSessionCorrect(c => c + 1)
    } else {
      setFeedback({ ok: false, msg: wrongMsg(`"${ansText}"`) })
      setSessionWrong(c => c + 1)
      logWrong(currentQ, currentQ.options![chosen], ansText)
    }
    const ad = computeAfterAnswer(correct, currentQ)
    setXp(prev => prev + ad.xpGained)
    setAfterAnswerData(ad)
    stepRef.current = recordResult(smRef.current, stepRef.current, currentQ.id, correct)
    setSessionDone(d => d + 1)
    persistState(smRef.current, stepRef.current)
  }, [currentQ, answered, logWrong])

  const handleTF = useCallback((selected: boolean) => {
    if (!currentQ || answered) return
    setAnswered(true)
    const correct = selected === currentQ.answer
    setTfHighlight({ selected, correct: currentQ.answer as boolean })
    const expTxt = currentQ.exp ? ` — ${currentQ.exp}` : ''
    if (correct) {
      setFeedback({ ok: true, msg: correctMsg(expTxt || undefined) })
      setSessionCorrect(c => c + 1)
    } else {
      setFeedback({ ok: false, msg: wrongMsg(`It is ${currentQ.answer ? 'True' : 'False'}.${expTxt}`) })
      setSessionWrong(c => c + 1)
      logWrong(currentQ, selected ? 'True' : 'False', currentQ.answer ? 'True' : 'False')
    }
    const ad = computeAfterAnswer(correct, currentQ)
    setXp(prev => prev + ad.xpGained)
    setAfterAnswerData(ad)
    stepRef.current = recordResult(smRef.current, stepRef.current, currentQ.id, correct)
    setSessionDone(d => d + 1)
    persistState(smRef.current, stepRef.current)
  }, [currentQ, answered, logWrong])

  const handleFill = useCallback(() => {
    if (!currentQ || answered) return
    setAnswered(true)
    let allCorrect = true
    const highlights: boolean[] = []
    currentQ.blanks!.forEach((ans, i) => {
      const val = (fillValues[i] || '').trim().toLowerCase()
      const exp = ans.toLowerCase()
      const ok = val.length > 0 && (val === exp || exp.includes(val) || val.includes(exp))
      highlights.push(ok)
      if (!ok) allCorrect = false
    })
    setFillHighlight(highlights)
    const answerStr = currentQ.blanks!.join(' / ')
    if (allCorrect) {
      setFeedback({ ok: true, msg: correctMsg() })
      setSessionCorrect(c => c + 1)
    } else {
      setFeedback({ ok: false, msg: wrongMsg(answerStr) })
      setSessionWrong(c => c + 1)
      logWrong(currentQ, fillValues.join(', '), answerStr)
    }
    const ad = computeAfterAnswer(allCorrect, currentQ)
    setXp(prev => prev + ad.xpGained)
    setAfterAnswerData(ad)
    stepRef.current = recordResult(smRef.current, stepRef.current, currentQ.id, allCorrect)
    setSessionDone(d => d + 1)
    persistState(smRef.current, stepRef.current)
  }, [currentQ, answered, fillValues, logWrong])

  const handleMatch = useCallback(() => {
    if (!currentQ || answered) return
    setAnswered(true)
    let allCorrect = true
    const highlights: boolean[] = []
    currentQ.pairs!.forEach((p, i) => {
      const ok = matchValues[i] === p[1]
      highlights.push(ok)
      if (!ok) allCorrect = false
    })
    setMatchHighlight(highlights)
    const correctList = currentQ.pairs!.map(p => `${p[0]} → ${p[1]}`).join(' | ')
    if (allCorrect) {
      setFeedback({ ok: true, msg: correctMsg('All pairs locked.') })
      setSessionCorrect(c => c + 1)
    } else {
      setFeedback({ ok: false, msg: wrongMsg(correctList) })
      setSessionWrong(c => c + 1)
      logWrong(currentQ, 'wrong selections', correctList)
    }
    const ad = computeAfterAnswer(allCorrect, currentQ)
    setXp(prev => prev + ad.xpGained)
    setAfterAnswerData(ad)
    stepRef.current = recordResult(smRef.current, stepRef.current, currentQ.id, allCorrect)
    setSessionDone(d => d + 1)
    persistState(smRef.current, stepRef.current)
  }, [currentQ, answered, matchValues, logWrong])

  const handleRecall = useCallback(() => {
    if (!currentQ || answered) return
    setAnswered(true)
    const correct = checkRecall(recallValue, currentQ.answers!)
    setRecallHighlight(correct)
    const answerStr = currentQ.answers!.join(' / ')
    if (correct) {
      setFeedback({ ok: true, msg: correctMsg() })
      setSessionCorrect(c => c + 1)
    } else {
      setFeedback({ ok: false, msg: wrongMsg(answerStr) })
      setSessionWrong(c => c + 1)
      logWrong(currentQ, recallValue, answerStr)
    }
    const ad = computeAfterAnswer(correct, currentQ)
    setXp(prev => prev + ad.xpGained)
    setAfterAnswerData(ad)
    stepRef.current = recordResult(smRef.current, stepRef.current, currentQ.id, correct)
    setSessionDone(d => d + 1)
    persistState(smRef.current, stepRef.current)
  }, [currentQ, answered, recallValue, logWrong])

  const handleExplain = useCallback(() => {
    if (!currentQ || answered) return
    setAnswered(true)
    const { allFound, found } = checkExplain(explainValue, currentQ.keyTerms!)
    setExplainKeyTermHighlights(found.map(f => f))
    const sample = currentQ.answer as string
    if (allFound) {
      setFeedback({ ok: true, msg: correctMsg(`Key terms verified. Sample: ${sample}`) })
      setSessionCorrect(c => c + 1)
    } else {
      const missing = currentQ.keyTerms!.filter((_, i) => !found[i])
      setFeedback({ ok: false, msg: wrongMsg(`Missing: ${missing.join(', ')}. Sample: ${sample}`) })
      setSessionWrong(c => c + 1)
      logWrong(currentQ, explainValue, sample)
    }
    const ad = computeAfterAnswer(allFound, currentQ)
    setXp(prev => prev + ad.xpGained)
    setAfterAnswerData(ad)
    stepRef.current = recordResult(smRef.current, stepRef.current, currentQ.id, allFound)
    setSessionDone(d => d + 1)
    persistState(smRef.current, stepRef.current)
  }, [currentQ, answered, explainValue, logWrong])

  const handleAbstract = useCallback(() => {
    if (!currentQ || answered) return
    setAnswered(true)
    const ok = checkRecall(abstractValue, currentQ.answers!)
    setAbstractHighlight(ok)
    const principle = currentQ.answer as string || currentQ.answers![0]
    const expTxt = currentQ.exp ? ` ${currentQ.exp}` : ''
    if (ok) {
      setFeedback({ ok: true, msg: correctMsg(`Principle: ${principle}.${expTxt}`) })
      setSessionCorrect(c => c + 1)
    } else {
      setFeedback({ ok: false, msg: wrongMsg(`Principle: ${principle}.${expTxt}`) })
      setSessionWrong(c => c + 1)
      logWrong(currentQ, abstractValue, currentQ.answers!.join(' / '))
    }
    const ad = computeAfterAnswer(ok, currentQ)
    setXp(prev => prev + ad.xpGained)
    setAfterAnswerData(ad)
    stepRef.current = recordResult(smRef.current, stepRef.current, currentQ.id, ok)
    setSessionDone(d => d + 1)
    persistState(smRef.current, stepRef.current)
  }, [currentQ, answered, abstractValue, logWrong])

  const handleAnalogy = useCallback(() => {
    if (!currentQ || answered) return
    setAnswered(true)
    const ok = analogyValue.trim().length > 0
    const ans = currentQ.answer ? String(currentQ.answer) : ''
    setAnalogyHighlight(ok)
    if (ok) {
      setFeedback({ ok: true, msg: correctMsg(ans ? `Sample: ${ans}` : undefined) })
      setSessionCorrect(c => c + 1)
    } else {
      setFeedback({ ok: false, msg: wrongMsg(ans ? `Sample: ${ans}` : 'Analogy required.') })
      setSessionWrong(c => c + 1)
      logWrong(currentQ, analogyValue, ans || 'N/A')
    }
    const ad = computeAfterAnswer(ok, currentQ)
    setXp(prev => prev + ad.xpGained)
    setAfterAnswerData(ad)
    stepRef.current = recordResult(smRef.current, stepRef.current, currentQ.id, ok)
    setSessionDone(d => d + 1)
    persistState(smRef.current, stepRef.current)
  }, [currentQ, answered, analogyValue, logWrong])

  const restart = useCallback(() => {
    smRef.current = createSM(ALL_Q)
    stepRef.current = 0
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
    setSessionDone(0)
    setSessionCorrect(0)
    setSessionWrong(0)
    setWrongItems([])
    setXp(0)
    setScreen('quiz')
    nextCard()
  }, [nextCard])

  const handleGeneration = useCallback(() => {
    if (!currentQ || genChecked) return
    const { correct, correctAnswer } = checkGeneration(genValue, currentQ)
    setGenChecked(true)
    setGenFeedback({
      ok: correct,
      msg: correct
        ? correctMsg()
        : wrongMsg(correctAnswer),
    })
  }, [currentQ, genValue, genChecked])

  const continueFromGeneration = useCallback(() => {
    setGenerationPhase(false)
  }, [])

  const fillChange = useCallback((i: number, v: string) => {
    setFillValues(prev => { const n = [...prev]; n[i] = v; return n })
  }, [])

  const matchChange = useCallback((i: number, v: string) => {
    setMatchValues(prev => { const n = [...prev]; n[i] = v; return n })
  }, [])

  const recallChange = useCallback((v: string) => setRecallValue(v), [])

  const explainChange = useCallback((v: string) => setExplainValue(v), [])

  const abstractChange = useCallback((v: string) => setAbstractValue(v), [])

  const analogyChange = useCallback((v: string) => setAnalogyValue(v), [])

  return (
    <div className="wrap">
      <Header done={sessionDone} onOpenQA={() => { setModalOpen(true); setModalFilter('all') }} />

      <AllQAModal
        open={modalOpen}
        filter={modalFilter}
        questions={ALL_Q}
        onClose={() => setModalOpen(false)}
        onFilterChange={setModalFilter}
      />

      <ProgressBar pct={progressPct} />
      <StatsBar done={sessionDone} correct={sessionCorrect} wrong={sessionWrong} due={dueCount} streak={maxStreak} />
      <RecallBar segs={recallSegs} />

      {screen === 'quiz' && currentQ && generationPhase && (
        <div className="card">
          <div className="q-meta">
            <span className="badge badge-topic">{currentQ.topic}</span>
            <span className="badge badge-type">{currentQ.mark}</span>
            <span className="badge badge-type">{TYPE_LABEL[currentQ.type]}</span>
            {isRepeat && <span className="badge badge-repeat">↩ Review</span>}
            <span className="recall-dot" style={{ background: getDotColor(currentSeen, currentStreak) }} />
          </div>
          <div className="q-text" dangerouslySetInnerHTML={{ __html: formatQHtml(currentQ) }} />
          <GenerationPhase
            value={genValue}
            feedback={genFeedback}
            genChecked={genChecked}
            onChange={setGenValue}
            onCheck={handleGeneration}
            onContinue={continueFromGeneration}
          />
        </div>
      )}

      {screen === 'quiz' && currentQ && !generationPhase && (
        <QuestionCard
          question={currentQ}
          answered={answered}
          isRepeat={isRepeat}
          seen={currentSeen}
          streak={currentStreak}
          fillValues={fillValues}
          matchValues={matchValues}
          recallValue={recallValue}
          explainValue={explainValue}
          abstractValue={abstractValue}
          analogyValue={analogyValue}
          explainKeyTermHighlights={explainKeyTermHighlights}
          mcqHighlight={mcqHighlight}
          tfHighlight={tfHighlight}
          fillHighlight={fillHighlight}
          matchHighlight={matchHighlight}
          recallHighlight={recallHighlight}
          abstractHighlight={abstractHighlight}
          analogyHighlight={analogyHighlight}
          feedback={feedback}
          shuffledMatchRights={shuffledMatchRights}
          onMCQ={handleMCQ}
          onTF={handleTF}
          onFillChange={fillChange}
          onFillEnter={handleFill}
          onMatchChange={matchChange}
          onRecallChange={recallChange}
          onRecallEnter={handleRecall}
          onExplainChange={explainChange}
          onExplainEnter={handleExplain}
          onAbstractChange={abstractChange}
          onAbstractEnter={handleAbstract}
          onAnalogyChange={analogyChange}
          onAnalogyEnter={handleAnalogy}
          onCheck={currentQ.type === 'fill' ? handleFill : currentQ.type === 'match' ? handleMatch : currentQ.type === 'recall' ? handleRecall : currentQ.type === 'explain' || currentQ.type === 'transfer' ? handleExplain : currentQ.type === 'abstract' ? handleAbstract : currentQ.type === 'analogy' ? handleAnalogy : handleFill}
          onNext={nextCard}
          onJumpTo={jumpToQuestion}
          topicPath={topicPath}
          masteryPct={progressPct}
          questionPosition={questionPositionStr}
          difficulty={difficulty}
          confidenceTrend={confidenceTrend}
          confidence={confidence}
          onConfidenceChange={handleConfidenceChange}
          xp={xp}
          knowledgeGain={afterAnswerData?.xpGained ?? 0}
          showHintReveal={showHintReveal}
          showRelatedConcept={showRelatedConcept}
          showExample={showExample}
          onHint={handleHint}
          onRelatedConcept={handleRelatedConcept}
          onExample={handleExample}
          contextReasons={contextReasons}
          relatedTopics={relatedTopics}
          afterAnswer={afterAnswerData}
        />
      )}

      {screen === 'end' && (
        <EndScreen
          correct={sessionCorrect}
          wrong={sessionWrong}
          total={sessionDone}
          wrongItems={wrongItems}
          onRestart={restart}
        />
      )}

      {showWelcome && <WelcomeOverlay onDismiss={handleDismissWelcome} />}
    </div>
  )
}
