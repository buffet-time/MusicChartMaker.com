<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref, type Ref } from 'vue'
import { DragSetData, ProperFetch } from '../../shared'
import { type AlbumSearchResult } from '../../types'

const searchInput = ref('')
const searchResults = ref() as Ref<AlbumSearchResult[]>
const showSearchResults = ref(false)

// https://stackoverflow.com/a/5717133/4830093
// const urlRegex = new RegExp(
// 	'^(https?:\\/\\/)?' + // protocol
// 		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
// 		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
// 		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
// 		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
// 		'(\\#[-a-z\\d_]*)?$', // fragment locator
// 	'i'
// )

// should ability for setting how many results you get back and make the default smaller to reduce impact
async function search() {
	// if (urlRegex.test(searchInput.value)) {
	// 	// handle direct image adding here
	// }

	searchResults.value = await ProperFetch(
		`https://musicsheet.danielturcich.com/Search?album=${searchInput.value}&limit=10`
	)

	if (!showSearchResults.value) {
		showSearchResults.value = true
	}

	console.log(searchResults.value[5])
}

function onDragStart(dragEvent: DragEvent, album: AlbumSearchResult) {
	DragSetData(dragEvent, { albumObject: album, dragSource: 'Search' })
	dragEvent.dataTransfer!.dropEffect = 'copy'
	// emit('currentAlbum', album)
}
</script>

<template>
	<div class="flex-col gap-4 mt-8 mb-8">
		<div>
			<label class="">Search: </label>
			<div>
				<input
					v-model="searchInput"
					class="p-2 text-black"
					type="search"
					placeholder="Album or Artist"
					@keyup.enter.prevent="search"
				/>
				<button class="ml-1 tw-button" type="button" @click="search">
					search
				</button>
			</div>
		</div>
		<div
			v-if="showSearchResults"
			class="flex flex-wrap items-center justify-center mt-4 gap-1"
		>
			<img
				v-for="(album, index) in searchResults"
				:key="index"
				width="150"
				class="cursor-pointer"
				:src="`${album.image}`"
				:alt="`${album.artist} - ${album.name}`"
				draggable="true"
				@dragstart="(dragEvent) => onDragStart(dragEvent, album)"
			/>
		</div>
	</div>
</template>
