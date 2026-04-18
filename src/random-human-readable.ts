import { adjs as defaultAdjs } from "./adjs.ts";
import { nouns as defaultNouns } from "./nouns.ts";
import { colors as defaultColors } from "./colors.ts";

const vowels = "aeiouy".split("");
const consonants = "bcdfghjklmnpqrstvwxz".split("");
const digits = "0123456789".split("");

// not including underscore "_" here, so it safely matches \W (not word char) class
const specialChars = "\\\"'!#$%&()*+,-./:;<=>?@[]^`{|}~".split("");

const assertCount = (n: number, name: string): void => {
	if (typeof n !== "number" || !Number.isFinite(n) || !Number.isInteger(n) || n < 0) {
		throw new TypeError(
			`Expecting '${name}' to be a non-negative integer, got: ${n}`,
		);
	}
};

const assertProbability = (p: number, name: string): void => {
	if (typeof p !== "number" || !Number.isFinite(p) || p < 0 || p > 1) {
		throw new RangeError(
			`Expecting '${name}' to be a number in [0, 1], got: ${p}`,
		);
	}
};

const assertRng = (rng: unknown): void => {
	if (typeof rng !== "function") {
		throw new TypeError(`Expecting 'rng' to be a function, got: ${typeof rng}`);
	}
};

const times = (n: number, cb: () => void) => {
	while (n-- > 0) cb();
};

/** Options for `getRandomHumanReadable`. */
export interface Options {
	adjCount: number;
	colorsCount: number;
	nounsCount: number;
	syllablesCount: number;
	randomizeCase: boolean;
	digitsCount: number;
	specialCharsCount: number;
	joinWith: string | false;
}

const defaultOptions: Options = {
	adjCount: 1,
	colorsCount: 1,
	nounsCount: 2,
	syllablesCount: 0,
	digitsCount: 0,
	specialCharsCount: 0,
	randomizeCase: false,
	joinWith: "-",
};

/** Options for `createGenerator`. */
export interface GeneratorOptions {
	/** Custom adjective list. Defaults to the built-in list. */
	adjs?: readonly string[];
	/** Custom color list. Defaults to the built-in list. */
	colors?: readonly string[];
	/** Custom noun list. Defaults to the built-in list. */
	nouns?: readonly string[];
	/** Custom random source. Must return a float in [0, 1). Defaults to `Math.random`. */
	rng?: () => number;
}

/** A bound generator returned by `createGenerator`. Mirrors the module-level public API. */
export interface Generator {
	readonly data: {
		readonly adjs: readonly string[];
		readonly colors: readonly string[];
		readonly nouns: readonly string[];
	};
	getRandomAdj(): string;
	getRandomColor(): string;
	getRandomNoun(): string;
	getRandomVowel(): string;
	getRandomConsonant(): string;
	getRandomSyllable(): string;
	getRandomDigit(): string;
	getRandomSpecialChar(): string;
	randomizeCase(str: string): string;
	getRandomHumanReadable<
		Input extends Partial<Options> = Partial<Options>,
		Output = [Input["joinWith"]] extends [false] ? string[] : string,
	>(options?: Input): Output;
	getRandomSentence(
		rhrOptions?: Partial<Options>[],
		shorterSentenceProbability?: number,
	): string;
	getRandomParagraph(
		minSentences?: number,
		maxSentences?: number,
		shorterSentenceProbability?: number,
	): string;
}

const assertNonEmptyList = (arr: readonly string[], name: string): void => {
	if (!Array.isArray(arr) || arr.length === 0) {
		throw new TypeError(`Expecting '${name}' to be a non-empty array of strings`);
	}
};

/**
 * Creates a generator bound to custom word lists and/or a custom random source.
 * Returns the same surface as the module-level exports, but isolated — useful
 * for deterministic fixtures, i18n, or domain-specific vocabularies.
 */
