import { assert, assertEquals, assertThrows } from "@std/assert";
import {
	createGenerator,
	data,
	getRandomAdj,
	getRandomColor,
	getRandomConsonant,
	getRandomDigit,
	getRandomHumanReadable,
	getRandomNoun,
	getRandomParagraph,
	getRandomSentence,
	getRandomSource,
	getRandomSpecialChar,
	getRandomSyllable,
	getRandomVowel,
	randomizeCase,
	setRandomSource,
} from "../src/random-human-readable.ts";

// Small deterministic PRNG (mulberry32) used to verify rng injection.
const mulberry32 = (seed: number): () => number => {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6D2B79F5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};

const times = (n: number, cb: () => void) => {
	n = Math.abs(n);
	if (isNaN(n)) throw new TypeError(`Expecting number`);
	while (n-- > 0) cb();
};

const none = {
	adjCount: 0,
	colorsCount: 0,
	nounsCount: 0,
	syllablesCount: 0,
	digitsCount: 0,
	specialCharsCount: 0,
	randomizeCase: false,
	joinWith: "" as string | false,
};

Deno.test("sanity check", () => {
	assert(data.adjs.includes(getRandomAdj()));
	assert(data.colors.includes(getRandomColor()));
	assert(data.nouns.includes(getRandomNoun()));
	assertEquals(getRandomSyllable().length, 2);
	assert(/abcdefg/i.test(randomizeCase("abcdefg")));
	assert(randomizeCase("abcdefg") !== randomizeCase("abcdefg"));
});

Deno.test("main fn works", () => {
	const log: Record<string, boolean> = {};
	times(100, () => {
		log[getRandomHumanReadable() as string] = true;
	});
	assertEquals(Object.keys(log).length, 100);
	Object.keys(log).forEach((k) => {
		assertEquals(
			k.split("-").length,
			4,
			`Expecting '${k}' to have 4 parts`,
		);
	});
});

Deno.test("get sentence", () => {
	assert(typeof getRandomSentence() === "string");
});

Deno.test("digits", () => {
	assert(
		/^\d{3}$/.test(
			getRandomHumanReadable({ ...none, digitsCount: 3 }) as string,
		),
	);
});

Deno.test("special chars", () => {
	assert(
		/^[\W]{500}$/.test(
			getRandomHumanReadable({
				...none,
				specialCharsCount: 500,
			}) as string,
		),
	);
});

Deno.test("random paragraph", () => {
	assert(typeof getRandomParagraph() === "string");
});

Deno.test("single-char helpers return values from their alphabets", () => {
	times(50, () => {
		assert("aeiouy".includes(getRandomVowel()));
		assert("bcdfghjklmnpqrstvwxz".includes(getRandomConsonant()));
		assert("0123456789".includes(getRandomDigit()));
		assert(/[\W]/.test(getRandomSpecialChar()));
	});
});

Deno.test("syllables segment is one joined chunk of 2N chars", () => {
	const out = getRandomHumanReadable({
		...none,
		syllablesCount: 4,
		joinWith: false,
	}) as string[];
	assertEquals(out.length, 1);
	assertEquals(out[0].length, 8);
});

Deno.test("randomizeCase option mixes case in the output", () => {
	let mixed = false;
	times(20, () => {
		const s = getRandomHumanReadable({
			...none,
			adjCount: 3,
			randomizeCase: true,
			joinWith: "",
		}) as string;
		if (/[a-z]/.test(s) && /[A-Z]/.test(s)) mixed = true;
	});
	assert(mixed, "expected at least one mixed-case output across 20 trials");
});

Deno.test("joinWith: false returns array; joinWith: undefined uses default", () => {
	const arr = getRandomHumanReadable({ joinWith: false });
	assert(Array.isArray(arr));
	const str = getRandomHumanReadable({ joinWith: undefined });
	assertEquals(typeof str, "string");
	assert((str as string).includes("-"));
});

Deno.test("invalid count inputs throw TypeError", () => {
	assertThrows(
		() => getRandomHumanReadable({ adjCount: Infinity }),
		TypeError,
	);
	assertThrows(() => getRandomHumanReadable({ adjCount: NaN }), TypeError);
	assertThrows(() => getRandomHumanReadable({ adjCount: -1 }), TypeError);
	assertThrows(() => getRandomHumanReadable({ adjCount: 1.5 }), TypeError);
	assertThrows(
		() => getRandomHumanReadable({ syllablesCount: -2 }),
		TypeError,
	);
});

Deno.test("invalid joinWith throws TypeError", () => {
	assertThrows(
		() => getRandomHumanReadable({ joinWith: null as unknown as false }),
		TypeError,
	);
	assertThrows(
		() => getRandomHumanReadable({ joinWith: 0 as unknown as false }),
		TypeError,
	);
});

