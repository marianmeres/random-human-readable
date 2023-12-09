# @marianmeres/random-human-readable

Simple utility function to help generating random but human readable
strings. The internal english words dictionary has about ~1500 nouns, ~250 adjectives
and ~130 colors, which makes - **with default options** - over 48 billion unique choices.

Should you worry about collision, you can grow the count of possible choices by orders
of magnitude by simply increasing the `adjCount/colorsCount/nounsCount/syllablesCount`
options and/or setting the `randomizeCase` flag.

Playground: https://rhr.meres.sk/

## Installation

```shell
$ npm i @marianmeres/random-human-readable
```

## Main usage

```javascript
import { getRandomHumanReadable } from '@marianmeres/random-human-readable';

// all options are optional, and the generation order is always:
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
	joinWith: '-',

	// since many password validators require digits and/or special chars (and this tool
	// can be used as a password generator), these are also supported, although they
	// are not really human readable (in this context)
	digitsCount: number,
	specialCharsCount: number,
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

or, if you're feeling options-adventurous:

```javascript
getRandomHumanReadable({
	adjCount: 5,
	syllablesCount: 4,
	randomizeCase: true,
	// other options will be inherited from the defaults if not provided
});
```

you may get something like this:

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
randomizeCase(str);

// somewhat off topic and quite opinionated "lorem ipsum like" helpers
getRandomSentence(options: Partial<Options>[] = [], shorterSentenceProbability = 0.33);
getRandomParagraph(minSentences = 1, maxSentences = 5, shorterSentenceProbability = 0.33);
```
