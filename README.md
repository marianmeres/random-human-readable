# @marianmeres/clog
Simple utility function to help generating random but human readable english words. The
internal words dictionary has about ~1500 nouns, ~250 adjectives and ~60 colors.
With default options (one of each and no nonsene syllables suffix and case randomization),
there should be over 22 million unique choices.

Should you worry about collision, either increase the counts and/or randomize case.

## Installation
```shell
$ npm i @marianmeres/random-human-readable
```

## Main usage
```javascript
// all options are optional, and generation order is always;
// 1. adjectives, 2. colors, 3. nouns, 4. syllables
getRandomHumanReadable({
    // number of adjectives english words to generate
    adjCount: 1,
    // number of color english words to generate
    colorsCount: 1,
    // number od noun english words to generate
    nounsCount: 1,
    // number of nonsene syllables to generate
    syllablesCount: 1,
    // if true, will RanDOmiZe case on generated output
    randomizeCase: false,
	// use false to disable joining and return as array
    // otherwise it will join the generated words with it and return as string
    joinWith: '-'
});

```

Example results (with default options):
```
clean-pink-garbage
quick-orchid-nobody
rhythmic-peru-river
dry-teal-trouble
shrilling-turquoise-choice
faint-ivory-square
nutty-icy-knowledge
young-slategray-long
immense-snow-make
round-aqua-bedroom
```

or, if you're feeling options-adventurous:
```javascript
getRandomHumanReadable({
    adjCount: 5,
    syllablesCount: 4,
    randomizeCase: true
})
```
you may get something like this:
```
shRiLLing-helPLESs-Tiny-jollY-ScrawNy-KHAki-PRiEsT-ZIFuvACy
```

## Other exposed internals
```typescript
data = { adjs, colors, nouns };
// all return string
getRandomAdj();
getRandomColor();
getRandomNoun();
getRandomVowel();
getRandomConsonant();
getRandomSyllable();
randomizeCase(str);
```
