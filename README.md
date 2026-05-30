# Exam Set Akam

A client-only spaced-repetition quiz app for mastering Software Engineering concepts. Features 57 questions across 10 types, a custom SM-2 scheduler, gamification, knowledge graphs, and retrieval-practice phases — all in a single-page Next.js app.

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
- **Standalone HTML Prototype** — `index.html` with 40 questions and 4 types, no build step required

## Tech Stack

| Technology | Version |
|-----------|---------|
| [Next.js](https://nextjs.org) (App Router) | 16.2.6 |
| [React](https://react.dev) | 19.2.4 |
| [TypeScript](https://www.typescriptlang.org) | ^5 |
| [Tailwind CSS](https://tailwindcss.com) | ^4 |
| [ESLint](https://eslint.org) | ^9 |
| Google Fonts (Syne + DM Mono) | — |

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
