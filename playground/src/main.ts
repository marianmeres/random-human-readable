/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="esnext" />
/**
 * Playground app for `@marianmeres/random-human-readable`.
 *
 * Built with `@marianmeres/vanilla`: explicit reactive state (`observable` /
 * `computed`), markup that lives in `<template>`s (`fromTemplate` / `refs`),
 * and a single delegated listener tree (`delegate`). All wiring is torn down by
 * the view's `track()`-based lifecycle.
 *
 * This is browser code: the triple-slash lib references above type it against
 * the DOM (the repo's `deno.json` targets the Deno runtime for the library).
 *
 * Bundle with: `deno task playground:build` (→ `playground/dist/bundle.js`).
 */
import {
	computed,
	createView,
	delegate,
	fromTemplate,
	observable,
	reactTo,
	refs,
} from "@marianmeres/vanilla";
import { getRandomHumanReadable, type Options } from "../../src/mod.ts";
import { VERSION } from "./version.generated.ts";

/* ---- Config --------------------------------------------------------------- */

interface SliderDef {
	key: keyof Options;
	label: string;
	min: number;
	max: number;
	value: number;
	/** Visually de-emphasized (the original "secondary" columns). */
	muted?: boolean;
}

/** The sliders, in display order. Defaults mirror the library's own defaults. */
const SLIDERS: SliderDef[] = [
	{ key: "adjCount", label: "adjectives", min: 0, max: 5, value: 1 },
	{ key: "colorsCount", label: "colors", min: 0, max: 5, value: 0 },
	{ key: "nounsCount", label: "nouns", min: 0, max: 5, value: 2 },
	{
		key: "syllablesCount",
		label: "syllables",
		min: 0,
		max: 10,
		value: 0,
		muted: true,
	},
	{
		key: "digitsCount",
		label: "digits",
		min: 0,
		max: 10,
		value: 2,
		muted: true,
	},
	{
		key: "specialCharsCount",
		label: "special chars",
		min: 0,
		max: 10,
		value: 0,
		muted: true,
	},
];

const RESULT_COUNT = 10;
/** Must match the literal in the anti-FOUC inline script in index.html. */
const THEME_KEY = "rhr-playground-theme";

/* ---- State (module-level: outlives any view) ------------------------------ */

const initialOpts: Partial<Options> = { randomizeCase: true };
for (const s of SLIDERS)
	(initialOpts as Record<string, number>)[s.key] = s.value;

const opts = observable<Partial<Options>>(initialOpts);
// Bumped by "Refresh" to re-roll the results without changing the options.
const nonce = observable(0);

// Re-roll whenever the options OR the refresh nonce change. `computed` caches
// and only fans out when the array reference changes (every roll → new array).
const results = computed([opts, nonce], () =>
	Array.from(
		{ length: RESULT_COUNT },
		() => getRandomHumanReadable(opts.get()) as string,
	),
);

/* ---- Theme (page-level, class-based: matches the design-tokens `.dark`) ----
 * The class is set pre-paint by the inline script in index.html; this keeps it
 * and the browser chrome color (<meta name="theme-color">) in sync afterwards. */

const prefersDark = (): boolean =>
	globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;

const applyTheme = (dark: boolean): void => {
	const root = document.documentElement;
	root.classList.toggle("dark", dark);
	const bg = getComputedStyle(root)
		.getPropertyValue("--stuic-color-background")
		.trim();
	if (bg) {
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute("content", bg);
	}
};

let isDark = (() => {
	const stored = localStorage.getItem(THEME_KEY);
	return stored ? stored === "dark" : prefersDark();
})();
applyTheme(isDark);

const toggleTheme = (): void => {
	isDark = !isDark;
	applyTheme(isDark);
	localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
};

/* ---- Clipboard ------------------------------------------------------------ */

let copyTimer: ReturnType<typeof setTimeout> | undefined;

const clearCopied = (scope: ParentNode): void =>
	scope
		.querySelectorAll(".result.copied")
		.forEach((e) => e.classList.remove("copied"));

