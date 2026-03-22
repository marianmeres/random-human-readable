import { assert, assertEquals } from "@std/assert";
import {
	data,
	getRandomAdj,
	getRandomColor,
	getRandomHumanReadable,
	getRandomNoun,
	getRandomParagraph,
	getRandomSentence,
	getRandomSyllable,
	randomizeCase,
} from "../src/random-human-readable.ts";

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
