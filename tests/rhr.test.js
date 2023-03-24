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
	getRandomSentence
} from '../dist/index.js';
import { data } from '../dist/index.js';

const suite = new TestRunner(path.basename(fileURLToPath(import.meta.url)));
const clog = createClog(path.basename(fileURLToPath(import.meta.url)));

const times = (n, cb) => {
	n = Math.abs(n);
	if (isNaN(n)) throw new TypeError(`Expecting number`);
	while (n-- > 0) cb();
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
		assert(k.split('-').length === 3, `Expecting '${k}' to have 3 parts`);
	});
});

suite.test('get sentence', () => {
	assert(getRandomSentence().split(' ').length === 9);
});

//
export default suite;
