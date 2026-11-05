<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
	searchProvider: 'lastfm' | 'tmdb'
}>()

const href = ref('')
const src = ref('')

switch (props.searchProvider) {
	case 'lastfm':
		href.value = 'https://www.last.fm/'
		src.value = '/lastFmLogo.svg'
		break

	case 'tmdb':
		href.value = 'https://www.themoviedb.org/'
		src.value = '/tmdbLogo.svg'
		break
}
</script>

<template>
	<div>
		<p class="mb-1">Powered by:</p>
		<a target="_blank" :href="href">
			<img :src="src" class="h-8" />
		</a>
	</div>
</template>