Deno.test("getRandomSentence covers both branches and validates probability", () => {
	assertEquals(getRandomSentence([], 0).endsWith("."), true);
	assert(/ (and|or) /.test(getRandomSentence([], 0)));
	assertEquals(getRandomSentence([], 1).split(" ").length >= 1, true);
	assert(!/ (and|or) /.test(getRandomSentence([], 1)));
	assertThrows(() => getRandomSentence([], 1.1), RangeError);
	assertThrows(() => getRandomSentence([], -0.1), RangeError);
	assertThrows(
		() => getRandomSentence([], NaN as number),
		RangeError,
	);
});

Deno.test("getRandomParagraph validates min/max and probability", () => {
	assertThrows(() => getRandomParagraph(5, 2), RangeError);
	assertThrows(() => getRandomParagraph(-1, 3), TypeError);
	assertThrows(() => getRandomParagraph(1, 1.5), TypeError);
	assertThrows(() => getRandomParagraph(1, 5, 2), RangeError);
	const single = getRandomParagraph(1, 1);
	assert(single.endsWith("."));
});

Deno.test("custom rhrOptions are honored by getRandomSentence", () => {
	const s = getRandomSentence([{ ...none, adjCount: 0, nounsCount: 1 }], 1);
	assertEquals(s.split(" ").length, 1);
});

Deno.test("bias smoke: every sampled word exists in its source list", () => {
	times(200, () => {
		assert(data.adjs.includes(getRandomAdj()));
		assert(data.colors.includes(getRandomColor()));
		assert(data.nouns.includes(getRandomNoun()));
	});
});

Deno.test("source word lists contain no duplicates", () => {
	assertEquals(new Set(data.adjs).size, data.adjs.length);
	assertEquals(new Set(data.colors).size, data.colors.length);
	assertEquals(new Set(data.nouns).size, data.nouns.length);
});

Deno.test("createGenerator: custom rng makes output deterministic", () => {
	const g1 = createGenerator({ rng: mulberry32(42) });
	const g2 = createGenerator({ rng: mulberry32(42) });
	const seq1 = Array.from({ length: 20 }, () => g1.getRandomHumanReadable());
	const seq2 = Array.from({ length: 20 }, () => g2.getRandomHumanReadable());
	assertEquals(seq1, seq2);
	const g3 = createGenerator({ rng: mulberry32(43) });
	const seq3 = Array.from({ length: 20 }, () => g3.getRandomHumanReadable());
	assert(JSON.stringify(seq1) !== JSON.stringify(seq3));
});

Deno.test("createGenerator: custom word lists are honored", () => {
	const g = createGenerator({
		adjs: ["alpha"],
		colors: ["red"],
		nouns: ["thing"],
	});
	assertEquals(g.getRandomAdj(), "alpha");
	assertEquals(g.getRandomColor(), "red");
	assertEquals(g.getRandomNoun(), "thing");
	assertEquals(g.getRandomHumanReadable(), "alpha-red-thing-thing");
	assertEquals(g.data.adjs, ["alpha"]);
});

Deno.test("createGenerator: empty lists rejected", () => {
	assertThrows(() => createGenerator({ adjs: [] }), TypeError);
	assertThrows(() => createGenerator({ colors: [] }), TypeError);
	assertThrows(() => createGenerator({ nouns: [] }), TypeError);
	assertThrows(
		() => createGenerator({ rng: 123 as unknown as () => number }),
		TypeError,
	);
});

Deno.test("createGenerator: full surface is exposed and works", () => {
	const g = createGenerator({ rng: mulberry32(1) });
	assert("aeiouy".includes(g.getRandomVowel()));
	assert("bcdfghjklmnpqrstvwxz".includes(g.getRandomConsonant()));
	assertEquals(g.getRandomSyllable().length, 2);
	assert("0123456789".includes(g.getRandomDigit()));
	assert(g.getRandomSpecialChar().length === 1);
	assertEquals(g.randomizeCase("aaaa").length, 4);
	assert(typeof g.getRandomSentence() === "string");
	assert(typeof g.getRandomParagraph(1, 2) === "string");
});

Deno.test("setRandomSource: swaps the default-generator rng deterministically", () => {
	const original = getRandomSource();
	try {
		const seeded = mulberry32(7);
		setRandomSource(seeded);
		assertEquals(getRandomSource(), seeded);
		setRandomSource(mulberry32(7));
		const a = Array.from({ length: 5 }, () => getRandomAdj());
		setRandomSource(mulberry32(7));
		const b = Array.from({ length: 5 }, () => getRandomAdj());
		assertEquals(a, b);
	} finally {
		setRandomSource(original);
	}
});

Deno.test("setRandomSource: rejects non-function", () => {
	assertThrows(
		() => setRandomSource(123 as unknown as () => number),
		TypeError,
	);
});
