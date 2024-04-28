import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		chunkSizeWarningLimit: 100,
		rollupOptions: {
			maxParallelFileOps: 512
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
		})
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
