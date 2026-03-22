import { z } from "npm:zod";
import type { McpToolDefinition } from "jsr:@marianmeres/mcp-server/types";
import {
	getRandomHumanReadable,
	getRandomParagraph,
} from "./src/random-human-readable.ts";

export const tools: McpToolDefinition[] = [
	{
		name: "generate-random-human-readable",
		description:
			"Generate random human-readable strings from combinable word lists " +
			"(~1500 nouns, ~250 adjectives, ~130 colors) with configurable counts, " +
			"separator, casing, digits, and special characters",
		params: {
			adjCount: z.number().optional().describe("Number of adjectives (default: 1)"),
			colorsCount: z
				.number()
				.optional()
				.describe("Number of colors (default: 1)"),
			nounsCount: z.number().optional().describe("Number of nouns (default: 2)"),
			syllablesCount: z
				.number()
				.optional()
				.describe("Number of random CV syllables to append (default: 0)"),
			digitsCount: z
				.number()
				.optional()
				.describe("Number of random digits to append (default: 0)"),
			specialCharsCount: z
				.number()
				.optional()
				.describe("Number of special characters to append (default: 0)"),
			randomizeCase: z
				.boolean()
				.optional()
				.describe("Randomize letter casing (default: false)"),
			joinWith: z
				.string()
				.optional()
				.describe('Separator between parts (default: "-")'),
			count: z
				.number()
				.optional()
				.describe("How many strings to generate (default: 1, max: 50)"),
		},
		handler: async (params) => {
			const {
				adjCount,
				colorsCount,
				nounsCount,
				syllablesCount,
				digitsCount,
				specialCharsCount,
				randomizeCase,
				joinWith,
				count,
			} = params as {
				adjCount?: number;
				colorsCount?: number;
				nounsCount?: number;
				syllablesCount?: number;
				digitsCount?: number;
				specialCharsCount?: number;
				randomizeCase?: boolean;
				joinWith?: string;
				count?: number;
			};
			const options = {
				...(adjCount !== undefined && { adjCount }),
				...(colorsCount !== undefined && { colorsCount }),
				...(nounsCount !== undefined && { nounsCount }),
				...(syllablesCount !== undefined && { syllablesCount }),
				...(digitsCount !== undefined && { digitsCount }),
				...(specialCharsCount !== undefined && { specialCharsCount }),
				...(randomizeCase !== undefined && { randomizeCase }),
				...(joinWith !== undefined && { joinWith }),
			};
			const n = Math.min(Math.max(1, count ?? 1), 50);
			const results: string[] = [];
			for (let i = 0; i < n; i++) {
				results.push(getRandomHumanReadable(options) as string);
			}
			return results.join("\n");
		},
	},
	{
		name: "generate-random-paragraph",
		description:
			"Generate random placeholder paragraphs using human-readable word " +
			"combinations (alternative to lorem ipsum)",
		params: {
			minSentences: z
				.number()
				.optional()
				.describe("Minimum sentences per paragraph (default: 1)"),
			maxSentences: z
				.number()
				.optional()
				.describe("Maximum sentences per paragraph (default: 5)"),
			paragraphs: z
				.number()
				.optional()
				.describe("Number of paragraphs to generate (default: 1, max: 20)"),
		},
		handler: async (params) => {
			const { minSentences, maxSentences, paragraphs } = params as {
				minSentences?: number;
				maxSentences?: number;
				paragraphs?: number;
			};
			const n = Math.min(Math.max(1, paragraphs ?? 1), 20);
			const results: string[] = [];
			for (let i = 0; i < n; i++) {
				results.push(getRandomParagraph(minSentences, maxSentences));
			}
			return results.join("\n\n");
		},
	},
];
