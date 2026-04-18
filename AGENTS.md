# @marianmeres/random-human-readable — Agent Guide

## Quick Reference

- **Stack**: Deno, TypeScript (zero runtime deps)
- **Test**: `deno task test` | **Watch**: `deno task test:watch`
- **Build npm**: `deno task npm:build` | **Publish**: `deno task publish`
- **Playground**: `deno task playground:dev` (dev) | `deno task playground:build` (build)
- **Format**: `deno fmt`

## Project Structure

```
/src
  mod.ts                       — Entry point (re-exports)
  random-human-readable.ts     — All implementation
  adjs.ts                      — Adjectives word list (244 items, deduped)
  colors.ts                    — CSS color names list (129 items)
  nouns.ts                     — Nouns word list (1458 items, deduped)
/tests
  random-human-readable.test.ts — Runtime tests
  types.test-d.ts              — Compile-time type assertions
/scripts
  build-npm.ts                 — NPM distribution builder
/playground                    — Browser demo (https://rhr.meres.sk/)
mcp.ts                         — MCP tool definitions (random-human-readable + paragraph)
```

## Public API

| Export                   | Signature                                            | Returns                                  |
| ------------------------ | ---------------------------------------------------- | ---------------------------------------- |
| `data`                   | `{ adjs, colors, nouns }`                            | Raw word lists                           |
| `getRandomHumanReadable` | `(options?: Partial<Options>) => string \| string[]` | Main generator                           |
| `getRandomSentence`      | `(rhrOptions?, probability?) => string`              | Random sentence                          |
| `getRandomParagraph`     | `(min?, max?, probability?) => string`               | Random paragraph                         |
| `getRandomAdj`           | `() => string`                                       | Random adjective                         |
| `getRandomColor`         | `() => string`                                       | Random color name                        |
| `getRandomNoun`          | `() => string`                                       | Random noun                              |
| `getRandomVowel`         | `() => string`                                       | Single vowel                             |
| `getRandomConsonant`     | `() => string`                                       | Single consonant                         |
| `getRandomSyllable`      | `() => string`                                       | CV syllable                              |
| `getRandomDigit`         | `() => string`                                       | Random digit (0-9)                       |
| `getRandomSpecialChar`   | `() => string`                                       | Random special char                      |
| `randomizeCase`          | `(str: string) => string`                            | Random case per char                     |
| `createGenerator`        | `(opts?: GeneratorOptions) => Generator`             | Factory bound to custom word lists / rng |
| `setRandomSource`        | `(rng: () => number) => void`                        | Swap default generator's rng             |
| `getRandomSource`        | `() => () => number`                                 | Read default generator's rng             |

## Options Interface

```typescript
interface Options {
	adjCount: number; // default: 1
	colorsCount: number; // default: 1
	nounsCount: number; // default: 2
	syllablesCount: number; // default: 0
	digitsCount: number; // default: 0
	specialCharsCount: number; // default: 0
	randomizeCase: boolean; // default: false
	joinWith: string | false; // default: "-"
}
```

## Critical Conventions

1. All implementation in single file `src/random-human-readable.ts`
2. Entry point `src/mod.ts` only re-exports
3. Word lists are plain string arrays — no dependencies
4. `joinWith: false` returns `string[]` instead of `string`
5. Module-level exports are bound to a default generator created from the built-in word lists and `Math.random`. Both can be swapped via `setRandomSource()` (rng only) or replaced wholesale via `createGenerator()` (rng + lists).
6. All count options validate to non-negative integers; `shorterSentenceProbability` validates to `[0, 1]`. Invalid input throws `TypeError`/`RangeError` rather than coercing.

## Validation Rules (enforced at runtime)

| Input                                     | Constraint                                        | Throws       |
| ----------------------------------------- | ------------------------------------------------- | ------------ |
| Any `*Count` option                       | Non-negative integer (`Number.isInteger && >= 0`) | `TypeError`  |
| `joinWith`                                | `string` or literal `false`                       | `TypeError`  |
| `shorterSentenceProbability`              | Number in `[0, 1]`                                | `RangeError` |
| `getRandomParagraph` min/max              | `minSentences <= maxSentences`                    | `RangeError` |
| `createGenerator` word lists              | Non-empty array                                   | `TypeError`  |
| `createGenerator` / `setRandomSource` rng | `typeof === "function"`                           | `TypeError`  |

Explicit `undefined` for any option falls back to its default (does not throw).

## Documentation Index

- [README.md](./README.md) — User-facing usage and quick examples
- [API.md](./API.md) — Complete API reference

## Before Making Changes

- [ ] Check existing patterns in the implementation file
- [ ] Run `deno task test` (must hit 100% branch coverage)
- [ ] Run `deno fmt`
- [ ] If word lists change: update counts in [README.md](./README.md), [API.md](./API.md), [mcp.ts](./mcp.ts), and this file
