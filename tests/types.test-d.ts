// Compile-time-only assertions about getRandomHumanReadable's return type.
// This file is type-checked by `deno test` (which checks all .ts files under
// tests/) but executes nothing.

import { createGenerator, getRandomHumanReadable } from "../src/random-human-readable.ts";

type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
	? true
	: false;

const assertType = <_T extends true>(): void => {};

// No args -> default joinWith "-" -> string
assertType<Equals<ReturnType<typeof getRandomHumanReadable>, string>>();

// joinWith: string -> string
{
	const r = getRandomHumanReadable({ joinWith: "_" });
	assertType<Equals<typeof r, string>>();
}

// joinWith: false -> string[]
{
	const r = getRandomHumanReadable({ joinWith: false });
	assertType<Equals<typeof r, string[]>>();
}

// joinWith: undefined -> string (default applied)
{
	const r = getRandomHumanReadable({ joinWith: undefined });
	assertType<Equals<typeof r, string>>();
}

// createGenerator returns the same surface
{
	const g = createGenerator();
	assertType<Equals<ReturnType<typeof g.getRandomHumanReadable>, string>>();
	const arr = g.getRandomHumanReadable({ joinWith: false });
	assertType<Equals<typeof arr, string[]>>();
}
