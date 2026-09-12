import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import UnoCSS from 'unocss/vite'

// @ts-expect-error - The package is JS w/ no TS definitions.
import { minify } from 'rollup-plugin-swc-minify'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		// nothing should get above the html2canvas chunk size
		chunkSizeWarningLimit: 197,
		rollupOptions: {
			plugins: [minify()],
		},
	},

	plugins: [Vue(), UnoCSS()],
	resolve: {
		alias: {
			'#root': resolve(import.meta.dirname),
			'#src': resolve(import.meta.dirname, './src'),
			'#components': resolve(import.meta.dirname, './src/components'),
			'#types': resolve(import.meta.dirname, './src/types/types.ts'),
			'#core': resolve(import.meta.dirname, './src/components/CoreComponents'),
			'#utils': resolve(import.meta.dirname, './src/utils'),
			'#lastfm': resolve(import.meta.dirname, './src/lastfm'),
			'#stores': resolve(import.meta.dirname, './src/stores'),
			'#tmdb': resolve(import.meta.dirname, './src/tmdb'),
		},
	},
})