// Fallback for non-secure contexts (e.g. a plain-IP http LAN address) where
// the async Clipboard API is unavailable. Selects the iOS-friendly way, since
// a plain `.select()` is unreliable on iOS Safari. Returns whether it copied.
const legacyCopy = (text: string): boolean => {
	const ta = document.createElement("textarea");
	ta.value = text;
	ta.readOnly = true;
	ta.contentEditable = "true";
	ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
	document.body.appendChild(ta);
	const range = document.createRange();
	range.selectNodeContents(ta);
	const sel = globalThis.getSelection();
	sel?.removeAllRanges();
	sel?.addRange(range);
	ta.setSelectionRange(0, text.length);
	let ok = false;
	try {
		ok = document.execCommand("copy");
	} catch {
		/* give up silently */
	}
	ta.remove();
	return ok;
};

const copy = async (btn: HTMLElement): Promise<void> => {
	const text = btn.textContent ?? "";
	if (!text) return;
	let ok = false;
	try {
		await navigator.clipboard.writeText(text);
		ok = true;
	} catch {
		ok = legacyCopy(text);
	}
	if (!ok) return; // never show false "Copied!" feedback
	const root = btn.closest(".results") ?? document;
	if (copyTimer) clearTimeout(copyTimer);
	clearCopied(root);
	btn.classList.add("copied");
	copyTimer = setTimeout(() => clearCopied(root), 2000);
};

/* ---- View ----------------------------------------------------------------- */

const app = createView((track) => {
	const el = fromTemplate("tpl-app");
	const r = refs(el);

	// Build the sliders from the template; remember their value/input nodes so
	// the opts -> DOM sync below can address them without re-querying.
	const valueOf: Record<string, HTMLElement> = {};
	const inputOf: Record<string, HTMLInputElement> = {};
	for (const def of SLIDERS) {
		const ctl = fromTemplate("tpl-control");
		const cr = refs(ctl);
		const input = cr.input as HTMLInputElement;
		input.id = `ctl-${def.key}`;
		(cr.label as HTMLLabelElement).htmlFor = input.id; // explicit label association
		cr.label.textContent = def.label;
		input.min = String(def.min);
		input.max = String(def.max);
		input.value = String(def.value);
		input.dataset.key = def.key;
		if (def.muted) ctl.classList.add("control--muted");
		valueOf[def.key] = cr.value;
		inputOf[def.key] = input;
		r.controls.appendChild(ctl);
	}

	// One-directional sync: opts → DOM (value labels, slider positions, switch).
	track(
		reactTo([opts], () => {
			const o = opts.get() as Record<string, number | boolean>;
			for (const def of SLIDERS) {
				const v = String(o[def.key] as number);
				valueOf[def.key].textContent = v;
				if (inputOf[def.key].value !== v) inputOf[def.key].value = v;
			}
			(r.randomizeCase as HTMLInputElement).checked = !!o.randomizeCase;
		}),
	);

	// Render the result list whenever the rolled strings change.
	track(
		results.subscribe((list) => {
			const allEmpty = list.every((s) => s === "");
			r.empty.hidden = !allEmpty;
			r.results.hidden = allEmpty;
			r.results.replaceChildren();
			if (allEmpty) return;
			for (const str of list) {
				const li = fromTemplate("tpl-result");
				const btn = li.querySelector<HTMLElement>(".result")!;
				btn.textContent = str;
				r.results.appendChild(li);
			}
		}),
	);

	// One delegated listener tree for the whole view (events bubble to `el`).
	track(
		delegate(el, {
			setCount: (_e, input) => {
				const key = (input as HTMLInputElement).dataset.key!;
				const v = parseInt((input as HTMLInputElement).value, 10);
				if (v === (opts.get() as Record<string, number>)[key]) return; // no-op
				opts.update((o) => ({ ...o, [key]: v }));
			},
			toggleCase: (_e, input) =>
				opts.update((o) => ({
					...o,
					randomizeCase: (input as HTMLInputElement).checked,
				})),
			refresh: () => nonce.update((n) => n + 1),
			toggleTheme: () => toggleTheme(),
			copy: (_e, btn) => copy(btn),
		}),
	);

	r.version.textContent = `v${VERSION}`;

	return { el };
});

document.getElementById("app")!.appendChild(app.el!);
