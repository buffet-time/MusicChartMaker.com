<script setup lang="ts">
import { ref } from 'vue'
import type { AlbumSearchResult } from '#types'
import { GlobalSiteOptions } from '#utils/globals'
import { DragSetData, onTouchStart } from '#utils/drag'
import { IsImage, GrayBoxImgFromApi } from '#utils/misc'

import Tooltip from '#core/Tooltip.vue'
import { searchAlbum } from '#lastfm/main'

const searchInput = ref('')
const searchResults = ref<AlbumSearchResult[]>()
const showSearchResults = ref(false)
let previousSearch = ''

async function search() {
	showSearchResults.value = false
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
			{ artist: 'Artist Name', name: 'Album Name', image: searchInput.value },
		]
		showSearchResults.value = true
		return
	}

	searchResults.value = await searchAlbum(
		GlobalSiteOptions.value.numberOfSearchResults,
		searchInput.value,
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
		originatingIndices: { index1: 0, index2: 0 },
	})

	if (!dragEvent.dataTransfer) {
		return console.error('Error in onDragStart(): ', dragEvent, album)
	}

	dragEvent.dataTransfer.dropEffect = 'copy'
}

function getSearchResultsLength() {
	return searchResults.value ? searchResults.value.length : 0
}
</script>

<template>
	<div class="flex-col h-full gap-4">
		<!-- This is not KISS tho pulling just the search component out to its
			own component adds more complexity than its worth, and adding an
			optional conditional to the tooltip results in jankiness due to how popper works

			to make updates just do it one and copy past the empty div and its contents to the other

			in the future I'll find a more elegant way to do this without making the tooltip messy
		-->
		<template v-if="!GlobalSiteOptions.hideTooltip">
			<Tooltip
				:tooltip-name="`search-input`"
				:offset="[0, 4]"
				:delay="500"
				:placement="'auto'"
			>
				<template #content>
					<div>
						<label>Search: </label>
						<div class="uno-flex-center flex-col gap-2">
							<input
								v-model="searchInput"
								class="uno-input p-2"
								type="search"
								placeholder="Search input"
								@keyup.enter.prevent="search"
							/>
							<div class="flex gap-1">
								<button
									class="uno-button"
									type="button"
									:disabled="searchInput === ''"
									@click="search"
								>
									search
								</button>
								<button
									class="uno-button"
									type="button"
									:disabled="!showSearchResults"
									@click="showSearchResults = false"
								>
									clear results
								</button>
							</div>
						</div>
					</div>
				</template>
				<template #tooltip>
					Uses Last.fm search<br />
					Also accepts image url
				</template>
			</Tooltip>
		</template>

		<template v-else>
			<div>
				<label>Search: </label>
				<div class="uno-flex-center flex-col gap-2">
					<input
						v-model="searchInput"
						class="uno-input p-2"
						type="search"
						placeholder="Search input"
						@keyup.enter.prevent="search"
					/>
					<div class="flex gap-1">
						<button
							class="uno-button"
							type="button"
							:disabled="searchInput === ''"
							@click="search"
						>
							search
						</button>
						<button
							class="uno-button"
							type="button"
							:disabled="!showSearchResults"
							@click="showSearchResults = false"
						>
							clear results
						</button>
					</div>
				</div>
			</div>
		</template>

		<div
			v-if="showSearchResults"
			class="uno-flex-center uno-search-results-div results-div"
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
					<div class="uno-album-image-div-wrapper">
						<img
							width="100"
							class="cursor-grab"
							:src="`${album.image}`"
							:alt="`${album.artist} - ${album.name}`"
							loading="lazy"
							draggable="true"
							@dragstart="(dragEvent) => onDragStart(dragEvent, album)"
							@touchstart.prevent="
								(touchEvent) => onTouchStart(touchEvent, album, 'Search')
							"
						/>

						<div
							v-if="album.image === GrayBoxImgFromApi"
							class="uno-album-image-text-overlay"
						>
							{{ album.artist }} - {{ album.name }}
						</div>
					</div>
				</template>
				<template #tooltip>{{ album.artist }} - {{ album.name }}</template>
			</Tooltip>
		</div>
	</div>
</template>

<style>
.results-div {
	scrollbar-width: thin;
	scrollbar-color: gray dimgray;
	/* 96.8px is the height of the search box */
	max-height: calc(100% - 96.8px - 8px);
	height: 100%;
}
</style>
