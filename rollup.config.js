import fs from "node:fs";
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))

export default [
	{
		input: 'src/index.ts',
		output: {
			name: 'pubsub',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			resolve(),
			commonjs(),
			typescript(),
		]
	},
	{
		input: 'src/index.ts',
		plugins: [ typescript() ],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];
