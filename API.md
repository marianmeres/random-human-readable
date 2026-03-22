# API

## Functions

### `getRandomHumanReadable(options?)`

Generates a random human-readable string by combining adjectives, colors, nouns,
syllables, digits, and special characters.

**Parameters:**
- `options` (`Partial<Options>`, optional) — Configuration object:
  - `adjCount` (number) — Number of adjectives. Default: `1`
  - `colorsCount` (number) — Number of color names. Default: `1`
  - `nounsCount` (number) — Number of nouns. Default: `2`
  - `syllablesCount` (number) — Number of random syllables (joined as one segment). Default: `0`
  - `digitsCount` (number) — Number of random digits (joined as one segment). Default: `0`
  - `specialCharsCount` (number) — Number of random special characters (joined as one segment). Default: `0`
  - `randomizeCase` (boolean) — Randomly upper/lowercase each character. Default: `false`
  - `joinWith` (string | false) — Separator string, or `false` to return array. Default: `"-"`

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
- `shorterSentenceProbability` (number, optional) — Probability of generating a shorter sentence (0-1). Default: `0.33`

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
- `minSentences` (number, optional) — Minimum sentence count. Default: `1`
- `maxSentences` (number, optional) — Maximum sentence count. Default: `5`
- `shorterSentenceProbability` (number, optional) — Probability of shorter sentences. Default: `0.33`

**Returns:** `string`

**Example:**
```typescript
getRandomParagraph(2, 4);
// => "Brave coral mountain river. Calm fierce piano and river mountain."
```

---

### `getRandomAdj()`

Returns a random adjective from the built-in list (266 items).

**Returns:** `string`

---

### `getRandomColor()`

Returns a random CSS color name from the built-in list (154 items).

**Returns:** `string`

---

### `getRandomNoun()`

Returns a random noun from the built-in list (1461 items).

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

## Constants

### `data`

`{ adjs: string[], colors: string[], nouns: string[] }` — Raw word lists used by the generators.

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

All fields accept `Partial<Options>` — unspecified fields use defaults.
