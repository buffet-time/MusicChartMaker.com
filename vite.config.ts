import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	root: './src',
	base: './',

	build: {
		rollupOptions: {
			maxParallelFileReads: 512
		},

		outDir: '../dist'
	},
	plugins: [
		vue({
			isProduction: true
		})
	],
	resolve: {
		alias: {
			'#root': path.resolve(__dirname),
			'#src': path.resolve(__dirname, './src'),
			'#assets': path.resolve(__dirname, './src/assets'),
			'#components': path.resolve(__dirname, './src/components'),
			'#types': path.resolve(__dirname, './src/types'),
			'#core': path.resolve(__dirname, './src/components/CoreComponents')
		}
	}
})
