import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import UnoCSS from 'unocss/vite'
// @ts-expect-error
import { minify } from 'rollup-plugin-swc-minify'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		chunkSizeWarningLimit: 100,
		rollupOptions: {
			maxParallelFileOps: 512,
			plugins: [minify()],
		},
		sourcemap: true,
		terserOptions: {
			ecma: 2020,
		},
	},

	plugins: [
		vue({
			script: {
				propsDestructure: true,
			},
		}),
		UnoCSS(),
	],
	resolve: {
		alias: {
			'#root': resolve(__dirname),
			'#src': resolve(__dirname, './src'),
			'#components': resolve(__dirname, './src/components'),
			'#types': resolve(__dirname, './src/types/types.ts'),
			'#core': resolve(__dirname, './src/components/CoreComponents'),
			'#utils': resolve(__dirname, './src/utils'),
			'#lastfm': resolve(__dirname, './src/lastfm'),
		},
	},
})
