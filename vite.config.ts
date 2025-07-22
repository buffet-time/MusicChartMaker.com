import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
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

	plugins: [vue(), UnoCSS()],
	resolve: {
		alias: {
			'#root': resolve(__dirname),
			'#src': resolve(__dirname, './src'),
			'#components': resolve(__dirname, './src/components'),
			'#types': resolve(__dirname, './src/types/types.ts'),
			'#core': resolve(__dirname, './src/components/CoreComponents'),
			'#utils': resolve(__dirname, './src/utils'),
			'#lastfm': resolve(__dirname, './src/lastfm'),
			'#stores': resolve(__dirname, './src/stores'),
		},
	},
})
