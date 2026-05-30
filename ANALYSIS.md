# Cognitive Pressure System: Full App Analysis

## Overview

**Name:** Cognitive Pressure System
**Tech:** Next.js 16.2.6 / React 19.2.4 / TypeScript / Tailwind v4 (CSS-only, no utility classes in JSX)
**Purpose:** A single-page, client-only spaced-repetition quiz app for Software Engineering concepts using a custom SM-2 algorithm.

---

## Pages / Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `QuizContainer` | The entire app — quiz, end screen, archive modal |

---

## All Components

| Component | Role |
|-----------|------|
| `QuizContainer` | Central controller — all state, all handlers, orchestrates flow |
| `Header` | Logo, Archive button, session counter |
| `ProgressBar` | Thin bar showing mastery % (streak >= 2) |
| `StatsBar` | 4-column stats: Processed / Match (correct) / Fault (wrong) / Pending, plus Streak after 3+ Qs. Hideable via ⋮ menu |
| `RecallBar` | Visual deck — each segment colored: accent (new), amber (due), green (mastered). Hover shows topic |
| `QuestionCard` | Main card — topic badge, mark badge, type badge, question text, hint, input component, feedback, QAPanel, ConceptGraph, action buttons |
| `MCQInput` | Multiple choice — button options, green/red highlight on answer |
| `TFInput` | True/False — two buttons, green/red highlight |
| `FillInput` | Fill-in-the-blank — one `<input>` per blank, green/red per field |
| `MatchInput` | Matching columns — `<select>` dropdowns per left item, shuffled right options |
| `RecallInput` | Free recall — single text input, case-insensitive fuzzy match |
| `ExplainInput` | Explanation — `<textarea>`, Ctrl+Enter to submit, checks key terms as green/red badges |
| `AbstractInput` | Abstract reasoning — shows examples, text input for general principle |
| `AnalogyInput` | Analogy — `<textarea>`, Shift+Enter, any non-empty answer accepted |
| `GenerationPhase` | Pre-answer retrieval ("Aperture closed. What is already cached?") — only for seen questions |
| `ActionButtons` | Verify / Next buttons |
| `Feedback` | Green (ok) or red (bad) message with HTML support |
| `QAPanel` | After-answer panel: Stimulus, Expected answer, Rationale |
| `AllQAModal` | Full archive — all 57 Qs with answers, filterable by mark weight |
| `EndScreen` | Score %, message, Correct/Wrong/Total stats, "Anomalies" wrong-answer review, "Begin New Cycle" |
| `ConceptGraph` | Knowledge graph — shows Foundation (prerequisites) and Extends (dependent) topics from relation hierarchy, clickable to jump |

---

## Question Types (10 total)

| Type | Code | Cognitive Level |
|------|------|----------------|
| Multiple Choice | `mcq` | Recognition |
| True / False | `tf` | Recognition |
| Fill in the Blank | `fill` | Recall |
| Matching | `match` | Association |
| Free Recall | `recall` | Recall |
| Explanation | `explain` | Comprehension |
| Reconstruct | `reconstruct` | Recall (blanks in definition) |
| Abstract Reasoning | `abstract` | Analysis / Induction |
| Transfer | `transfer` | Application (real-world) |
| Analogy | `analogy` | Creative / Far Transfer |

---

## Lib Files

| File | Purpose |
|------|---------|
| `types.ts` | All TypeScript types: `QType`, `Question`, `SMEntry`, `FeedbackState`, etc. |
| `constants.ts` | End messages, correct/wrong feedback arrays, type labels, initial SM-2 entry |
| `questions.ts` | 57 hand-crafted SE questions across all types and marks |
| `relations.ts` | 60 semantic relations + 37 hierarchy edges for ConceptGraph |
| `sm2.ts` | Custom SM-2 algorithm: `createSM`, `recordResult`, `getDueQueue`, `isSessionComplete`, `computeDueCount`, `computeMasteredCount` |
| `utils.ts` | `shuffle`, `getFullAnswer`, `formatQHtml`, `checkRecall`, `checkExplain`, `checkGeneration`, `findEndMsg`, `pickRandom`, `correctMsg`, `wrongMsg`, `getMarksList`, `getDotColor` |

