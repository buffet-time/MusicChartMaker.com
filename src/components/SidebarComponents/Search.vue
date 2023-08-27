<script setup lang="ts">
import { ref } from 'vue'
import type { AlbumSearchResult } from '#types'
import { GlobalSiteOptions } from '#shared/globals'
import { DragSetData, onTouchStart } from '#shared/drag'
import { IsImage, GrayBoxImgFromApi } from '#shared/misc'

import Tooltip from '#core/Tooltip.vue'
import { searchAlbum } from '#lastfm/main'

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

	searchResults.value = await searchAlbum(
		GlobalSiteOptions.value.numberOfSearchResults,
		searchInput.value
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
	<div class="flex-col gap-4">
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
						<div class="tw-flex-center flex-col gap-2">
							<input
								v-model="searchInput"
								class="tw-input p-2"
								type="search"
								placeholder="Search input"
								@keyup.enter.prevent="search"
							/>
							<div class="flex gap-1">
								<button
									class="tw-button"
									type="button"
									:disabled="searchInput === ''"
									@click="search"
								>
									search
								</button>
								<button
									class="tw-button"
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
				<div class="tw-flex-center flex-col gap-2">
					<input
						v-model="searchInput"
						class="tw-input p-2"
						type="search"
						placeholder="Search input"
						@keyup.enter.prevent="search"
					/>
					<div class="flex gap-1">
						<button
							class="tw-button"
							type="button"
							:disabled="searchInput === ''"
							@click="search"
						>
							search
						</button>
						<button
							class="tw-button"
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
			v-show="showSearchResults"
			class="tw-search-results-div"
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
							loading="lazy"
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
			class="rectangle-blur content hidden before:pointer-events-none before:absolute before:left-0 before:mt-[-2rem] before:h-8 before:w-full md:block"
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
