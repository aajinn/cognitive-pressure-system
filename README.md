# Cognitive Pressure System

A science-backed spaced-repetition quiz engine for engineering exam mastery. Built on principles from cognitive psychology, memory research, and neuroeducation — designed to optimise retention through **desirable difficulty**, **spacing effects**, and **metacognitive calibration**.

## The Science Behind the System

### 🧠 Spacing Effect (Ebbinghaus Forgetting Curve)

The SM-2 algorithm schedules review intervals based on the exponential-forgetting model first documented by Hermann Ebbinghaus (1885). Each correct answer expands the interval; each mistake collapses it back. The result is a review rhythm that intercepts the forgetting curve at its steepest drop — the moment when reactivation produces the strongest long-term retention.

### 🔁 Retrieval Practice (Testing Effect)

Before re-answering any seen question, the system requires a **generation phase** — free recall from memory without cues. This leverages the **testing effect** (Roediger & Karpicke, 2006): the act of retrieving knowledge strengthens neural pathways more than passive re-study, even when retrieval fails.

### ⚖️ Desirable Difficulties

Not all difficulty is bad. The system intentionally introduces productive cognitive friction — free recall instead of recognition, interleaved topics, and multi-step explanation tasks — following Bjork & Bjork's (2011) framework of **desirable difficulties** that slow acquisition but accelerate long-term consolidation.

### 🔀 Interleaving & Varied Practice

Questions are shuffled across topics and types, forcing the brain to discriminate between related concepts. Interleaved practice (Rohrer, 2012) produces superior transfer and retention compared to blocked practice, because it strengthens **discriminative encoding** — the ability to tell concepts apart.

### 🎯 Metacognitive Calibration

A 4-level confidence scale (Guessing → Maybe → Confident → Certain) accompanies every answer. This builds **metacognitive monitoring** — the learner's ability to judge their own knowledge state. Research shows that calibrated confidence predicts long-term retention and reduces the illusion of fluency.

### 📊 Cognitive Load Management

The system segments content by mark weight (2-mark / 5-mark / 15-mark) to manage **intrinsic cognitive load** (Sweller, 1988). Easier items build schema fluency before harder items demand deeper elaboration. The progress and recall bars provide **extraneous load** reduction — the learner never has to mentally track their state.

### 📈 Yerkes-Dodson Arousal Curve

Streak tracking and XP gamification are calibrated to maintain **moderate arousal** — the optimal zone on the Yerkes-Dodson curve for complex cognitive performance. Too few correct answers in a row depresses engagement; too many without challenge risks over-arousal.

### 🧩 Dual Coding

Questions pair textual concepts with structured formats (matching columns, fill-in-the-blank with context, multiple-choice with semantic hints), engaging both verbal and visual-spatial processing channels (Paivio, 1986) for richer memory encoding.

### 🧬 Neuroplasticity & Growth Mindset

End-of-session messages are framed around effort and strategy, not fixed ability. This aligns with Dweck's (2006) **growth mindset** research: attributing outcomes to strategy use rather than talent increases persistence and learning.

## Features

- **Spaced Repetition (SM-2)** — custom interval scheduler with ease factor, streak tracking, and adaptive review queue
- **10 Question Types** — MCQ, True/False, Fill-in-the-blank, Matching, Free Recall, Explanation, Reconstruct, Abstract Reasoning, Transfer, Analogy
- **Retrieval Practice** — recall-before-answer phase to strengthen long-term retention
- **Knowledge Graph** — visual concept map with prerequisite/dependent relations (60 semantic links + 37 hierarchy edges)
- **Context Panel** — shows "Why am I seeing this?" with past mistakes, streak resets, or scheduled review reasons
- **Confidence Self-Assessment** — 4-level scale (Guessing / Maybe / Confident / Certain)
- **Gamification** — XP points per correct answer, hint costs, progress tracking
- **After-Answer Debrief** — result banner, explanation, common confusions, related concepts, next topic recommendation
- **Help System** — Hints (-5XP), related concepts, examples
- **Full Q&A Archive** — browse all 57 questions with answers, hints, explanations, and mark-weight filters
- **Visual Progress** — mastery bar, recall deck visualizer, stats bar (hideable)
- **Welcome Overlay** — 3-step intro tutorial
- **End Screen** — score, stats, wrong-item review list, restart
- **Dark Cyberpunk Theme** — glass-morphism cards, gradient accents, noise overlay, responsive design
- **Session Persistence** — SM-2 state saved to `localStorage`
- **Standalone HTML Prototype** — `first-version.html` with 40 questions and 4 types, no build step required

## Tech Stack

| Technology | Version |
|-----------|---------|
| [Next.js](https://nextjs.org) (App Router) | 16.2.6 |
| [React](https://react.dev) | 19.2.4 |
| [TypeScript](https://www.typescriptlang.org) | ^5 |
| [Tailwind CSS](https://tailwindcss.com) | ^4 |
| [ESLint](https://eslint.org) | ^9 |
| Google Fonts (Lexend + DM Mono) | — |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with webpack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
