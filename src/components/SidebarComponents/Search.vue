<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref, type Ref } from 'vue'
import { DragSetData, IsImage, ProperFetch } from '../../shared'
import { type AlbumSearchResult } from '../../types'

const searchInput = ref('')
const searchResults = ref() as Ref<AlbumSearchResult[]>
const showSearchResults = ref(false)

async function search() {
	// handle Direct image adding
	if (await IsImage(searchInput.value)) {
		searchResults.value = [
			{ artist: 'Artist Name', name: 'Album Name', image: searchInput.value }
		]
		showSearchResults.value = true
		return
	}

	searchResults.value = await ProperFetch(
		`https://api.musicchartmaker.com/Search?album=${searchInput.value}&limit=10`
	)

	if (!showSearchResults.value) {
		showSearchResults.value = true
	}
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
					class="p-2 tw-input"
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
