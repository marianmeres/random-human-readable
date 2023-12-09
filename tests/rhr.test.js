import path from 'node:path';
import { strict as assert } from 'node:assert';
import { TestRunner } from '@marianmeres/test-runner';
import { fileURLToPath } from 'node:url';
import { createClog } from '@marianmeres/clog';
import {
	getRandomNoun,
	getRandomColor,
	getRandomAdj,
	getRandomSyllable,
	randomizeCase,
	getRandomHumanReadable,
	getRandomSentence,
	getRandomParagraph,
} from '../dist/index.js';
import { data } from '../dist/index.js';

const suite = new TestRunner(path.basename(fileURLToPath(import.meta.url)));
const clog = createClog(path.basename(fileURLToPath(import.meta.url)));

const times = (n, cb) => {
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
	joinWith: '',
};

suite.test('sanity check', () => {
	assert(data.adjs.includes(getRandomAdj()));
	assert(data.colors.includes(getRandomColor()));
	assert(data.nouns.includes(getRandomNoun()));
	assert(getRandomSyllable().length === 2);
	assert(/abcdefg/i.test(randomizeCase('abcdefg')));
	assert(randomizeCase('abcdefg') !== randomizeCase('abcdefg'));
});

suite.test('main fn works', () => {
	// just some dummy tests
	const log = {};
	times(100, () => (log[getRandomHumanReadable()] = true));
	assert(Object.keys(log).length === 100);
	Object.keys(log).forEach((k) => {
		assert(k.split('-').length === 4, `Expecting '${k}' to have 4 parts`);
	});
});

suite.test('get sentence', () => {
	assert(typeof getRandomSentence() === 'string'); // hm...
});

suite.test('digits', () => {
	assert(/^\d{3}$/.test(getRandomHumanReadable({ ...none, digitsCount: 3 })));
});

suite.test('special chars', () => {
	assert(/^[\W]{500}$/.test(getRandomHumanReadable({ ...none, specialCharsCount: 500 })));
});

suite.test('random paragraph', () => {
	assert(typeof getRandomParagraph() === 'string'); // hm...
});

//
export default suite;
