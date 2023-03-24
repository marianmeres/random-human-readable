export declare const data: {
    adjs: string[];
    colors: string[];
    nouns: string[];
};
export declare const getRandomAdj: () => string;
export declare const getRandomColor: () => string;
export declare const getRandomNoun: () => string;
export declare const getRandomVowel: () => string;
export declare const getRandomConsonant: () => string;
export declare const getRandomSyllable: () => string;
export declare const getRandomSentence: () => string;
export declare const randomizeCase: (str: string) => string;
interface Options {
    adjCount: number;
    colorsCount: number;
    nounsCount: number;
    syllablesCount: number;
    randomizeCase: boolean;
    joinWith: string | false;
}
export declare const getRandomHumanReadable: (options?: Partial<Options>) => string | string[];
export {};