export const createGenerator = (opts: GeneratorOptions = {}): Generator => {
	const adjs = opts.adjs ?? defaultAdjs;
	const colors = opts.colors ?? defaultColors;
	const nouns = opts.nouns ?? defaultNouns;
	const rng = opts.rng ?? Math.random;

	assertNonEmptyList(adjs, "adjs");
	assertNonEmptyList(colors, "colors");
	assertNonEmptyList(nouns, "nouns");
	assertRng(rng);

	const getRandomInt = (min: number, exclusiveMax: number): number =>
		min + Math.floor(rng() * (exclusiveMax - min));

	const getRandomArrayItem = <T>(arr: readonly T[]): T =>
		arr[getRandomInt(0, arr.length)];

	const getRandomAdj = (): string => getRandomArrayItem(adjs);
	const getRandomColor = (): string => getRandomArrayItem(colors);
	const getRandomNoun = (): string => getRandomArrayItem(nouns);
	const getRandomVowel = (): string => getRandomArrayItem(vowels);
	const getRandomConsonant = (): string => getRandomArrayItem(consonants);
	const getRandomSyllable = (): string => getRandomConsonant() + getRandomVowel();
	const getRandomDigit = (): string => getRandomArrayItem(digits);
	const getRandomSpecialChar = (): string => getRandomArrayItem(specialChars);

	const randomizeCase = (str: string): string =>
		str
			.split("")
			.map((c) => (rng() < 0.5 ? c.toLowerCase() : c.toUpperCase()))
			.join("");

	const getRandomHumanReadable = <
		Input extends Partial<Options> = Partial<Options>,
		Output = [Input["joinWith"]] extends [false] ? string[] : string,
	>(
		options?: Input,
	): Output => {
		const merged = { ...defaultOptions } as Record<string, unknown>;
		if (options) {
			for (const k in options) {
				const v = (options as Record<string, unknown>)[k];
				if (v !== undefined) merged[k] = v;
			}
		}
		const {
			adjCount,
			colorsCount,
			nounsCount,
			syllablesCount,
			digitsCount,
			specialCharsCount,
			randomizeCase: shouldRandomizeCase,
			joinWith,
		} = merged as unknown as Options;

		assertCount(adjCount, "adjCount");
		assertCount(colorsCount, "colorsCount");
		assertCount(nounsCount, "nounsCount");
		assertCount(syllablesCount, "syllablesCount");
		assertCount(digitsCount, "digitsCount");
		assertCount(specialCharsCount, "specialCharsCount");

		if (joinWith !== false && typeof joinWith !== "string") {
			throw new TypeError(
				`Expecting 'joinWith' to be a string or false, got: ${joinWith}`,
			);
		}

		let out: string[] = [];

		times(adjCount, () => out.push(getRandomAdj()));
		times(colorsCount, () => out.push(getRandomColor()));
		times(nounsCount, () => out.push(getRandomNoun()));

		if (syllablesCount) {
			const syls: string[] = [];
			times(syllablesCount, () => syls.push(getRandomSyllable()));
			out.push(syls.join(""));
		}

		if (digitsCount) {
			const s: string[] = [];
			times(digitsCount, () => s.push(getRandomDigit()));
			out.push(s.join(""));
		}

		if (specialCharsCount) {
			const s: string[] = [];
			times(specialCharsCount, () => s.push(getRandomSpecialChar()));
			out.push(s.join(""));
		}

		if (shouldRandomizeCase) out = out.map(randomizeCase);

		return (joinWith === false ? out : out.join(joinWith)) as Output;
	};

	const getRandomSentence = (
		rhrOptions: Partial<Options>[] = [],
		shorterSentenceProbability = 0.33,
	): string => {
		assertProbability(shorterSentenceProbability, "shorterSentenceProbability");
		if (!rhrOptions.length) {
			rhrOptions = [
				{ adjCount: 1, colorsCount: 1, nounsCount: 2 },
				{ adjCount: 2, colorsCount: 0, nounsCount: 2 },
				{ adjCount: 1, colorsCount: 0, nounsCount: 1 },
			];
		}
		const ucf = (s: string) => s[0].toUpperCase() + s.slice(1);
		const rhr = (): string =>
			getRandomHumanReadable({
				...getRandomArrayItem(rhrOptions),
				joinWith: " ",
			}) as string;

		return rng() < shorterSentenceProbability
			? ucf(rhr() + ".")
			: [ucf(rhr()), getRandomArrayItem([" and ", " or "]), rhr(), "."].join("");
	};

	const getRandomParagraph = (
		minSentences = 1,
		maxSentences = 5,
		shorterSentenceProbability = 0.33,
	): string => {
		assertCount(minSentences, "minSentences");
		assertCount(maxSentences, "maxSentences");
		if (minSentences > maxSentences) {
			throw new RangeError(
				`Expecting 'minSentences' (${minSentences}) <= 'maxSentences' (${maxSentences})`,
			);
		}
		assertProbability(shorterSentenceProbability, "shorterSentenceProbability");
		const out: string[] = [];
		const n = getRandomInt(minSentences, maxSentences + 1);
		times(n, () => out.push(getRandomSentence([], shorterSentenceProbability)));
		return out.join(" ");
	};

	return {
		data: { adjs, colors, nouns },
		getRandomAdj,
		getRandomColor,
		getRandomNoun,
		getRandomVowel,
		getRandomConsonant,
		getRandomSyllable,
		getRandomDigit,
		getRandomSpecialChar,
		randomizeCase,
		getRandomHumanReadable,
		getRandomSentence,
		getRandomParagraph,
	};
};

