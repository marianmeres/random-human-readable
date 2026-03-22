# @marianmeres/random-human-readable — Agent Guide

## Quick Reference
- **Stack**: Deno, TypeScript
- **Run**: `deno task test` | **Watch**: `deno task test:watch`
- **Build npm**: `deno task npm:build` | **Publish**: `deno task publish`

## Project Structure
```
/src
  mod.ts                       — Entry point (re-exports)
  random-human-readable.ts     — All implementation
  adjs.ts                      — Adjectives word list (266 items)
  colors.ts                    — CSS color names list (154 items)
  nouns.ts                     — Nouns word list (1461 items)
/tests
  random-human-readable.test.ts — All tests
/scripts
  build-npm.ts                 — NPM distribution builder
```

## Public API

| Export | Signature | Returns |
|--------|-----------|---------|
| `data` | `{ adjs, colors, nouns }` | Raw word lists |
| `getRandomHumanReadable` | `(options?: Partial<Options>) => string \| string[]` | Main generator |
| `getRandomSentence` | `(rhrOptions?, probability?) => string` | Random sentence |
| `getRandomParagraph` | `(min?, max?, probability?) => string` | Random paragraph |
| `getRandomAdj` | `() => string` | Random adjective |
| `getRandomColor` | `() => string` | Random color name |
| `getRandomNoun` | `() => string` | Random noun |
| `getRandomVowel` | `() => string` | Single vowel |
| `getRandomConsonant` | `() => string` | Single consonant |
| `getRandomSyllable` | `() => string` | CV syllable |
| `getRandomDigit` | `() => string` | Random digit (0-9) |
| `getRandomSpecialChar` | `() => string` | Random special char |
| `randomizeCase` | `(str: string) => string` | Random case per char |

## Options Interface
```typescript
interface Options {
  adjCount: number;        // default: 1
  colorsCount: number;     // default: 1
  nounsCount: number;      // default: 2
  syllablesCount: number;  // default: 0
  digitsCount: number;     // default: 0
  specialCharsCount: number; // default: 0
  randomizeCase: boolean;  // default: false
  joinWith: string | false; // default: "-"
}
```

## Critical Conventions
1. All implementation in single file `src/random-human-readable.ts`
2. Entry point `src/mod.ts` only re-exports
3. Word lists are plain string arrays — no dependencies
4. `joinWith: false` returns `string[]` instead of `string`

## Before Making Changes
- [ ] Check existing patterns in the implementation file
- [ ] Run `deno task test`
- [ ] Run `deno fmt`
