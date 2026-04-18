# API

## Functions

### `getRandomHumanReadable(options?)`

Generates a random human-readable string by combining adjectives, colors, nouns,
syllables, digits, and special characters.

**Parameters:**

- `options` (`Partial<Options>`, optional) — Configuration object:
  - `adjCount` (non-negative integer) — Number of adjectives. Default: `1`
  - `colorsCount` (non-negative integer) — Number of color names. Default: `1`
  - `nounsCount` (non-negative integer) — Number of nouns. Default: `2`
  - `syllablesCount` (non-negative integer) — Number of random syllables (joined as one segment). Default: `0`
  - `digitsCount` (non-negative integer) — Number of random digits (joined as one segment). Default: `0`
  - `specialCharsCount` (non-negative integer) — Number of random special characters (joined as one segment). Default: `0`
  - `randomizeCase` (boolean) — Randomly upper/lowercase each character. Default: `false`
  - `joinWith` (string | false) — Separator string, or `false` to return array. Default: `"-"`

All count options are validated: passing a negative, fractional, `NaN`, or non-finite value throws `TypeError`. Passing an invalid `joinWith` (anything other than a `string` or `false`) throws `TypeError`. Explicit `undefined` for any option falls back to the default.

**Returns:** `string | string[]` — Joined string when `joinWith` is a string, array of parts when `joinWith` is `false`.

**Example:**

```typescript
getRandomHumanReadable();
// => "brave-coral-mountain-river"

getRandomHumanReadable({ adjCount: 0, colorsCount: 0, nounsCount: 3, joinWith: "." });
// => "mountain.river.piano"

getRandomHumanReadable({ joinWith: false });
// => ["brave", "coral", "mountain", "river"]
```

---

### `getRandomSentence(rhrOptions?, shorterSentenceProbability?)`

Generates a random sentence using human-readable word combinations.

**Parameters:**

- `rhrOptions` (`Partial<Options>[]`, optional) — Array of option sets to randomly pick from. Default: mixed presets
- `shorterSentenceProbability` (number in `[0, 1]`, optional) — Probability of generating a shorter sentence. Out-of-range values throw `RangeError`. Default: `0.33`

**Returns:** `string`

**Example:**

```typescript
getRandomSentence();
// => "Brave coral mountain and river piano."
```

---

### `getRandomParagraph(minSentences?, maxSentences?, shorterSentenceProbability?)`

Generates a random paragraph of sentences.

**Parameters:**

- `minSentences` (non-negative integer, optional) — Minimum sentence count (inclusive). Default: `1`
- `maxSentences` (non-negative integer, optional) — Maximum sentence count (inclusive). Must be `>= minSentences`, otherwise throws `RangeError`. Default: `5`
- `shorterSentenceProbability` (number in `[0, 1]`, optional) — Probability of shorter sentences. Default: `0.33`

**Returns:** `string`

**Example:**

```typescript
getRandomParagraph(2, 4);
// => "Brave coral mountain river. Calm fierce piano and river mountain."
```

---

### `getRandomAdj()`

Returns a random adjective from the built-in list (244 items).

**Returns:** `string`

---

### `getRandomColor()`

Returns a random CSS color name from the built-in list (129 items).

**Returns:** `string`

---

### `getRandomNoun()`

Returns a random noun from the built-in list (1458 items).

**Returns:** `string`

---

### `getRandomVowel()`

Returns a random vowel (`a`, `e`, `i`, `o`, `u`, `y`).

**Returns:** `string`

---

### `getRandomConsonant()`

Returns a random consonant.

**Returns:** `string`

---

### `getRandomSyllable()`

Returns a random CV (consonant + vowel) syllable.

**Returns:** `string`

---

### `getRandomDigit()`

Returns a random digit character (`"0"` through `"9"`).

**Returns:** `string`

---

### `getRandomSpecialChar()`

Returns a random special character (excluding underscore).

**Returns:** `string`

---

### `randomizeCase(str)`

Randomly upper- or lowercases each character in the string.

**Parameters:**

- `str` (string) — Input string

**Returns:** `string`

**Example:**

```typescript
randomizeCase("hello");
// => "hElLo" (varies)
```

---

### `createGenerator(opts?)`

Creates a generator bound to custom word lists and/or a custom random source. Returns the same surface as the module-level exports.

**Parameters:**

- `opts` (`GeneratorOptions`, optional):
  - `adjs` (`readonly string[]`, optional) — Custom adjective list. Falls back to the built-in.
  - `colors` (`readonly string[]`, optional) — Custom color list.
  - `nouns` (`readonly string[]`, optional) — Custom noun list.
  - `rng` (`() => number`, optional) — Custom random source returning `[0, 1)`. Falls back to `Math.random`.

Empty word lists or non-function `rng` throw `TypeError`.

**Returns:** `Generator` — an object exposing `data`, `getRandomAdj`, `getRandomColor`, `getRandomNoun`, `getRandomVowel`, `getRandomConsonant`, `getRandomSyllable`, `getRandomDigit`, `getRandomSpecialChar`, `randomizeCase`, `getRandomHumanReadable`, `getRandomSentence`, `getRandomParagraph`.

**Example:**

```typescript
import { createGenerator } from "@marianmeres/random-human-readable";

const gen = createGenerator({ rng: seededRng(42) });
gen.getRandomHumanReadable(); // deterministic given the seed
```

---

### `setRandomSource(rng)` / `getRandomSource()`

Replaces / reads the random source used by the default module-level generator.

**Parameters:**

- `rng` (`() => number`) — function returning `[0, 1)`. Non-functions throw `TypeError`.

`setRandomSource` rebuilds the default generator using the new rng. Custom generators created via `createGenerator({ rng })` are unaffected.

---

## Constants

### `data`

`{ adjs: readonly string[], colors: readonly string[], nouns: readonly string[] }` — Raw word lists used by the default module-level generator.

---

## Types

### `Options`

```typescript
interface Options {
	adjCount: number;
	colorsCount: number;
	nounsCount: number;
	syllablesCount: number;
	randomizeCase: boolean;
	digitsCount: number;
	specialCharsCount: number;
	joinWith: string | false;
}
```

All fields accept `Partial<Options>` — unspecified fields (and explicit `undefined`) use defaults.

### `GeneratorOptions`

```typescript
interface GeneratorOptions {
	adjs?: readonly string[];
	colors?: readonly string[];
	nouns?: readonly string[];
	rng?: () => number;
}
```

### `Generator`

The type returned by `createGenerator`. Mirrors the module-level public surface.
