<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref, type Ref } from 'vue'
import { DragSetData, IsImage, GlobalSiteOptions } from '#src/shared'
import { type AlbumSearchResult } from '#types/types'
import { ProperFetch } from '#src/wrappers'

const searchInput = ref('')
const searchResults = ref() as Ref<AlbumSearchResult[]>
const showSearchResults = ref(false)
let previousSearch = ''

async function search() {
	if (searchInput.value === '') {
		return
	}

	if (previousSearch === searchInput.value) {
		showSearchResults.value = true
	}

	// handle Direct image adding
	if (await IsImage(searchInput.value)) {
		searchResults.value = [
			{ artist: 'Artist Name', name: 'Album Name', image: searchInput.value }
		]
		showSearchResults.value = true
		return
	}

	searchResults.value = await ProperFetch(
		`https://api.musicchartmaker.com/Search?album=${searchInput.value}&limit=${GlobalSiteOptions.value.numberOfSearchResults}`
	)

	previousSearch = searchInput.value

	if (!showSearchResults.value) {
		showSearchResults.value = true
	}
}

function onDragStart(dragEvent: DragEvent, album: AlbumSearchResult) {
	DragSetData(dragEvent, {
		albumObject: album,
		dragSource: 'Search',
		// included just because im bad with ts typing and dont want it to optional in chart
		originatingIndices: { index1: 0, index2: 0 }
	})
	dragEvent.dataTransfer!.dropEffect = 'copy'
}
</script>

<template>
	<div class="flex-col gap-4 mt-3">
		<div>
			<label>Search: </label>
			<div class="flex flex-col justify-center items-center gap-2">
				<input
					v-model="searchInput"
					class="p-2 tw-input"
					type="search"
					placeholder="Album or Artist"
					@keyup.enter.prevent="search"
				/>
				<div>
					<button
						class="ml-1 tw-button"
						type="button"
						:disabled="searchInput === ''"
						@click="search"
					>
						search
					</button>
					<button
						class="ml-1 tw-button"
						type="button"
						:disabled="!showSearchResults"
						@click="showSearchResults = false"
					>
						clear results
					</button>
				</div>
			</div>
		</div>

		<div
			v-show="showSearchResults"
			class="flex flex-wrap items-center justify-center mt-2 gap-1 h-[415px] overflow-auto no-scrollbar"
		>
			<img
				v-for="(album, index) in searchResults"
				:key="index"
				width="100"
				class="cursor-pointer"
				:src="`${album.image}`"
				:alt="`${album.artist} - ${album.name}`"
				draggable="true"
				@dragstart="(dragEvent) => onDragStart(dragEvent, album)"
			/>
		</div>
	</div>
</template>
