import type { HierarchyEdge, Relation } from './types'

export const RELATIONS: Relation[] = [
  { from: 0, to: 1, label: 'domain of' },
  { from: 1, to: 0, label: 'applies to' },

  { from: 2, to: 22, label: 'symbols' },

  { from: 3, to: 38, label: 'is a level of' },
  { from: 4, to: 38, label: 'is a level of' },
  { from: 38, to: 39, label: 'related' },
  { from: 3, to: 39, label: 'is a level of' },
  { from: 4, to: 39, label: 'is a level of' },

  { from: 6, to: 23, label: 'same topic' },
  { from: 6, to: 36, label: 'used in' },
  { from: 23, to: 36, label: 'used in' },

  { from: 7, to: 8, label: 'opposite of' },
  { from: 8, to: 7, label: 'opposite of' },
  { from: 7, to: 26, label: 'kind of' },
  { from: 7, to: 27, label: 'kind of' },
  { from: 26, to: 27, label: 'opposite of' },
  { from: 27, to: 26, label: 'opposite of' },
  { from: 8, to: 24, label: 'kind of' },
  { from: 8, to: 25, label: 'kind of' },
  { from: 24, to: 25, label: 'opposite of' },
  { from: 25, to: 24, label: 'opposite of' },

  { from: 9, to: 21, label: 'same topic' },
  { from: 9, to: 10, label: 'precedes' },
  { from: 10, to: 9, label: 'follows' },

  { from: 12, to: 20, label: 'same topic' },

  { from: 13, to: 14, label: 'opposite of' },
  { from: 14, to: 13, label: 'opposite of' },
  { from: 13, to: 19, label: 'grouped with' },
  { from: 14, to: 19, label: 'grouped with' },
  { from: 19, to: 13, label: 'contrasts' },
  { from: 19, to: 14, label: 'contrasts' },

  { from: 15, to: 28, label: 'same topic' },

  { from: 16, to: 17, label: 'complements' },
  { from: 17, to: 16, label: 'complements' },

  { from: 18, to: 5, label: 'is a kind of' },

  { from: 11, to: 32, label: 'elicitation technique' },
  { from: 11, to: 33, label: 'elicitation technique' },
  { from: 32, to: 33, label: 'elicitation technique' },
  { from: 33, to: 32, label: 'elicitation technique' },

  { from: 30, to: 31, label: 'same topic' },
  { from: 31, to: 30, label: 'same topic' },

  { from: 34, to: 35, label: 'opposite of' },
  { from: 35, to: 34, label: 'opposite of' },
]

export const HIERARCHY: HierarchyEdge[] = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 1, to: 7 },
  { from: 1, to: 8 },
  { from: 1, to: 9 },
  { from: 1, to: 12 },
  { from: 1, to: 13 },
  { from: 1, to: 14 },
  { from: 1, to: 15 },
  { from: 1, to: 34 },
  { from: 1, to: 36 },
  { from: 2, to: 22 },
  { from: 3, to: 38 },
  { from: 4, to: 38 },
  { from: 38, to: 39 },
  { from: 7, to: 26 },
  { from: 7, to: 27 },
  { from: 8, to: 24 },
  { from: 8, to: 25 },
  { from: 9, to: 10 },
  { from: 10, to: 34 },
  { from: 10, to: 35 },
  { from: 11, to: 32 },
  { from: 11, to: 33 },
  { from: 32, to: 33 },
  { from: 12, to: 20 },
  { from: 13, to: 19 },
  { from: 14, to: 19 },
  { from: 15, to: 28 },
  { from: 5, to: 18 },
  { from: 36, to: 6 },
  { from: 6, to: 23 },
  { from: 16, to: 17 },
  { from: 30, to: 31 },
  { from: 34, to: 35 },
]
