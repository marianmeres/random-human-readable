import { adjs } from './adjs.js';
import { nouns } from './nouns.js';
import { colors } from './colors.js';

const vowels = 'aeiouy'.split('');
const consonants = 'bcdfghjklmnpqrstvwxz'.split('');
const digits = '0123456789'.split('');

// not including underscore "_" here, so it safely matches \W (not word char) class
const specialChars = '\\"\'!#$%&()*+,-./:;<=>?@[]^`{|}~'.split('');

// helpers
const getRandomInt = (min: number, exclusiveMax: number) => {
	min = Math.ceil(min);
	exclusiveMax = Math.floor(exclusiveMax);
	return Math.floor(Math.random() * (exclusiveMax - min) + min);
};

const getRandomArrayItem = (arr: any[]) => arr[getRandomInt(0, arr.length)];

const times = (n: number, cb: Function) => {
	n = Math.abs(n);
	if (isNaN(n)) throw new TypeError(`Expecting number`);
	while (n-- > 0) cb();
};

// api
export const data = { adjs, colors, nouns };

export const getRandomAdj = (): string => getRandomArrayItem(adjs);

export const getRandomColor = (): string => getRandomArrayItem(colors);

export const getRandomNoun = (): string => getRandomArrayItem(nouns);

export const getRandomVowel = (): string => getRandomArrayItem(vowels);

export const getRandomConsonant = (): string => getRandomArrayItem(consonants);

export const getRandomSyllable = (): string =>
	[getRandomConsonant(), getRandomVowel()].join('');

export const getRandomDigit = (): string => getRandomArrayItem(digits);

export const getRandomSpecialChar = (): string => getRandomArrayItem(specialChars);

export const randomizeCase = (str: string): string =>
	str
		.split('')
		.map((c) => (Math.random() >= 0.5 ? c.toLowerCase() : c.toUpperCase()))
		.join('');

// main api - all in one

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

const defaultOptions = {
	adjCount: 1,
	colorsCount: 1,
	nounsCount: 2,
	syllablesCount: 0,
	digitsCount: 0,
	specialCharsCount: 0,
	randomizeCase: false,
	joinWith: '-',
};

export const getRandomHumanReadable = (
	options: Partial<Options> = {}
): string | string[] => {
	const {
		adjCount,
		colorsCount,
		nounsCount,
		syllablesCount,
		digitsCount: numbersCount,
		specialCharsCount,
		joinWith,
	} = {
		...defaultOptions,
		...(options || {}),
	};

	let out: string[] = [];

	adjCount && times(adjCount, () => out.push(getRandomAdj()));

	colorsCount && times(colorsCount, () => out.push(getRandomColor()));

	nounsCount && times(nounsCount, () => out.push(getRandomNoun()));

	if (syllablesCount) {
		const syls: string[] = [];
		times(syllablesCount, () => syls.push(getRandomSyllable()));
		out.push(syls.join(''));
	}

	if (numbersCount) {
		const s: string[] = [];
		times(numbersCount, () => s.push(getRandomDigit()));
		out.push(s.join(''));
	}

	if (specialCharsCount) {
		const s: string[] = [];
		times(specialCharsCount, () => s.push(getRandomSpecialChar()));
		out.push(s.join(''));
	}

	options.randomizeCase && (out = out.map(randomizeCase));

	return joinWith !== false ? out.join(joinWith) : out;
};

// opinionated DRY helper
export const getRandomSentence = (
	rhrOptions: Partial<Options>[] = [],
	shorterSentenceProbability = 0.33
): string => {
	rhrOptions ||= [];
	if (!rhrOptions.length) {
		rhrOptions = [
			{ adjCount: 1, colorsCount: 1, nounsCount: 2 },
			{ adjCount: 2, colorsCount: 0, nounsCount: 2 },
			{ adjCount: 1, colorsCount: 0, nounsCount: 1 },
		];
	}
	const ucf = (s: string) => s[0].toUpperCase() + s.slice(1); // ucfirst
	const rhr = (): string =>
		getRandomHumanReadable({
			...getRandomArrayItem(rhrOptions),
			joinWith: ' ',
		}) as string;

	//
	return Math.random() < shorterSentenceProbability * 1
		? ucf(rhr() + '.')
		: [ucf(rhr()), ' and ', rhr(), '.'].join('');
};

export const getRandomParagraph = (
	minSentences = 1,
	maxSentences = 5,
	shorterSentenceProbability = 0.33
): string => {
	let out: string[] = [];
	const min = Math.abs(minSentences);
	const max = Math.abs(maxSentences);
	const n = getRandomInt(Math.min(min, max), Math.max(min, max));
	times(n, () => out.push(getRandomSentence([], shorterSentenceProbability * 1)));
	return out.join(' ');
};
