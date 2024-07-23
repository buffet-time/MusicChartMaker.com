import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
// @ts-expect-error
import { minify } from 'rollup-plugin-swc-minify'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		chunkSizeWarningLimit: 100,
		rollupOptions: {
			maxParallelFileOps: 512,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			plugins: [minify()]
		},
		sourcemap: true,
		terserOptions: {
			ecma: 2020
		}
	},

	plugins: [
		vue({
			script: {
				propsDestructure: true
			}
		}),
		UnoCSS()
	],
	resolve: {
		alias: {
			'#root': resolve(__dirname),
			'#src': resolve(__dirname, './src'),
			'#components': resolve(__dirname, './src/components'),
			'#types': resolve(__dirname, './src/types/types.ts'),
			'#core': resolve(__dirname, './src/components/CoreComponents'),
			'#shared': resolve(__dirname, './src/shared'),
			'#lastfm': resolve(__dirname, './src/lastfm')
		}
	}
})
