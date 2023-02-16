# @marianmeres/random-human-readable

Simple utility function to help generating random but human readable
strings. The internal english words dictionary has about ~1500 nouns, ~250 adjectives
and ~60 colors, which makes - **with default options** - over 22 million unique choices.

Should you worry about collision, you can grow the count of possible choices by orders
of magnitude by simply increasing the `adjCount/colorsCount/nounsCount/syllablesCount`
options and/or setting the `randomizeCase` flag.

## Installation
```shell
$ npm i @marianmeres/random-human-readable
```

## Main usage
```javascript
// all options are optional, and the generation order is always:
// 1. adjectives, 2. colors, 3. nouns, 4. syllables
getRandomHumanReadable({
    // number of adjectives english words to generate
    adjCount: 1,
    // number of color english words to generate
    colorsCount: 1,
    // number of noun english words to generate
    nounsCount: 1,
    // number of nonsene syllables to generate
    syllablesCount: 0,
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
```