// The default generator backs the module-level exports. It is rebuilt whenever
// `setRandomSource` is called so swapping the RNG affects every default export.
let defaultGenerator = createGenerator();
let currentRng: () => number = Math.random;

/** Returns the current random source used by the default module-level generator. */
export const getRandomSource = (): () => number => currentRng;

/**
 * Replaces the random source used by the default module-level generator.
 * Useful for deterministic tests. Custom generators created via
 * `createGenerator({ rng })` are unaffected.
 */
export const setRandomSource = (rng: () => number): void => {
	assertRng(rng);
	currentRng = rng;
	defaultGenerator = createGenerator({ rng });
};

/** Raw word lists used by the default module-level generator. */
export const data: Generator["data"] = defaultGenerator.data;

/** Returns a random adjective. */
export const getRandomAdj = (): string => defaultGenerator.getRandomAdj();

/** Returns a random CSS color name. */
export const getRandomColor = (): string => defaultGenerator.getRandomColor();

/** Returns a random noun. */
export const getRandomNoun = (): string => defaultGenerator.getRandomNoun();

/** Returns a random vowel. */
export const getRandomVowel = (): string => defaultGenerator.getRandomVowel();

/** Returns a random consonant. */
export const getRandomConsonant = (): string => defaultGenerator.getRandomConsonant();

/** Returns a random CV (consonant + vowel) syllable. */
export const getRandomSyllable = (): string => defaultGenerator.getRandomSyllable();

/** Returns a random digit character ("0" through "9"). */
export const getRandomDigit = (): string => defaultGenerator.getRandomDigit();

/** Returns a random special character (excluding underscore). */
export const getRandomSpecialChar = (): string => defaultGenerator.getRandomSpecialChar();

/** Randomly upper- or lowercases each character in the string. */
export const randomizeCase = (str: string): string => defaultGenerator.randomizeCase(str);

/**
 * Generates a random human-readable string by combining adjectives, colors,
 * nouns, syllables, digits, and special characters.
 * Returns a joined string by default, or an array of parts when `joinWith` is `false`.
 */
export const getRandomHumanReadable = <
	Input extends Partial<Options> = Partial<Options>,
	Output = Input["joinWith"] extends string | undefined ? string : string[],
>(
	options?: Input,
): Output => defaultGenerator.getRandomHumanReadable<Input, Output>(options);

/** Generates a random sentence using human-readable word combinations. */
export const getRandomSentence = (
	rhrOptions: Partial<Options>[] = [],
	shorterSentenceProbability = 0.33,
): string => defaultGenerator.getRandomSentence(rhrOptions, shorterSentenceProbability);

/** Generates a random paragraph of sentences (lorem ipsum alternative). */
export const getRandomParagraph = (
	minSentences = 1,
	maxSentences = 5,
	shorterSentenceProbability = 0.33,
): string =>
	defaultGenerator.getRandomParagraph(
		minSentences,
		maxSentences,
		shorterSentenceProbability,
	);
