import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
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
