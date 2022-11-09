<script setup lang="ts">
import { ref } from 'vue'
import type { AlbumSearchResult } from '#types'
import { GlobalSiteOptions } from '#shared/globals'
import { DragSetData, onTouchStart } from '#shared/drag'
import { IsImage, GrayBoxImgFromApi } from '#shared/misc'
import { ProperFetch } from '#shared/misc'

import Tooltip from '../CoreComponents/Tooltip.vue'

const searchInput = ref('')
const searchResults = ref<AlbumSearchResult[]>()
const showSearchResults = ref(false)
let previousSearch = ''

async function search() {
	if (searchInput.value === '') {
		return
	}

	if (previousSearch === searchInput.value) {
		showSearchResults.value = true
		return
	}

	previousSearch = searchInput.value

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
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	dragEvent.dataTransfer!.dropEffect = 'copy'
}

function getSearchResultsLength() {
	return searchResults.value ? searchResults.value.length : 0
}
</script>

<template>
	<div class="flex-col gap-4">
		<div>
			<label>Search: </label>
			<div class="tw-flex-center flex-col gap-2">
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
			class="tw-flex-center flex-wrap mt-2 mx-4 gap-1 h-[102px] overflow-y-scroll md:tw-no-scrollbar md:mx-0 md:h-[415px]"
			:class="{ 'items-start': getSearchResultsLength() < 1 }"
		>
			<div v-if="getSearchResultsLength() < 1" class="flex">
				No valid results or the API is down. Try again in a few seconds or
				change the input.
			</div>
			<Tooltip
				v-for="(album, index) in searchResults"
				v-else
				:key="index"
				:tooltip-name="`search-tooltip-${index}`"
				:offset="[0, 8]"
				:delay="500"
				:placement="'top-start'"
			>
				<template #content>
					<div class="tw-album-image-div-wrapper">
						<img
							width="100"
							class="cursor-grab"
							:src="`${album.image}`"
							:alt="`${album.artist} - ${album.name}`"
							draggable="true"
							@dragstart="(dragEvent) => onDragStart(dragEvent, album)"
							@touchstart.prevent="
								(touchEvent) => onTouchStart(touchEvent, album, 'Search')
							"
						/>

						<div
							v-if="album.image === GrayBoxImgFromApi"
							class="tw-album-image-text-overlay"
						>
							{{ album.artist }} - {{ album.name }}
						</div>
					</div>
				</template>
				<template #tooltip>{{ album.artist }} - {{ album.name }}</template>
			</Tooltip>
		</div>
		<div
			v-show="showSearchResults && getSearchResultsLength() > 1"
			class="rectangle-blur hidden before:absolute before:left-0 before:pointer-events-none before:mt-[-2rem] before:h-8 before:w-full content md:block"
		></div>
	</div>
</template>

<style>
.rectangle-blur:before {
	content: '';
	background-image: linear-gradient(
		to bottom,
		rgba(255, 255, 255, 0),
		rgba(50, 50, 50, 1) 99%
	);
}
</style>
