import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			maxParallelFileReads: 512,
			output: {
				compact: true,
				generatedCode: 'es2015'
			}
		},
		target: 'es2018'
	},
	plugins: [vue()],
	resolve: {
		alias: {
			'#root': path.resolve(__dirname),
			'#src': path.resolve(__dirname, './src'),
			'#assets': path.resolve(__dirname, './src/assets'),
			'#components': path.resolve(__dirname, './src/components'),
			'#types': path.resolve(__dirname, './src/types/types.ts'),
			'#core': path.resolve(__dirname, './src/components/CoreComponents'),
			'#shared': path.resolve(__dirname, './src/shared')
		}
	}
})