---

## Learning Science Principles

1. **Spaced Repetition (SM-2)** — Questions reappear at increasing intervals (1, 3, then interval×ease). Wrong answers reset and come back sooner. Ease factor adjusts dynamically (2.5 base, +0.1 per correct, -0.2 per wrong, capped 1.3–3.0).
2. **Retrieval Practice (Generation Phase)** — Before answering a seen question, users must freely recall what they remember, activating the testing effect.
3. **Varied Cognitive Levels** — From simple MCQ recognition to far-transfer analogy questions, covering Bloom's taxonomy.
4. **Knowledge Graph** — Prerequisite and dependent relations let users navigate the concept space non-linearly, supporting connectionist learning.

---

## Rating: How Well Does This App Help Users Learn Any Concept?

### Strengths (8/10)

| Criteria | Score | Notes |
|----------|-------|-------|
| Spaced Repetition Engine | ★★★★★ | Fully implemented SM-2 with ease factor, interval scheduling, due/fresh queue |
| Question Variety | ★★★★★ | 10 types covering recognition through far transfer — rare in quiz apps |
| Retrieval Practice | ★★★★★ | Generation Phase before every repeat question is excellent pedagogy |
| Concept Navigation | ★★★★☆ | ConceptGraph shows dependencies; clickable but limited to 2-level chain |
| Visual Progress Tracking | ★★★★☆ | RecallBar, ProgressBar, StatsBar give good at-a-glance awareness |
| Feedback Quality | ★★★★☆ | Immediate correct/wrong with stylized messages, full QAPanel with rationale |
| Accessibility | ★★☆☆☆ | No ARIA labels, keyboard nav limited, no screen reader support |
| Session Persistence | ★☆☆☆☆ | All SM-2 state resets on refresh — `useRef`, not localStorage |
| Content Breadth | ★★★★☆ | 57 questions across many SE topics, but domain-specific to SE |
| UI/UX Polish | ★★★★★ | Consistent cyberpunk theme, clean animations, immersive language |

### Overall: 7.5 / 10

**What it does well:**
- The SM-2 algorithm + Generation Phase creates a genuinely effective learning loop backed by cognitive science.
- 10 question types — especially abstract/transfer/analogy — go far beyond what most quiz apps offer.
- Clean, immersive dark theme with cohesive thematic language.
- Knowledge graph navigation adds a dimension most spaced-repetition tools lack.

**What holds it back from 10/10:**
1. **No persistence** — Refresh the page and all progress is lost. This is a critical gap for any learning tool.
2. **SE content only** — The app's architecture is tightly coupled to these 57 SE questions. There is no question authoring system, no import/export, no way to swap in new topics. To learn "any given concept," a user would need to fork the codebase and replace the question bank manually.
3. **No spaced repetition across sessions** — Without persistence, the spaced repetition algorithm only works within a single session (minutes, not days).
4. **Accessibility gaps** — No ARIA landmarks, no focus management, no reduced-motion support.
5. **No adaptive difficulty** — The algorithm adjusts timing but not question difficulty or type based on performance.

### Verdict for Learning "Any Concept"

The app's **architecture is content-specific to SE**. The question bank, relations, types, and mark weights are all hardcoded. To truly help users learn "any given concept no matter what situation of user," the app would need:

- A **question authoring/import system** (JSON upload, markdown parser, or admin UI)
- **localStorage or IndexedDB persistence** for SM-2 state across sessions
- **Cross-session scheduling** so due questions carry over to the next day/week
- **Topic-agnostic templates** that work for any domain

As a **proof-of-concept** for SE learning, it's excellent (~8/10). As a **general-purpose learning platform** for any concept, it would need significant architectural changes (~4/10 currently).
