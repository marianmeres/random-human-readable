# @marianmeres/random-human-readable

[![NPM](https://img.shields.io/npm/v/@marianmeres/random-human-readable)](https://www.npmjs.com/package/@marianmeres/random-human-readable)
[![JSR](https://jsr.io/badges/@marianmeres/random-human-readable)](https://jsr.io/@marianmeres/random-human-readable)
[![License](https://img.shields.io/npm/l/@marianmeres/random-human-readable)](LICENSE)

Simple utility function to generate random but human-readable
strings. The internal English words dictionary has ~1450 nouns, ~240 adjectives
and ~130 colors, which makes — **with default options** — over 66 billion unique choices.

Should you worry about collisions, you can grow the count of possible choices by orders
of magnitude by simply increasing the `adjCount/colorsCount/nounsCount/syllablesCount`
options and/or setting the `randomizeCase` flag.

Playground: https://rhr.meres.sk/

## Installation

```bash
# npm
npm install @marianmeres/random-human-readable

# jsr
deno add @marianmeres/random-human-readable
```

## Main usage

```javascript
import { getRandomHumanReadable } from "@marianmeres/random-human-readable";

// All options are optional, and the generation order is always:
// 1. adjectives, 2. colors, 3. nouns, 4. syllables, (5. digits, 6. special chars)
getRandomHumanReadable({
	// number of adjectives to generate
	adjCount: 1,
	// number of colors to generate
	colorsCount: 1,
	// number of nouns to generate
	nounsCount: 2,
	// number of (nonsense) syllables to generate
	syllablesCount: 0,
	// if true, will RanDOmiZe case on generated output
	randomizeCase: false,
	// string to join the generated words with
	// (use explicit `false` to disable joining and return as array of words)
	joinWith: "-",

	// Since many password validators require digits and/or special chars (and this tool
	// can be used as a password generator), these are also supported, although they
	// are not really human-readable (in this context)
	digitsCount: 0,
	specialCharsCount: 0,
});
```

Example results (with default options):

```
fit-transparent-mouse-phrase
massive-navy-wood-joint
unkempt-cadetblue-hand-branch
incalculable-brown-quality-tank
chubby-aquamarine-year-flower
wooden-springgreen-profit-personal
prickly-darkblue-incident-schedule
refined-blue-reason-policy
wide-white-contract-transition
whispering-burlywood-ring-pizza
```

Or, if you're feeling options-adventurous:

```javascript
getRandomHumanReadable({
	adjCount: 5,
	syllablesCount: 4,
	randomizeCase: true,
	// other options will be inherited from the defaults if not provided
});
```

You may get something like this:

```
shRiLLing-helPLESs-Tiny-jollY-ScrawNy-KHAki-PRiEsT-ZIFuvACy
```

## Other exposed internals

```typescript
// internal db
data = { adjs, colors, nouns };
// all below return string
getRandomAdj();
getRandomColor();
getRandomNoun();
getRandomVowel();
getRandomConsonant();
getRandomSyllable();
getRandomDigit();
getRandomSpecialChar();
randomizeCase(str);

// Somewhat off-topic and quite opinionated "lorem ipsum"-like helpers
getRandomSentence(options: Partial<Options>[] = [], shorterSentenceProbability = 0.33);
getRandomParagraph(minSentences = 1, maxSentences = 5, shorterSentenceProbability = 0.33);
```

## Custom word lists and deterministic output

For deterministic tests, fixtures, or domain-specific vocabularies use
`createGenerator`. It returns the same surface as the module-level exports
but bound to the supplied word lists and/or random source.

```typescript
import { createGenerator } from "@marianmeres/random-human-readable";

// Tiny seedable PRNG (mulberry32) — use any rng you like as long as it
// returns a float in [0, 1).
const seed = (s: number) => () => {
	s = (s + 0x6D2B79F5) >>> 0;
	let t = s;
	t = Math.imul(t ^ (t >>> 15), t | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const gen = createGenerator({
	rng: seed(42),
	// any of the lists may be overridden; the rest fall back to the built-ins
	adjs: ["shiny", "rusty", "lucky"],
});
gen.getRandomHumanReadable(); // deterministic given the seed
```

Alternatively, `setRandomSource(rng)` swaps the random source used by the
default module-level exports — handy for one-off test seeding without
threading a generator instance through your code.

## Validation

All count options (`adjCount`, `colorsCount`, ...) must be non-negative
integers; passing a fractional, negative, `NaN`, or non-finite value throws
a `TypeError`. `joinWith` must be a `string` or `false`. The
`shorterSentenceProbability` parameter must be in `[0, 1]`. In
`getRandomParagraph`, `minSentences` must be `<=` `maxSentences`.

## API

See [API.md](API.md) for complete API documentation.

## License

[MIT](LICENSE)
